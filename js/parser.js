/* ══════════════════════════════════════════════════════════════════
   CLIDecoder — Parser Engine
   Tokenises raw CLI input and classifies each token.
   Uses window.CLI_KB knowledge base loaded from data/*.js files.
   ══════════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Constants ──────────────────────────────────────────────────── */
    const PIPE_OPS = new Set([
        '|', '||', '&&', ';', '&', '>', '>>', '<', '<<',
        '2>&1', '2>/dev/null', '1>&2', '&>/dev/null', '2>', '1>', '1>>', '&>',
    ]);

    const ASSIGN_RE = /^[A-Za-z_][A-Za-z0-9_]*=/;
    const FLAG_RE = /^--?[a-zA-Z]/;

    /** Flags that commonly consume the next token as a value */
    const VALUE_FLAGS = new Set([
        '-n', '-o', '-e', '-f', '-d', '-u', '-g', '-p', '-t', '-c', '-m', '-i', '-I', '-L', '-R',
        '-A', '-B', '-C', '-w', '-j', '-k', '-T', '-s', '-S', '-x', '-z', '-l',
        '--name', '--file', '--output', '--format', '--filter', '--query', '--region', '--profile',
        '--cluster', '--namespace', '--context', '--image', '--tag', '--type', '--role', '--policy',
        '--user', '--group', '--resource-group', '--location', '--subscription', '--account',
        '--project', '--zone', '--platform', '--runtime', '--handler', '--timeout', '--memory',
        '--entry-point', '--source', '--registry', '--container', '--account-name', '--service',
        '--template-file', '--parameters', '--stack-name', '--log-group-name', '--cluster-name',
        '--node-count', '--size', '--sku', '--tier', '--var-file', '--var', '--out', '--parallelism',
        '--target', '--replace', '--sort-by', '--limit', '--member', '--key', '--secret', '--cert',
        '--scope', '--replicas', '--tail', '--since', '--until', '--port', '--selector', '--labels',
        '--machine-type', '--function-name', '--values', '--version', '--set', '--max-items',
    ]);

    /* ── Tokeniser ─────────────────────────────────────────────────── */
    function tokenise(input) {
        const tokens = [];
        let cur = '', inS = false, inD = false;
        for (let i = 0; i < input.length; i++) {
            const ch = input[i];
            if (ch === "'" && !inD) { inS = !inS; cur += ch; }
            else if (ch === '"' && !inS) { inD = !inD; cur += ch; }
            else if (ch === ' ' && !inS && !inD) { if (cur) tokens.push(cur); cur = ''; }
            else cur += ch;
        }
        if (cur) tokens.push(cur);
        return tokens;
    }

    /* ── KB Lookup Helpers ─────────────────────────────────────────── */
    function getKB(name) {
        return (window.CLI_KB || {})[name] || null;
    }

    function lookupFlag(kbEntry, flag) {
        if (!kbEntry || !kbEntry.flags) return null;
        const f = kbEntry.flags[flag];
        if (f) return f;
        // try stripping =value (--output=json → --output)
        const bare = flag.replace(/=.*$/, '');
        if (kbEntry.flags[bare]) return kbEntry.flags[bare];
        // combined short flags: -lah → -l -a -h
        if (/^-[a-zA-Z]{2,}$/.test(flag)) {
            const parts = flag.slice(1).split('').map(c => kbEntry.flags[`-${c}`]).filter(Boolean);
            if (parts.length) return { desc: parts.map(p => p.desc).join(' + '), val: false };
        }
        return null;
    }

    function lookupSub(kbEntry, token) {
        if (!kbEntry || !kbEntry.sub) return null;
        return kbEntry.sub[token] || null;
    }

    /* ── Does this flag expect a value? ────────────────────────────── */
    function flagTakesValue(flag, kbEntry) {
        if (flag.includes('=')) return false; // self-contained
        if (kbEntry) {
            const f = kbEntry.flags && (kbEntry.flags[flag] || kbEntry.flags[flag.replace(/=.*$/, '')]);
            if (f) return !!f.val;
        }
        const bare = flag.replace(/=.*$/, '');
        return VALUE_FLAGS.has(bare);
    }

    /* ── Pipe / Redirect descriptions ──────────────────────────────── */
    function describePipe(op) {
        const m = {
            '|': 'Pipe stdout to the next command',
            '&&': 'Run next command only if this one succeeds',
            '||': 'Run next command only if this one fails',
            ';': 'Run commands sequentially',
            '&': 'Run command in background',
            '>>': 'Append stdout to file',
            '>': 'Redirect stdout to file (overwrite)',
            '<': 'Redirect file to stdin',
            '<<': 'Here-document input',
            '2>&1': 'Redirect stderr to stdout',
            '2>/dev/null': 'Discard all error output',
            '1>&2': 'Redirect stdout to stderr',
            '&>': 'Redirect stdout and stderr to file',
            '2>': 'Redirect stderr to file',
            '1>': 'Redirect stdout to file',
        };
        return m[op] || 'Operator';
    }

    /* ── Generic descriptions ──────────────────────────────────────── */
    function genericFlagDesc(flag) {
        if (flag.startsWith('--')) {
            const word = flag.replace(/^--/, '').replace(/=.*$/, '').replace(/-/g, ' ');
            return `Set the ${word} option`;
        }
        if (/^-[a-zA-Z]{2,}$/.test(flag)) return `Combined flags: ${flag.slice(1).split('').map(c => '-' + c).join(' ')}`;
        return 'Option flag';
    }

    function describeValue(v) {
        if (/^s3:\/\//.test(v)) return 'Amazon S3 bucket path';
        if (/^gs:\/\//.test(v)) return 'Google Cloud Storage bucket path';
        if (/^https?:\/\//.test(v)) return 'Web URL';
        if (/^arn:/.test(v)) return 'AWS resource ARN identifier';
        if (/^\d+$/.test(v)) return `Numeric value: ${v}`;
        if (/^[0-9]+[smhd]$/.test(v)) return `Time duration: ${v}`;
        if (/^[0-9]+[KMGTkmgt]?i?[Bb]?$/.test(v)) return `Size value: ${v}`;
        if (/^[a-z]{2,}-[a-z]+-\d/.test(v)) return 'Cloud region or zone identifier';
        if (/^\//.test(v)) return `Absolute filesystem path`;
        if (/^\.\.?\//.test(v)) return 'Relative filesystem path';
        if (/^~\//.test(v)) return 'Home directory path';
        if (v.includes(':')) return 'Key:value pair or host:port';
        if (/^[a-zA-Z0-9_.-]+\.[a-zA-Z]+$/.test(v)) return 'Filename';
        return 'Value';
    }

    /* ── K8s resource names ────────────────────────────────────────── */
    const K8S_RESOURCES = {
        pods: 'Kubernetes Pod resources',
        pod: 'A Kubernetes Pod',
        deployments: 'Kubernetes Deployments',
        deployment: 'A Kubernetes Deployment',
        services: 'Kubernetes Services',
        service: 'A Kubernetes Service',
        svc: 'Kubernetes Service (alias)',
        nodes: 'Cluster Nodes',
        node: 'A cluster Node',
        namespaces: 'Kubernetes Namespaces',
        ns: 'Namespace (alias)',
        configmaps: 'ConfigMap resources',
        cm: 'ConfigMap (alias)',
        secrets: 'Secret resources',
        ingresses: 'Ingress resources',
        ing: 'Ingress (alias)',
        statefulsets: 'StatefulSet resources',
        sts: 'StatefulSet (alias)',
        daemonsets: 'DaemonSet resources',
        ds: 'DaemonSet (alias)',
        jobs: 'Job resources',
        cronjobs: 'CronJob resources',
        cj: 'CronJob (alias)',
        replicasets: 'ReplicaSet resources',
        rs: 'ReplicaSet (alias)',
        pv: 'PersistentVolume',
        pvc: 'PersistentVolumeClaim',
        events: 'Cluster event log',
        all: 'All resource types',
        'deploy': 'Deployment (alias)',
    };

    /* ── Guess positional type ─────────────────────────────────────── */
    function guessPositionalType(tok) {
        if (/^s3:\/\/|^gs:\/\/|^https?:\/\/|^arn:|^\/|^\.\.?\/|^~\//.test(tok)) return 'val';
        if (/^[a-zA-Z0-9_.-]+\.[a-zA-Z]+$/.test(tok)) return 'val'; // file.ext
        return 'arg';
    }

    /* ══════════════════════════════════════════════════════════════════
       MAIN CLASSIFIER
       ══════════════════════════════════════════════════════════════════ */
    function classify(rawTokens) {
        const result = [];
        let kbEntry = null;
        let cmdFound = false;
        let subCount = 0;
        let nextIsVal = false;
        const MAX_SUB = 3; // aws s3 cp, gcloud container clusters, etc.

        for (let i = 0; i < rawTokens.length; i++) {
            const tok = rawTokens[i];

            // ── Pipe / Redirect ─────────────────────────────
            if (PIPE_OPS.has(tok)) {
                result.push({ text: tok, type: 'pipe', desc: describePipe(tok) });
                kbEntry = null; cmdFound = false; subCount = 0; nextIsVal = false;
                continue;
            }

            // ── Environment assignment before command ───────
            if (!cmdFound && ASSIGN_RE.test(tok)) {
                result.push({ text: tok, type: 'other', desc: 'Environment variable assignment' });
                continue;
            }

            // ── Base command ────────────────────────────────
            if (!cmdFound) {
                const base = tok.replace(/^.*\//, '');
                kbEntry = getKB(base);
                result.push({ text: tok, type: 'cmd', desc: kbEntry ? kbEntry.desc : `${base} command` });
                cmdFound = true;
                continue;
            }

            // ── Flag ────────────────────────────────────────
            if (FLAG_RE.test(tok)) {
                const flagInfo = lookupFlag(kbEntry, tok);
                const desc = flagInfo ? flagInfo.desc : genericFlagDesc(tok);
                nextIsVal = flagTakesValue(tok, kbEntry);
                result.push({ text: tok, type: 'flag', desc });
                continue;
            }

            // ── Value expected right after a flag ───────────
            if (nextIsVal) {
                nextIsVal = false;
                result.push({ text: tok, type: 'val', desc: describeValue(tok) });
                continue;
            }

            // ── Subcommand ──────────────────────────────────
            if (kbEntry && subCount < MAX_SUB) {
                const subDesc = lookupSub(kbEntry, tok);
                if (subDesc) {
                    result.push({ text: tok, type: 'sub', desc: subDesc });
                    subCount++;
                    continue;
                }
                // First positional after a compound cmd with sub-entries
                if (subCount === 0 && kbEntry.sub && !tok.startsWith('/') && !tok.startsWith('.')) {
                    result.push({ text: tok, type: 'sub', desc: `Subcommand of ${result.find(t => t.type === 'cmd')?.text || ''}` });
                    subCount++;
                    continue;
                }
            }

            // ── K8s resource ────────────────────────────────
            if (K8S_RESOURCES[tok]) {
                result.push({ text: tok, type: 'arg', desc: K8S_RESOURCES[tok] });
                continue;
            }

            // ── Chmod numeric permissions ───────────────────
            if (result.find(t => t.type === 'cmd' && t.text === 'chmod') && /^[0-7]{3,4}$/.test(tok)) {
                const pm = { '7': 'rwx', '6': 'rw-', '5': 'r-x', '4': 'r--', '3': '-wx', '2': '-w-', '1': '--x', '0': '---' };
                const perms = tok.slice(-3).split('').map(d => pm[d] || '???').join(' ');
                result.push({ text: tok, type: 'arg', desc: `Permission mode: ${perms}` });
                continue;
            }

            // ── -- delimiter (end of flags) ─────────────────
            if (tok === '--') {
                result.push({ text: tok, type: 'other', desc: 'End of flags — remaining args are literal' });
                continue;
            }

            // ── Generic positional ──────────────────────────
            const posType = guessPositionalType(tok);
            result.push({ text: tok, type: posType, desc: posType === 'val' ? describeValue(tok) : 'Argument' });
        }

        return result;
    }

    /* ── Coverage badge ────────────────────────────────────────────── */
    function coverageLevel(tokens) {
        const meaningful = tokens.filter(t => t.type !== 'pipe');
        if (meaningful.length === 0) return 'none';
        const GENERIC = new Set(['Option flag', 'Argument', 'Value', 'command']);
        const known = meaningful.filter(t => !GENERIC.has(t.desc) && !/^[a-z]+ command$/.test(t.desc)).length;
        const r = known / meaningful.length;
        return r >= 0.7 ? 'full' : r >= 0.35 ? 'part' : 'none';
    }

    /* ── Public API ────────────────────────────────────────────────── */
    window.CLIParser = {
        tokenise: tokenise,
        classify: classify,
        coverageLevel: coverageLevel,
        getKB: getKB,
    };

})();
