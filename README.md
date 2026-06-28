# Font Compare

A powerful, cross-platform Electron application for comparing fonts side-by-side. 
Perfect for designers, developers, and typography enthusiasts.

[Read in Chinese (简体中文)](README.zh-CN.md) | [Read in Japanese (日本語)](README.ja.md) | [Read in Korean (한국어)](README.ko.md)

## ✨ Features

- **Side-by-Side Comparison**: Compare up to 4 fonts simultaneously in real-time.
- **Killer Feature: Actual Rendered Font Inspector**: Utilizes the Chrome DevTools Protocol (CDP) to show exactly which fallback fonts are being used to render your text. No more guessing why an emoji or character isn't displaying correctly!
- **State Persistence**: Your font choices, text input, and settings (size, layout, zoom) are automatically saved and restored on startup.
- **Advanced Typography Controls**: Adjust font size, line height, letter spacing, font weight (bold), and style (italic).
- **Subpixel Anti-Aliasing**: Optimized CSS ensures crisp, subpixel ClearType font rendering without jagged edges.
- **Grid / List Layouts**: Toggle between a 2x2 grid or a vertical list layout.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fangsunjian/Font-Compare.git
   cd Font-Compare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

## 🛠️ Built With

- [Electron](https://www.electronjs.org/) - Cross-platform desktop app framework
- HTML5 / CSS3 / Vanilla JavaScript - No heavy frontend frameworks

## 📝 License

This project is licensed under the MIT License.
