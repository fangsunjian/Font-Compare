# Font Compare (字体对比工具)

一款强大、跨平台的 Electron 应用，用于并排对比字体渲染效果。
设计师、开发者和排版爱好者的完美工具。

[English](README.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

## 截图

![Font Compare 简体中文界面](docs/screenshots/font-compare-zh-CN.jpg)

## ✨ 特性

- **多窗口并排对比**：支持同时实时预览和对比多达 4 款字体。
- **杀手级功能：真实回退字体检测**：利用 Chrome 开发者工具协议 (CDP)，精准透视排版引擎，实时显示每个字符**真正**被分配到了哪个底层字体（Fallback Font）进行渲染。再也不用盲猜为什么 Emoji 会变成方块了！
- **断电记忆 (状态持久化)**：自动保存您的文本内容、字体选择、大小、布局等配置，下次打开即刻恢复。
- **高级排版控制**：自由调节字号、行高、字间距、粗细（Bold）和倾斜（Italic）。
- **次像素级抗锯齿**：经过优化的渲染引擎设置，确保在所有屏幕上都能呈现无锯齿的、极致平滑的 ClearType 渲染效果。
- **网格 / 列表布局**：支持在 2x2 网格和垂直列表视图间自由切换。

## 🚀 快速开始

### 环境要求
- Node.js (v16 或更高版本)
- npm

### 安装运行

1. 克隆仓库:
   ```bash
   git clone https://github.com/fangsunjian/Font-Compare.git
   cd Font-Compare
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

3. 启动应用:
   ```bash
   npm start
   ```

## 🛠️ 技术栈

- [Electron](https://www.electronjs.org/) - 跨平台桌面端框架
- HTML5 / CSS3 / 原生 JavaScript

## 📝 开源协议

本项目基于 MIT 协议开源。
