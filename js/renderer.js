/* ══════════════════════════════════════════════════════════════════
   CLIDecoder — Explainshell-Style Renderer
   Draws: coloured token bar → connector lines → description cards
   ══════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const TYPE_LABELS = {
        cmd: 'Command', sub: 'Subcommand', flag: 'Flag', arg: 'Argument',
        val: 'Value', pipe: 'Operator', other: 'Other',
    };

    /** Render all results into the #results container */
    function render(rawCmd, tokens) {
        const results = document.getElementById('results');
        const summaryBar = document.getElementById('summaryBar');
        const tokenBar = document.getElementById('tokenBar');
        const cardArea = document.getElementById('cardArea');
        const unknDiv = document.getElementById('unknownNotice');

        /* ── Summary ────────────────────────────────────── */
        const cmdTok = tokens.find(t => t.type === 'cmd');
        const cmdName = cmdTok ? cmdTok.text.replace(/^.*\//, '') : '';
        const kbEntry = window.CLIParser.getKB(cmdName);
        const cover = window.CLIParser.coverageLevel(tokens);
        const badgeCls = cover === 'full' ? 'coverage-full' : cover === 'part' ? 'coverage-part' : 'coverage-none';
        const badgeTxt = cover === 'full' ? 'FULL COVERAGE' : cover === 'part' ? 'PARTIAL' : 'GENERIC';
        const sumText = kbEntry ? kbEntry.desc : (cmdName ? `${cmdName} command breakdown` : 'Command breakdown');

        summaryBar.innerHTML = '';
        const strong = document.createElement('strong');
        strong.textContent = 'What it does: ';
        summaryBar.appendChild(strong);
        summaryBar.appendChild(document.createTextNode(sumText));
        const badge = document.createElement('span');
        badge.className = `coverage-badge ${badgeCls}`;
        badge.textContent = badgeTxt;
        summaryBar.appendChild(badge);

        /* ── Unknown notice ─────────────────────────────── */
        unknDiv.innerHTML = '';
        if (!kbEntry && cmdName) {
            const n = document.createElement('div');
            n.className = 'unknown-notice';
            n.textContent = `"${cmdName}" is not in the built-in knowledge base. Flags and arguments are classified by common patterns. Add it by creating data/${cmdName}.js — see data/FORMAT.md.`;
            unknDiv.appendChild(n);
        }

        /* ── Token bar (explainshell style) ─────────────── */
        tokenBar.innerHTML = '';

        // Prompt
        const prompt = document.createElement('span');
        prompt.className = 'tok-prompt';
        prompt.textContent = '$ ';
        tokenBar.appendChild(prompt);

        tokens.forEach((tok, i) => {
            const col = document.createElement('span');
            col.className = `tok-col tok-type-${tok.type}`;
            col.dataset.idx = i;

            // Token text
            const label = document.createElement('span');
            label.className = 'tok-text';
            label.textContent = tok.text;
            col.appendChild(label);

            // Underline bar
            const bar = document.createElement('span');
            bar.className = 'tok-underline';
            col.appendChild(bar);

            tokenBar.appendChild(col);

            // Add space between tokens (not after last)
            if (i < tokens.length - 1) {
                const sp = document.createElement('span');
                sp.className = 'tok-space';
                sp.textContent = ' ';
                tokenBar.appendChild(sp);
            }
        });

        /* ── Description cards grid ─────────────────────── */
        cardArea.innerHTML = '';
        tokens.forEach((tok, i) => {
            if (!tok.text.trim()) return;

            const card = document.createElement('div');
            card.className = `desc-card desc-type-${tok.type}`;
            card.style.animationDelay = `${i * 40}ms`;
            card.dataset.idx = i;

            // Coloured left border is handled by CSS

            // Header row: token + badge
            const header = document.createElement('div');
            header.className = 'desc-card-header';

            const tokLabel = document.createElement('span');
            tokLabel.className = `desc-token tok-type-${tok.type}`;
            tokLabel.textContent = tok.text;

            const typeBadge = document.createElement('span');
            typeBadge.className = `desc-badge desc-badge-${tok.type}`;
            typeBadge.textContent = TYPE_LABELS[tok.type] || tok.type;

            header.appendChild(tokLabel);
            header.appendChild(typeBadge);

            // Description
            const desc = document.createElement('div');
            desc.className = 'desc-text';
            desc.textContent = tok.desc;

            card.appendChild(header);
            card.appendChild(desc);
            cardArea.appendChild(card);

            // Hover interaction: highlight token ↔ card
            card.addEventListener('mouseenter', () => {
                const t = tokenBar.querySelector(`.tok-col[data-idx="${i}"]`);
                if (t) t.classList.add('tok-highlight');
            });
            card.addEventListener('mouseleave', () => {
                const t = tokenBar.querySelector(`.tok-col[data-idx="${i}"]`);
                if (t) t.classList.remove('tok-highlight');
            });
        });

        // Also highlight card when hovering token
        tokenBar.querySelectorAll('.tok-col').forEach(col => {
            col.addEventListener('mouseenter', () => {
                const idx = col.dataset.idx;
                const c = cardArea.querySelector(`.desc-card[data-idx="${idx}"]`);
                if (c) c.classList.add('desc-highlight');
                col.classList.add('tok-highlight');
            });
            col.addEventListener('mouseleave', () => {
                const idx = col.dataset.idx;
                const c = cardArea.querySelector(`.desc-card[data-idx="${idx}"]`);
                if (c) c.classList.remove('desc-highlight');
                col.classList.remove('tok-highlight');
            });
        });

        results.style.display = 'block';
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.CLIRenderer = { render: render };
})();
