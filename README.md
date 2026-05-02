# PNG → ICO Converter

A fast, client-side web application that converts PNG images to ICO format — no server, no uploads, no data leaves your browser.

---

## Features

- 🖼️ **Batch conversion** — convert up to 100 PNG files in a single session
- 🔒 **Fully client-side** — all processing happens in the browser; your images are never uploaded
- 🖱️ **Drag-and-drop upload** — drop files onto the upload zone or click to browse
- 📐 **Multiple output sizes** — choose from 16 × 16, 24 × 24, 32 × 32, 48 × 48, 64 × 64, 128 × 128, 256 × 256, or 512 × 512 pixels
- 🎨 **Transparency preserved** — RGBA / alpha channel is maintained in the output ICO
- ⬇️ **Flexible downloads** — download each icon individually or grab all of them in a single `.zip` archive
- 👁️ **File preview** — see a thumbnail and file size of every PNG before converting
- 📊 **Size comparison** — results view shows original KB → converted KB for each file

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | [React](https://react.dev/) 19 |
| Language | [TypeScript](https://www.typescriptlang.org/) ~5.8 |
| Build Tool | [Vite](https://vitejs.dev/) 6 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) (CDN) |
| ZIP Generation | [JSZip](https://stuk.github.io/jszip/) 3.10 (CDN) |
| Font | [Inter](https://rsms.me/inter/) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18.x
- npm ≥ 9.x (bundled with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/thearmanhossen/png-to-ico-convert-react-app.git
cd png-to-ico-convert-react-app

# Install dependencies
npm install
```

### Development

Start the local development server (available at `http://localhost:3000`):

```bash
npm run dev
```

### Build

Compile and bundle the app for production:

```bash
npm run build
```

The output is placed in the `dist/` directory.

### Preview Production Build

Serve the production build locally to verify it before deploying:

```bash
npm run preview
```

---

## Usage

1. **Open the app** in your browser (`http://localhost:3000` in dev mode).
2. **Upload PNG files** by dragging and dropping them onto the upload zone, or click **"Click to upload"** to open the file picker. Only `.png` files are accepted; any other file types are silently ignored.
3. **Choose an output size** using the size selector buttons (16 – 512 px). The selected size applies to all files in the current batch.
4. **Click "Convert"** to start the conversion. All files are processed in parallel in the browser.
5. **Download your icons**:
   - Click the **download button** next to any file to save it individually.
   - Click **"Download All (.zip)"** to receive every converted icon in a single archive.
6. Click **"Start Over"** to clear results and convert another batch.

> **Tips**
> - For best results, use square PNG source images with a transparent background.
> - 256 × 256 and 512 × 512 sizes produce the highest-quality icons for modern operating systems.
> - Large source files (e.g. 4K artwork) may take a moment to process — this is normal.

---

## Project Structure

```
png-to-ico-convert-react-app/
├── components/
│   ├── FileUploader.tsx   # Drag-and-drop / click-to-upload component
│   ├── Icons.tsx          # SVG icon components
│   └── SizeSelector.tsx   # Output size picker (16–512 px)
├── utils/
│   └── converter.ts       # Core PNG → ICO conversion logic
├── App.tsx                # Root application component
├── index.tsx              # React entry point
├── index.html             # HTML shell (loads Tailwind & JSZip from CDN)
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project metadata and scripts
```

---

## Contributing

Contributions are welcome! Please follow the steps below:

1. **Fork** this repository.
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Commit your changes** with a clear message: `git commit -m "feat: describe your change"`
4. **Push** to your fork: `git push origin feature/your-feature-name`
5. **Open a Pull Request** against the `main` branch and describe what you changed and why.

Please ensure your code:
- Passes the TypeScript compiler without errors (`npx tsc --noEmit`).
- Follows the existing code style.
- Does not introduce new runtime dependencies without discussion.

---

## License

No license has been specified for this project. All rights are reserved by the author by default.  
> It is recommended to add a license file (e.g. [MIT](https://choosealicense.com/licenses/mit/)) to clarify how others may use, modify, and distribute this software.

---

## Credits & Acknowledgements

- [React](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — next-generation frontend tooling
- [TypeScript](https://www.typescriptlang.org/) — typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) — utility-first CSS framework
- [JSZip](https://stuk.github.io/jszip/) — client-side ZIP file creation
- [Inter](https://rsms.me/inter/) — typeface by Rasmus Andersson

