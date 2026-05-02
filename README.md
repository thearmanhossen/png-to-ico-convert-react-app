# PNG → ICO Converter

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-No%20license%20specified-lightgrey)

A fast, fully client-side PNG to ICO converter built with React and TypeScript. Upload one or more PNG images, choose your desired icon size, and download ready-to-use `.ico` files — all without sending any data to a server.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Run Locally](#run-locally)
  - [Build for Production](#build-for-production)
- [Usage](#usage)
- [Supported Icon Sizes](#supported-icon-sizes)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Features

- **Client-side conversion** — all processing happens in the browser using the Canvas API; no files ever leave your machine.
- **Drag & drop or click-to-upload** — intuitive file upload with real-time previews and progress.
- **Batch conversion** — convert up to 100 PNG files in a single operation.
- **Flexible icon sizes** — choose any combination of 16 × 16, 32 × 32, 48 × 48, or 256 × 256 pixels.
- **Transparency support** — generates 32-bit RGBA ICO files that preserve alpha channels.
- **File preview** — thumbnail previews with file name and size shown before conversion.
- **Individual download** — download any converted file as a `.ico` directly.
- **Download all as ZIP** — bundle all converted icons into a single `converted_icons.zip` file.
- **PNG-only validation** — non-PNG files are filtered out with clear, user-friendly warnings.
- **Dark / Light mode** — theme toggle with persisted preference.
- **History** — recent conversions saved in local browser storage.

---

## Demo

> 🚀 Live demo: _No live deployment link available yet. Run the project locally (see [Getting Started](#getting-started))._

---

## Screenshots

> 📸 _Screenshots coming soon. Replace this section with images once available._

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | [React 19](https://react.dev/) |
| Language | [TypeScript 5.8](https://www.typescriptlang.org/) |
| Build tool | [Vite 6](https://vitejs.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) (loaded via CDN) |
| ZIP packaging | [JSZip 3.10](https://stuk.github.io/jszip/) (loaded via CDN) |
| ICO encoding | Custom implementation using the HTML5 Canvas API |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later (bundled with Node.js)

### Installation

```bash
git clone https://github.com/thearmanhossen/png-to-ico-convert-react-app.git
cd png-to-ico-convert-react-app
npm install
```

### Run Locally

```bash
npm run dev
```

The development server starts at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

Static output is written to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Usage

1. **Open the app** in your browser (see [Run Locally](#run-locally)).
2. **Upload PNG files** by dragging and dropping them onto the upload area, or clicking it to open a file picker. Up to **100 PNG files** can be selected at once.
3. **Review** the file list. Each entry shows a thumbnail, file name, and file size.
4. **Select one or more icon sizes** from the size grid.
5. Click **Convert** to start the conversion. Progress is indicated by a loading spinner.
6. Once complete, **download** individual `.ico` files using the download button next to each entry, or click **Download All (.zip)** to get all files in a single archive.
7. Click **Start Over** (or **Clear**) to reset and convert another batch.

---

## Supported Icon Sizes

| Size | Common Use |
|---|---|
| 16 × 16 | Browser favicons, taskbar icons |
| 32 × 32 | Desktop icons, Windows taskbar |
| 48 × 48 | Windows desktop icons |
| 256 × 256 | High-resolution Windows icons |

> Select any combination of sizes before clicking **Convert**. Each `.ico` contains all selected resolutions.

---

## Project Structure

```
png-to-ico-convert-react-app/
├── components/
│   ├── FileUploader.tsx   # Drag-and-drop / click-to-upload component
│   ├── HistoryPanel.tsx   # Recent conversions list
│   ├── Icons.tsx          # SVG icon components (Upload, Download, Convert, etc.)
│   ├── SizeSelector.tsx   # Multi-size selection grid
│   ├── ThemeProvider.tsx  # Dark/Light theme context
│   └── ThemeToggle.tsx    # Theme toggle button
├── utils/
│   └── converter.ts       # PNG → ICO conversion logic (Canvas API + ICO binary encoding)
├── App.tsx                # Root application component and state management
├── index.tsx              # React entry point
├── index.html             # HTML shell (loads Tailwind CSS & JSZip from CDN)
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project metadata and scripts
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Compile TypeScript and bundle for production |
| `npm run preview` | Serve the production build locally for testing |

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against the `main` branch.

Please keep PRs focused and include a clear description of what was changed and why.

---

## License

No license specified. All rights reserved by the repository owner unless otherwise noted.

---

## Acknowledgements

- [React](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — blazing-fast build tooling
- [Tailwind CSS](https://tailwindcss.com/) — utility-first CSS framework
- [JSZip](https://stuk.github.io/jszip/) — client-side ZIP file generation
- ICO file format specification — [Wikipedia: ICO (file format)](https://en.wikipedia.org/wiki/ICO_(file_format))
