(function () {
    window.CLI_KB = window.CLI_KB || {};

    window.CLI_KB['terraform'] = {
        desc: 'HashiCorp infrastructure-as-code tool',
        sub: {
            'init': 'Initialise providers and backend',
            'plan': 'Preview infrastructure changes',
            'apply': 'Apply changes to real infrastructure',
            'destroy': 'Destroy all managed infrastructure',
            'validate': 'Check configuration file syntax',
            'fmt': 'Format .tf files to canonical style',
            'show': 'Show the current state or a saved plan',
            'state': 'Advanced state file management',
            'import': 'Import existing resource into state',
            'output': 'Show output variable values',
            'workspace': 'Manage named workspaces',
            'providers': 'Show required providers',
            'refresh': 'Sync state with real infrastructure',
            'console': 'Interactive expression evaluator',
            'version': 'Show Terraform version',
            'login': 'Log in to Terraform Cloud',
            'taint': 'Mark resource for forced recreation',
            'force-unlock': 'Release a stuck state lock',
            'select': 'Select a workspace',
            'rm': 'Remove resource from state',
            'list': 'List resources in state',
            'mv': 'Move resource in state',
        },
        flags: {
            '-var-file': { desc: 'Load variables from a .tfvars file', val: true },
            '-var': { desc: 'Set a variable on the command line', val: true },
            '-out': { desc: 'Save the plan to a file', val: true },
            '-auto-approve': { desc: 'Skip interactive approval prompt', val: false },
            '-parallelism': { desc: 'Max concurrent resource operations', val: true },
            '-target': { desc: 'Apply only to a specific resource', val: true },
            '-destroy': { desc: 'Create a destroy plan', val: false },
            '-replace': { desc: 'Force recreation of a resource', val: true },
            '-refresh-only': { desc: 'Only refresh state, no changes', val: false },
            '-json': { desc: 'Machine-readable JSON output', val: false },
            '-no-color': { desc: 'Disable coloured output', val: false },
            '-upgrade': { desc: 'Upgrade providers during init', val: false },
            '-reconfigure': { desc: 'Reconfigure backend settings', val: false },
            '-input': { desc: 'Disable interactive input (false)', val: true },
            '-lock': { desc: 'Lock state file (true/false)', val: true },
            '-backend': { desc: 'Configure backend on init', val: true },
            '-recursive': { desc: 'Format subdirectories too', val: false },
            '-diff': { desc: 'Show formatting differences', val: false },
            '-compact-warnings': { desc: 'Show warnings in compact form', val: false },
        },
    };

    /* ── NODE / NPM / PIP ──────────────────────────────────────────── */

    window.CLI_KB['node'] = {
        desc: 'Run JavaScript with the Node.js runtime',
        flags: {
            '-e': { desc: 'Evaluate a JavaScript expression', val: true },
            '-p': { desc: 'Evaluate and print the result', val: true },
            '--version': { desc: 'Show Node.js version', val: false },
            '--inspect': { desc: 'Enable the V8 debugger', val: false },
        },
    };

    window.CLI_KB['npm'] = {
        desc: 'Node.js package manager',
        sub: {
            'install': 'Install project dependencies',
            'i': 'Alias for install',
            'uninstall': 'Remove a package',
            'update': 'Update packages to latest compatible',
            'run': 'Run a script from package.json',
            'start': 'Run the start script',
            'test': 'Run the test script',
            'init': 'Create a new package.json',
            'publish': 'Publish package to the npm registry',
            'ci': 'Clean install from lockfile only',
            'list': 'List installed packages',
            'outdated': 'Show outdated packages',
            'audit': 'Check for known vulnerabilities',
            'build': 'Run the build script',
            'dev': 'Run the dev script',
        },
        flags: {
            '--save-dev': { desc: 'Save to devDependencies', val: false },
            '-D': { desc: 'Save to devDependencies (short)', val: false },
            '--global': { desc: 'Install globally on the system', val: false },
            '-g': { desc: 'Install globally (short)', val: false },
            '--production': { desc: 'Skip devDependencies', val: false },
            '--legacy-peer-deps': { desc: 'Ignore peer dependency conflicts', val: false },
            '--force': { desc: 'Force the operation', val: false },
            '-y': { desc: 'Accept all defaults', val: false },
        },
    };

    window.CLI_KB['npx'] = {
        desc: 'Execute npm package binaries without installing',
        flags: {
            '-y': { desc: 'Skip confirmation prompt', val: false },
            '--no-install': { desc: 'Fail if package is not installed', val: false },
            '--package': { desc: 'Package to install and run', val: true },
        },
    };

    window.CLI_KB['pip'] = {
        desc: 'Python package installer',
        sub: {
            'install': 'Install Python packages',
            'uninstall': 'Remove a Python package',
            'freeze': 'Output installed packages with versions',
            'list': 'List installed packages',
            'show': 'Show package details',
        },
        flags: {
            '-r': { desc: 'Install from a requirements file', val: true },
            '--upgrade': { desc: 'Upgrade to latest version', val: false },
            '-U': { desc: 'Upgrade to latest (short)', val: false },
            '--user': { desc: 'Install to user directory', val: false },
            '--no-deps': { desc: 'Skip installing dependencies', val: false },
            '--no-cache-dir': { desc: 'Bypass the download cache', val: false },
        },
    };

    window.CLI_KB['pip3'] = {
        desc: 'Python 3 package installer',
        sub: {
            'install': 'Install packages',
            'uninstall': 'Remove a package',
            'freeze': 'List installed packages',
            'list': 'List packages',
        },
        flags: {
            '-r': { desc: 'Install from requirements file', val: true },
            '--upgrade': { desc: 'Upgrade to latest', val: false },
            '-U': { desc: 'Upgrade (short)', val: false },
        },
    };

    window.CLI_KB['python'] = {
        desc: 'Run Python scripts or interactive REPL',
        flags: {
            '-c': { desc: 'Execute a Python statement', val: true },
            '-m': { desc: 'Run a module as a script', val: true },
            '--version': { desc: 'Show Python version', val: false },
        },
    };

    window.CLI_KB['python3'] = {
        desc: 'Run Python 3 scripts or REPL',
        flags: {
            '-c': { desc: 'Execute a Python statement', val: true },
            '-m': { desc: 'Run module as script', val: true },
            '--version': { desc: 'Show Python 3 version', val: false },
        },
    };

    /* ── JAVA / MAVEN / GRADLE ─────────────────────────────────────── */

    window.CLI_KB['java'] = {
        desc: 'Run a Java application or JVM',
        flags: {
            '-jar': { desc: 'Run a JAR file', val: true },
            '-cp': { desc: 'Set the classpath', val: true },
            '-Xmx': { desc: 'Maximum heap memory (-Xmx512m)', val: false },
            '-Xms': { desc: 'Initial heap memory', val: false },
            '-D': { desc: 'Set a system property', val: false },
            '-version': { desc: 'Show Java version', val: false },
        },
    };

    window.CLI_KB['mvn'] = {
        desc: 'Apache Maven build and dependency manager',
        sub: {
            'clean': 'Remove build output directory',
            'compile': 'Compile source code',
            'test': 'Run unit tests',
            'package': 'Package into JAR or WAR',
            'install': 'Install artifact to local repo',
            'deploy': 'Deploy to remote repository',
            'validate': 'Validate the project structure',
        },
        flags: {
            '-D': { desc: 'Set a system property or Maven property', val: false },
            '-P': { desc: 'Activate a build profile', val: true },
            '-f': { desc: 'Use a specific POM file', val: true },
            '-pl': { desc: 'Build specific modules only', val: true },
            '-U': { desc: 'Force update of snapshots', val: false },
            '-q': { desc: 'Quiet — minimal output', val: false },
            '-X': { desc: 'Debug — verbose output', val: false },
            '-DskipTests': { desc: 'Skip running unit tests', val: false },
            '-T': { desc: 'Number of parallel build threads', val: true },
        },
    };

    window.CLI_KB['gradle'] = {
        desc: 'Gradle build automation tool',
        sub: {
            'build': 'Compile and test the project',
            'clean': 'Delete the build directory',
            'test': 'Run all tests',
            'assemble': 'Assemble build outputs',
            'run': 'Run the application',
            'dependencies': 'Show dependency tree',
            'tasks': 'List all available tasks',
        },
        flags: {
            '--no-daemon': { desc: 'Run without Gradle daemon', val: false },
            '-p': { desc: 'Project directory path', val: true },
            '--info': { desc: 'Set log level to INFO', val: false },
            '-i': { desc: 'INFO log level (short)', val: false },
            '--debug': { desc: 'Set log level to DEBUG', val: false },
            '-q': { desc: 'Quiet mode', val: false },
            '--parallel': { desc: 'Build projects in parallel', val: false },
            '-x': { desc: 'Exclude a task from the build', val: true },
            '--scan': { desc: 'Generate a Gradle build scan', val: false },
            '--offline': { desc: 'Use cached dependencies only', val: false },
        },
    };
})();
