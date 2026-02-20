(function () {
    window.CLI_KB = window.CLI_KB || {};

    window.CLI_KB['npm'] = {
        desc: 'Node Package Manager - JavaScript package manager',
        sub: {
            'install': 'Install a package and its dependencies',
            'i': 'Alias for install',
            'init': 'Create a package.json file',
            'start': 'Start the application as defined in package.json',
            'test': 'Run the tests defined in package.json',
            'run': 'Run arbitrary package scripts',
            'publish': 'Publish a package to the registry',
            'uninstall': 'Remove a package',
            'un': 'Alias for uninstall',
            'update': 'Update packages to latest versions',
            'config': 'Manage the npm configuration files',
            'ci': 'Install a project with a clean slate (from package-lock)'
        },
        flags: {
            '-g': { desc: 'Install globally', val: false },
            '--global': { desc: 'Install globally', val: false },
            '-D': { desc: 'Save as devDependency', val: false },
            '--save-dev': { desc: 'Save as devDependency', val: false },
            '-S': { desc: 'Save as dependency', val: false },
            '--save': { desc: 'Save as dependency', val: false },
            '--save-exact': { desc: 'Save an exact version', val: false },
            '-E': { desc: 'Save an exact version', val: false },
            '-y': { desc: 'Yes to all prompts', val: false },
            '--yes': { desc: 'Yes to all prompts', val: false },
            '--force': { desc: 'Force fetching remote resources', val: false },
            '--legacy-peer-deps': { desc: 'Ignore peer dependencies', val: false },
            '--no-audit': { desc: 'Disable vulnerability auditing', val: false },
            '--prefix': { desc: 'Run command in specific directory', val: true }
        },
    };

    window.CLI_KB['yarn'] = {
        desc: 'Fast, reliable, and secure dependency management',
        sub: {
            'add': 'Install a package and its dependencies',
            'init': 'Create a package.json file',
            'start': 'Run start script',
            'test': 'Run test script',
            'run': 'Run defined package script',
            'remove': 'Remove a package',
            'upgrade': 'Upgrade packages to their latest versions',
            'install': 'Install all dependencies',
            'build': 'Run build script'
        },
        flags: {
            '-D': { desc: 'Save as devDependency', val: false },
            '--dev': { desc: 'Save as devDependency', val: false },
            '-E': { desc: 'Save exact package version', val: false },
            '--exact': { desc: 'Save exact package version', val: false },
            '-y': { desc: 'Yes to all prompts', val: false },
            '--yes': { desc: 'Yes to all prompts', val: false },
            '--force': { desc: 'Force install', val: false },
            '--frozen-lockfile': { desc: 'Don\'t generate a lockfile', val: false },
            '-g': { desc: 'Install package globally', val: false },
            '--global': { desc: 'Install package globally', val: false }
        },
    };
})();
