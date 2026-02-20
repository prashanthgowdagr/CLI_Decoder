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

    window.toggleTheme = function () {
        applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    };

    // Restore saved theme
    (function () {
        const saved = localStorage.getItem('clidecoder_theme');
        if (saved === 'light' || saved === 'dark') applyTheme(saved);
    })();

    /* ── Enter key handler ─────────────────────────────────────────── */
    document.getElementById('cmdInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') explainCommand();
    });

    /* ── Explain command (public) ──────────────────────────────────── */
    function explainCommand() {
        const raw = document.getElementById('cmdInput').value.trim().slice(0, MAX_LEN);
        if (!raw) return;

        const errEl = document.getElementById('errorMsg');
        errEl.classList.remove('visible');
        document.getElementById('results').style.display = 'none';

        try {
            const rawTokens = window.CLIParser.tokenise(raw);
            if (rawTokens.length === 0) return;
            const tokens = window.CLIParser.classify(rawTokens);
            window.CLIRenderer.render(raw, tokens);
        } catch (err) {
            errEl.textContent = '⚠ ' + (err.message || 'Failed to parse the command.');
            errEl.classList.add('visible');
            console.error('[CLIDecoder]', err);
        }
    }

    // Expose globally for button onclick
    window.explainCommand = explainCommand;
})();
