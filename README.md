# 🌳 React Tree View & Kanban Board

A modern, interactive React application showcasing complex UI patterns, recursive data structures, and drag-and-drop functionality using TypeScript and Vite.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### 🌲 Interactive Tree View
- **Recursive Rendering**: Handles unlimited depth of nested nodes.
- **Drag & Drop**: Reorder nodes within the same hierarchy level using `@dnd-kit`.
- **CRUD Operations**:
  - **Create**: Add new child nodes dynamically.
  - **Read**: Visual hierarchy with color-coded levels (Blue → Green → Light Green → Purple).
  - **Update**: Inline renaming of nodes.
  - **Delete**: Remove nodes with confirmation modals.
- **Lazy Loading**: Simulates asynchronous data fetching for expanding nodes.
- **Animations**: Smooth transitions for expanding/collapsing branches.

### 📋 Kanban Board
- **Task Management**: Create, move, and delete tasks across columns.
- **Drag & Drop**: Smooth drag interactions for cards between columns.
- **Modular Design**: Built with custom hooks for logic separation (`useKanbanData`, `useKanbanDrag`).

### 🎨 UI/UX
- **Landing Page**: Clean entry point with modular SVG icons.
- **Responsive Design**: Adapts to different screen sizes.
- **Glassmorphism**: Modern UI aesthetic with translucent headers and sharp background patterns.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Drag & Drop**: [@dnd-kit/core](https://dndkit.com/) & `@dnd-kit/sortable`
- **Styling**: CSS3 with CSS Variables and Flexbox/Grid layouts

## 📂 Project Structure

The project follows a modular feature-based architecture:

```
src/
├── components/
│   ├── KanbanBoard/       # Kanban feature
│   │   ├── hooks/         # Custom hooks (useKanbanData, useKanbanDrag)
│   │   └── ...
│   ├── LandingPage/       # Home screen
│   ├── treeView/          # Tree View feature
│   │   ├── hooks/         # Custom hooks (useTreeData, useTreeDrag)
│   │   └── ...
│   └── common/            # Shared components (Modals, etc.)
├── context/               # Global state (ViewContext)
└── utils/                 # Helper functions (tree manipulation)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tree-view-kanban.git
   cd tree-view-kanban
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 💡 Key Implementation Details

- **Custom Hooks**: Business logic is extracted into hooks like `useTreeData` and `useKanbanDrag` to keep UI components clean and testable.
- **Pure Functional Updates**: State updates use pure functions to ensure immutability and prevent "Maximum update depth exceeded" errors.
- **Recursive Components**: The `<TreeNode />` component renders itself recursively to display nested data structures.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
