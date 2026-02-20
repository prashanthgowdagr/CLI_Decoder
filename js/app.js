/* ══════════════════════════════════════════════════════════════════
   CLIDecoder — App Controller
   Platform chips, examples, theme, input handling
   ══════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const MAX_LEN = 500;

    /* ── Examples per platform ─────────────────────────────────────── */
    const EXAMPLES = {
        linux: [
            'ls -lah /var/log',
            'grep -rn "error" ./logs --include="*.log"',
            'tar -czvf backup.tar.gz /home/user',
            'find / -name "*.conf" -type f 2>/dev/null',
            'chmod 755 script.sh && ./script.sh',
            'ps aux | grep nginx',
            'du -sh /* | sort -rh | head -10',
            'curl -s https://api.example.com | jq .',
        ],
        docker: [
            'docker run -d --name web -p 80:80 nginx',
            'docker build -t myapp:v1 --no-cache .',
            'docker ps -a',
            'docker logs -f --tail=100 myapp',
            'docker exec -it myapp /bin/bash',
            'docker-compose up -d --build',
        ],
        git: [
            'git log --oneline --graph --decorate',
            'git commit -am "fix: resolve login issue"',
            'git push origin main --force',
            'git rebase -i HEAD~5',
            'git stash pop',
            'git diff HEAD~1 --stat',
            'git checkout -b feature/auth',
        ],
        kubernetes: [
            'kubectl get pods -n production --watch',
            'kubectl apply -f deployment.yaml --dry-run=client',
            'kubectl logs -f deploy/myapp -n staging --tail=100',
            'kubectl exec -it pod/myapp -n prod -- /bin/sh',
            'kubectl rollout restart deployment/myapp -n prod',
            'kubectl scale deployment myapp --replicas=5',
            'helm install myrelease chart/ -f values.yaml -n prod',
        ],
        aws: [
            'aws s3 cp ./dist s3://my-bucket/ --recursive --acl public-read',
            'aws ec2 describe-instances --filters "Name=tag:Env,Values=prod"',
            'aws lambda invoke --function-name myFunc out.json',
            'aws logs tail /aws/lambda/myFunction --follow',
        ],
        azure: [
            'az vm create --name myVM --resource-group myRG --image UbuntuLTS',
            'az storage blob upload --file data.csv --container mycontainer --name data.csv',
            'az acr build --registry myRegistry --image myimage:v1 .',
            'az aks get-credentials --resource-group myRG --name myCluster',
        ],
        gcp: [
            'gcloud compute instances create my-vm --zone=us-central1-a --machine-type=e2-medium',
            'gsutil cp -r gs://source-bucket/* gs://dest-bucket/',
            'gcloud container clusters get-credentials my-cluster --zone us-central1',
            'gcloud run deploy myapp --image gcr.io/proj/myapp --allow-unauthenticated',
        ],
        terraform: [
            'terraform plan -var-file=prod.tfvars -out=tfplan',
            'terraform apply -auto-approve -parallelism=20',
            'terraform state rm module.vpc.aws_subnet.public',
            'terraform init -upgrade',
            'terraform workspace select production',
        ],
    };

    let activePlatform = 'linux';

    /* ── Platform chips ────────────────────────────────────────────── */
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => {
                c.classList.remove('active');
                c.removeAttribute('aria-pressed');
            });
            chip.classList.add('active');
            chip.setAttribute('aria-pressed', 'true');
            activePlatform = chip.dataset.platform;
            renderExamples();
        });
        if (chip.dataset.platform === activePlatform) {
            chip.setAttribute('aria-pressed', 'true');
        }
    });

    function renderExamples() {
        const row = document.getElementById('examplesRow');
        row.innerHTML = '';
        (EXAMPLES[activePlatform] || []).forEach(text => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'example-pill';
            btn.textContent = text;
            btn.addEventListener('click', () => {
                document.getElementById('cmdInput').value = text;
                updateCharCounter(text.length);
                explainCommand();
            });
            row.appendChild(btn);
        });
    }
    renderExamples();

    /* ── Character counter ─────────────────────────────────────────── */
    function updateCharCounter(len) {
        const el = document.getElementById('charCounter');
        el.textContent = `${len} / ${MAX_LEN}`;
        el.className = 'char-counter' + (len >= MAX_LEN ? ' limit' : len >= MAX_LEN * 0.8 ? ' warn' : '');
    }
    document.getElementById('cmdInput').addEventListener('input', e => updateCharCounter(e.target.value.length));

    /* ── Theme ─────────────────────────────────────────────────────── */
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('clidecoder_theme', theme);
        const isDark = theme === 'dark';
        document.getElementById('themeLabel').textContent = isDark ? 'Light Mode' : 'Dark Mode';
        document.getElementById('themeIcon').innerHTML = isDark
            ? '<path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>'
            : '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
    }

    function toggleTheme() {
        applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    }

    /* ── AI Integration ────────────────────────────────────────────── */
    const AI_KEY_STORAGE = 'clidecoder_gemini_key';

    function toggleAISettings() {
        const panel = document.getElementById('aiSettings');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        if (panel.style.display === 'block') {
            document.getElementById('geminiApiKey').value = localStorage.getItem(AI_KEY_STORAGE) || '';
        }
    }

    function saveAIConfig() {
        const key = document.getElementById('geminiApiKey').value.trim();
        if (key) {
            localStorage.setItem(AI_KEY_STORAGE, key);
            alert('Gemini API Key saved locally!');
            toggleAISettings();
            checkAIButtonState();
        } else {
            localStorage.removeItem(AI_KEY_STORAGE);
            alert('API Key removed.');
            checkAIButtonState();
        }
    }

    function checkAIButtonState() {
        const key = localStorage.getItem(AI_KEY_STORAGE);
        const hasKey = !!key;
        const btn = document.getElementById('aiAskBtn');
        if (btn) btn.style.display = hasKey ? 'flex' : 'none';

        const status = document.getElementById('aiConnStatus');
        if (status) {
            if (hasKey) {
                status.className = 'ai-conn-status status-success';
                status.textContent = 'API Key Saved & Active';
            } else {
                status.className = 'ai-conn-status';
                status.textContent = 'No API Key set (Offline-only mode)';
            }
        }
    }

    async function testGeminiConnection() {
        const keyInput = document.getElementById('geminiApiKey').value.trim();
        const status = document.getElementById('aiConnStatus');
        if (!keyInput) {
            alert('Please enter a key to test.');
            return;
        }

        status.className = 'ai-conn-status status-loading';
        status.textContent = 'Discovering available models...';

        try {
            // Step 1: Discover available models for this specific API key
            const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${keyInput}`);
            const listData = await listResponse.json();

            if (!listResponse.ok || listData.error) {
                const errMsg = listData.error ? listData.error.message : listResponse.statusText;
                throw new Error(errMsg);
            }

            // Find the best Gemini model available
            const availableModels = listData.models || [];
            let targetModel = '';

            // Prefer flash models, fallback to pro, then any gemini model supporting generateContent
            const flashModels = availableModels.filter(m => m.name.includes('gemini') && m.name.includes('flash') && m.supportedGenerationMethods?.includes('generateContent'));
            const proModels = availableModels.filter(m => m.name.includes('gemini') && m.supportedGenerationMethods?.includes('generateContent'));

            if (flashModels.length > 0) {
                targetModel = flashModels[0].name.replace('models/', '');
            } else if (proModels.length > 0) {
                targetModel = proModels[0].name.replace('models/', '');
            } else {
                throw new Error('No compatible Gemini models found for this API key.');
            }

            status.textContent = `Found model: ${targetModel}. Testing connection...`;

            // Step 2: Test the specific target model
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${keyInput}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: 'Say "ok"' }] }] })
            });

            const data = await response.json();
            if (!response.ok || data.error) {
                const errMsg = data.error ? data.error.message : response.statusText;
                throw new Error(errMsg);
            }

            // Save the discovered model name to localStorage so askGemini can use it
            localStorage.setItem('clidecoder_ai_model', targetModel);

            status.className = 'ai-conn-status status-success';
            status.textContent = `Success! Connected to dynamically found model: ${targetModel}`;
        } catch (err) {
            status.className = 'ai-conn-status status-error';
            status.textContent = `Connection failed: ${err.message}`;
        }
    }

    function closeAIAnalysis() {
        document.getElementById('aiAnalysisBox').style.display = 'none';
    }

    async function askGemini() {
        const raw = document.getElementById('cmdInput').value.trim();
        const key = localStorage.getItem(AI_KEY_STORAGE);
        if (!key || !raw) return;

        const box = document.getElementById('aiAnalysisBox');
        const content = document.getElementById('aiContent');
        box.classList.remove('collapsed');
        box.style.display = 'block';
        content.innerHTML = '<div class="ai-loader">Gemini is thinking...</div>';
        box.scrollIntoView({ behavior: 'smooth' });

        try {
            const prompt = `Analyze this CLI command: \`${raw}\`
        
        Rules:
        1. Be extremely concise. Explain EXACTLY what this specific combination of flags and arguments does.
        2. DO NOT write long paragraphs. Use straightforward, precise bullet points.
        3. DO NOT repeat what individual flags do if it's obvious from the context. Only explain the *combined* effect.
        4. Identify if it's potentially dangerous (e.g., deletes data, exposes ports). 
        5. Use markdown formatting.`;

            // Use the dynamically discovered model from the connection test
            const modelToUse = localStorage.getItem('clidecoder_ai_model') || 'gemini-1.5-flash';

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            if (!response.ok || data.error) {
                const errMsg = data.error ? data.error.message : response.statusText;
                throw new Error(errMsg);
            }

            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error("Empty response from Gemini.");

            // Escape HTML characters to prevent XSS
            const safeText = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');

            // Simple markdown-to-html (very basic but safe now)
            content.innerHTML = safeText
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*)\*/gim, '<em>$1</em>')
                .replace(/`(.*)`/gim, '<code>$1</code>')
                .replace(/\n/gim, '<br>');

            // Update the main summary bar with a preview of the AI response
            const firstSentence = text.split(/[.!?]\s/)[0].replace(/[*#`]/g, '').trim();
            if (firstSentence && firstSentence.length < 150) {
                const summaryBar = document.getElementById('summaryBar');
                if (summaryBar) {
                    summaryBar.innerHTML = `<strong>AI Summary:</strong> ${firstSentence}`;
                    triggerSummaryAnimation();
                }
            }

        } catch (err) {
            content.innerHTML = `<div class="error-msg visible">AI Error: ${err.message}</div>`;
        }
    }

    function triggerSummaryAnimation() {
        const el = document.getElementById('summaryBar');
        if (!el) return;
        el.style.animation = 'none';
        el.offsetHeight; // force reflow
        el.style.animation = 'summaryPulse 0.5s ease-out';
    }

    function toggleAIAnalysis() {
        const box = document.getElementById('aiAnalysisBox');
        if (box) box.classList.toggle('collapsed');
    }

    /* ── Explain command ───────────────────────────────────────────── */
    function explainCommand() {
        const raw = document.getElementById('cmdInput').value.trim().slice(0, MAX_LEN);
        if (!raw) return;

        const errEl = document.getElementById('errorMsg');
        errEl.classList.remove('visible');
        document.getElementById('results').style.display = 'none';
        document.getElementById('aiAnalysisBox').style.display = 'none';

        try {
            const rawTokens = window.CLIParser.tokenise(raw);
            if (rawTokens.length === 0) return;
            const tokens = window.CLIParser.classify(rawTokens);
            window.CLIRenderer.render(raw, tokens);
            checkAIButtonState();
            triggerSummaryAnimation();
        } catch (err) {
            errEl.textContent = '⚠ ' + (err.message || 'Failed to parse the command.');
            errEl.classList.add('visible');
            console.error('[CLIDecoder]', err);
        }
    }

    /* ── Event Listeners ───────────────────────────────────────────── */
    document.getElementById('themeBtn').addEventListener('click', toggleTheme);
    document.getElementById('aiToggleBtn').addEventListener('click', toggleAISettings);
    document.getElementById('aiSettingsCloseBtn').addEventListener('click', toggleAISettings);
    document.getElementById('saveAIKeyBtn').addEventListener('click', saveAIConfig);
    document.getElementById('testAIKeyBtn').addEventListener('click', testGeminiConnection);
    document.getElementById('aiAskBtn').addEventListener('click', askGemini);
    document.getElementById('minMaxAIAnalysisBtn').addEventListener('click', toggleAIAnalysis);
    document.getElementById('closeAIAnalysisBtn').addEventListener('click', closeAIAnalysis);
    document.getElementById('explainBtn').addEventListener('click', explainCommand);

    document.getElementById('cmdInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') explainCommand();
    });

    // Initialize
    (function init() {
        const saved = localStorage.getItem('clidecoder_theme');
        if (saved === 'light' || saved === 'dark') applyTheme(saved);
        renderExamples();
        checkAIButtonState();
    })();
})();
