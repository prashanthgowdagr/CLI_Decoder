# Adding New Tools to CLIDecoder

## Quick Start

1. Create `data/mytool.js` following the template below
2. Add `<script src="data/mytool.js"></script>` in `index.html` (before `js/parser.js`)
3. Add a platform chip in `index.html` if needed
4. Add example commands in `js/app.js` → `EXAMPLES` object

## File Template

```javascript
(function () {
  window.CLI_KB = window.CLI_KB || {};

  window.CLI_KB['mycommand'] = {
    desc: 'One-line description of the command',
    sub: {
      'subcommand': 'Description of this subcommand',
      'another':    'Description of another subcommand',
    },
    flags: {
      '-f':       { desc: 'Short flag description', val: false },
      '--long':   { desc: 'Long flag description',  val: false },
      '--output': { desc: 'Output file path',       val: true  },
    },
  };

  // Add more commands as needed...
  window.CLI_KB['mycommand2'] = { ... };
})();
```

## Field Reference

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `desc` | string | ✅ | One-line description of the command |
| `sub` | object | ❌ | Map of subcommand → description |
| `flags` | object | ❌ | Map of flag → `{ desc, val }` |
| `flags[x].desc` | string | ✅ | Description of the flag |
| `flags[x].val` | boolean | ✅ | `true` if the flag takes a value argument |

## Tips

- **Combined short flags**: `-lah` is auto-expanded to `-l`, `-a`, `-h` by the parser
- **`=` values**: `--output=file.txt` is auto-split; no need to handle in data
- **Pipe operators**: `|`, `&&`, `||`, `;`, `>`, `>>`, etc. are handled by the parser
- Keep descriptions ≤ 15 words for clean card layout
