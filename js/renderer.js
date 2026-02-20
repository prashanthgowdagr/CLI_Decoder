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

    /** Create a descriptive sentence based on token data */
    function generateNaturalSummary(tokens) {
        const cmdTok = tokens.find(t => t.type === 'cmd');
        if (!cmdTok) return 'Command breakdown';

        const cmdName = cmdTok.text.replace(/^.*\//, '');
        const kbEntry = window.CLIParser.getKB(cmdName);

        const subs = tokens.filter(t => t.type === 'sub');
        const lastSub = subs[subs.length - 1];

        // 1. Initial Action
        let action = '';
        if (lastSub && lastSub.desc) {
            action = lastSub.desc;
        } else if (kbEntry && kbEntry.desc) {
            action = kbEntry.desc;
        } else {
            action = `${cmdName} command`;
        }

        // Clean up action (strip trailing periods, etc.)
        action = action.trim().replace(/\.$/, '');

        // 2. Meaningful Modifiers (Flags with non-generic descriptions)
        const GENERIC_FRAGS = ['Option flag', 'Set the', 'Combined flags', 'Generic'];
        const modifiers = tokens
            .filter(t => t.type === 'flag' && !GENERIC_FRAGS.some(g => t.desc.startsWith(g)))
            .map(t => t.desc.trim().toLowerCase().replace(/\.$/, ''));

        // 3. Primary Target (First value or argument that isn't purely generic)
        const targets = tokens
            .filter(t => (t.type === 'val' || t.type === 'arg') && !['Argument', 'Value'].includes(t.desc))
            .map(t => t.text);

        // 4. Assemble
        let summary = action;

        // If action is short, or we have interesting flags
        if (modifiers.length > 0) {
            const uniqueMods = Array.from(new Set(modifiers)).slice(0, 2);
            summary += ` using ${uniqueMods.join(' and ')}`;
        }

        // Add target if it's not already redundant
        if (targets.length > 0) {
            const first = targets[0];
            if (!summary.toLowerCase().includes(first.toLowerCase())) {
                summary += ` for ${first}`;
            }
        }

        // 5. Pipe suffix
        if (tokens.some(t => t.type === 'pipe')) {
            summary += ' and processes output in a pipeline';
        }

        // Final polish
        return summary.charAt(0).toUpperCase() + summary.slice(1);
    }

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

        const sumText = generateNaturalSummary(tokens);

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

        const uniqueCardsMap = new Map(); // key -> card index

        tokens.forEach((tok, i) => {
            if (!tok.text.trim()) return;

            const dedupKey = `${tok.type}::${tok.text}::${tok.desc}`;

            if (uniqueCardsMap.has(dedupKey)) {
                // We already created a card for this exact flag/argument
                const existingIdx = uniqueCardsMap.get(dedupKey);
                const col = tokenBar.querySelector(`.tok-col[data-idx="${i}"]`);
                if (col) col.dataset.cardIdx = existingIdx;
                return; // Skip creating a new card
            }

            // Record this new unique card
            uniqueCardsMap.set(dedupKey, i);

            // Link the token's UI to this new card ID
            const col = tokenBar.querySelector(`.tok-col[data-idx="${i}"]`);
            if (col) col.dataset.cardIdx = i;

            const card = document.createElement('div');
            card.className = `desc-card desc-type-${tok.type}`;
            card.style.animationDelay = `${i * 30}ms`;
            card.dataset.idx = i; // Represents the canonical "card ID"

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

            // Hover card -> Highlight ALL matching tokens
            card.addEventListener('mouseenter', () => {
                tokenBar.querySelectorAll(`.tok-col[data-card-idx="${i}"]`).forEach(t => t.classList.add('tok-highlight'));
            });
            card.addEventListener('mouseleave', () => {
                tokenBar.querySelectorAll(`.tok-col[data-card-idx="${i}"]`).forEach(t => t.classList.remove('tok-highlight'));
            });
        });

        // Hover token -> Highlight card and self
        tokenBar.querySelectorAll('.tok-col').forEach(col => {
            col.addEventListener('mouseenter', () => {
                const cardIdx = col.dataset.cardIdx;
                const c = cardArea.querySelector(`.desc-card[data-idx="${cardIdx}"]`);
                if (c) c.classList.add('desc-highlight');
                col.classList.add('tok-highlight');
            });
            col.addEventListener('mouseleave', () => {
                const cardIdx = col.dataset.cardIdx;
                const c = cardArea.querySelector(`.desc-card[data-idx="${cardIdx}"]`);
                if (c) c.classList.remove('desc-highlight');
                col.classList.remove('tok-highlight');
            });
        });

        results.style.display = 'block';
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.CLIRenderer = { render: render };
})();
