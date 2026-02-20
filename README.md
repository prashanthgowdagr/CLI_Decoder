# CLI Decoder

**Decode any CLI command in plain English.**

CLI Decoder is a lightning-fast, offline-first web application that breaks down complex command-line instructions into easy-to-understand, color-coded explanations. It is inspired by ExplainShell but built to run entirely locally with zero server dependencies, ensuring your commands remain private.

## ✨ Features

- **Offline-First Explanations:** Runs entirely in your browser. All parsing and explanations are based on local data files, making it incredibly fast and completely private.
- **Explainshell-Style UI:** Beautiful, color-coded token highlighting connected dynamically to hoverable description cards. 
- **AI-Powered Insights (Optional):** You can optionally provide your own Google Gemini API key to get deep, contextual explanations of exactly how your specific combination of flags and arguments interact.
- **Extensible Knowledge Base:** Command data is broken out into modular files (e.g., `data/linux.js`, `data/docker.js`, `data/npm.js`) making it trivial to add new tools.
- **Smart Deduplication:** Repeated arguments or flags in complex commands are aggregated into single, highlighted explanation cards to reduce clutter.
- **Micro-Animations & Premium Design:** Features a thoughtfully crafted "Light" and "Dark" mode with Plus Jakarta Sans typography.

## 🚀 Quick Start

Because it is purely front-end HTML, CSS, and JS, there is no build step required!

1. Clone or download the repository.
2. Open `index.html` directly in any modern web browser.
3. Start typing commands like `docker run -d -p 8080:80 nginx` or `tar -xzf archive.tar.gz` to see them decoded instantly!

## 🧠 Optional AI Integration

To get dynamic summaries of complex commands:
1. Click the ✨ icon in the top right.
2. Enter a free Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey)).
3. Click "Test Connection". The app will automatically discover the best available model for your key (including `gemini-2.0-flash-exp`).
4. Your key is stored securely in your browser's local storage and is never sent anywhere except directly to Google's servers.

## 🛠️ Adding New Commands

Want CLIDecoder to understand a new tool? 
1. Read `data/FORMAT.md` for styling instructions.
2. Create a new file (e.g., `data/mytool.js`).
3. Add the `<script src="data/mytool.js"></script>` reference inside `index.html`.

## 📜 License
Open-source under the MIT License.
