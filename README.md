# 🌈 Modern Todo App

A beautiful, feature-rich todo application built with vanilla JavaScript and styled with Tailwind CSS. This app demonstrates modern web development practices with a focus on user experience and visual appeal.

![Todo App Screenshot](screenshot.png)

## ✨ Features

### Core Functionality
- ✅ **Add, complete, and delete tasks** - Full CRUD operations for todo items
- 📝 **Task filtering** - View all, active, or completed tasks
- 💾 **Local storage persistence** - Your tasks are saved between sessions
- 📊 **Active task counter** - Keep track of remaining tasks
- 🧹 **Clear completed** - Remove all completed tasks at once

### Advanced Features
- 🌙 **Dark mode** - Toggle between light and dark themes
- 📅 **Due dates** - Set and track due dates with smart formatting
- 🎯 **Priority levels** - Categorize tasks as High, Medium, or Low
- 🎨 **Colorful design** - Beautiful gradients and animations
- 📱 **Fully responsive** - Works perfectly on all devices
- 🔄 **Drag & drop reordering** - Reorganize tasks by dragging
- 🎭 **Smooth animations** - Delightful interactions and transitions

## 🚀 Getting Started

### Prerequisites
No build tools or dependencies required! This is a pure HTML/CSS/JavaScript application.

### Installation
1. Clone the repository:
   ```bash
   gh repo clone ranielm/todo-app-demo
   # or
   git clone https://github.com/ranielm/todo-app-demo.git
   ```

2. Navigate to the project:
   ```bash
   cd todo-app-demo
   ```

3. Open the app:
   - Simply open `src/index.html` in your web browser
   - Or use a local server (e.g., Live Server in VS Code)

## 🛠️ Technology Stack

- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Emoji icons for universal compatibility
- **Storage**: Browser LocalStorage API
- **Animations**: CSS transitions and keyframes

## 📁 Project Structure

```
todo-app-demo/
├── src/
│   ├── index.html    # Main HTML file with Tailwind classes
│   └── app.js        # JavaScript logic and functionality
├── README.md         # This file
└── CLAUDE.md        # Instructions for Claude Code AI
```

## 🎨 Design Features

### Color Scheme
- **Purple/Pink gradients** for headers and buttons
- **Priority colors**:
  - 🔴 High: Red/Pink gradient
  - 🟡 Medium: Yellow/Orange gradient
  - 🟢 Low: Green/Teal gradient
- **Dark mode** with carefully selected colors for readability

### Animations
- **Slide-in** effect for new todos
- **Bounce-in** animation when completing tasks
- **Smooth transitions** on all interactive elements
- **Hover effects** with subtle transformations

### Responsive Design
- Mobile-first approach
- Breakpoints for tablets and desktop
- Touch-friendly interface
- Adaptive layout for all screen sizes

## 🔧 Customization

### Adding New Features
The codebase is well-organized and documented. Key functions:
- `addTodo()` - Add new tasks
- `toggleTodo()` - Mark tasks complete/incomplete
- `deleteTodo()` - Remove tasks
- `render()` - Update the UI

### Styling
All styles use Tailwind utility classes. To customize:
1. Modify classes in `index.html`
2. Update color schemes in the Tailwind config
3. Add new animations in the `<script>` section

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👏 Acknowledgments

- Built with Claude Code assistance
- Inspired by modern todo applications
- Tailwind CSS for the excellent utility-first framework

---

Made with ❤️ by [Your Name]