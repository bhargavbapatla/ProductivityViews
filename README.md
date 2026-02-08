<div align="left">

# 🌳 React Tree View & Kanban Board

**A modern, interactive React application showcasing complex UI patterns, recursive data structures, and drag-and-drop functionality.**

[![Deploy with Vercel](https://vercel.com/button)](https://productivity-views.vercel.app/)
<br/>

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://react.dev/)

[🚀 **View Live Deployment**](https://productivity-views.vercel.app/)

</div>

---

## ✨ Features

### 🌲 Interactive Tree View
* **Recursive Rendering**: Handles unlimited depth of nested nodes effortlessly.
* **Drag & Drop**: Reorder nodes within the same hierarchy level using `@dnd-kit`.
* **CRUD Operations**:
    * **Create**: Add new child nodes dynamically.
    * **Read**: Visual hierarchy with color-coded levels.
    * **Update**: Inline renaming of nodes.
    * **Delete**: Remove nodes with confirmation modals.
* **Animations**: Smooth transitions for expanding and collapsing branches.

### 📋 Kanban Board
* **Task Management**: Create, move, and delete tasks across columns.
* **Drag & Drop**: Smooth, intuitive drag interactions for cards.
* **Modular Logic**: Business logic extracted into custom hooks (`useKanbanData`, `useKanbanDrag`).

### 🎨 UI/UX
* **Glassmorphism**: Modern UI aesthetic with translucent headers and sharp background patterns.
* **Responsive**: Fully adapts to different screen sizes.
* **Iconography**: Clean, modular SVG icons throughout the app.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 19, TypeScript |
| **Build Tool** | Vite |
| **Drag & Drop** | @dnd-kit/core, @dnd-kit/sortable |
| **Styling** | CSS3 (Variables, Grid/Flexbox) |
| **Deployment** | Vercel |

---

## 📂 Project Structure

The project follows a modular, feature-based architecture:

```bash
src/
├── components/
│   ├── KanbanBoard/       # Kanban feature logic & UI
│   │   ├── hooks/         # Custom hooks (useKanbanData, etc.)
│   │   └── ...
│   ├── LandingPage/       # Entry point & visuals
│   ├── treeView/          # Tree View feature logic & UI
│   │   ├── hooks/         # Custom hooks (useTreeData, etc.)
│   │   └── ...
│   └── common/            # Shared components (Modals, Buttons)
├── context/               # Global state (ViewContext)
└── utils/                 # Pure helper functions
