class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentFilter = 'all';
        this.theme = this.loadTheme();
        this.init();
    }

    init() {
        this.applyTheme();
        this.cacheDOMElements();
        this.bindEvents();
        this.render();
    }

    cacheDOMElements() {
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('new-todo');
        this.todoList = document.getElementById('todo-list');
        this.activeCount = document.getElementById('active-count');
        this.itemsText = document.getElementById('items-text');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.querySelector('.theme-icon');
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e));
        });
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    handleSubmit(e) {
        e.preventDefault();
        const text = this.input.value.trim();
        if (text) {
            this.addTodo(text);
            this.input.value = '';
        }
    }

    addTodo(text) {
        const todo = {
            id: Date.now(),
            text,
            completed: false
        };
        this.todos.push(todo);
        this.saveTodos();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
    }

    setFilter(e) {
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        this.todoList.innerHTML = '';

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            
            li.className = `group flex items-center gap-3 p-3 rounded-lg transition-all duration-200 animate-fade-in ${
                todo.completed 
                    ? 'bg-gray-50 dark:bg-gray-700/30' 
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50'
            }`;
            
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="w-5 h-5 rounded border-2 cursor-pointer transition-colors duration-200 ${
                        todo.completed 
                            ? 'text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600' 
                            : 'text-blue-500 dark:text-blue-400 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400'
                    }" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <span class="flex-1 text-gray-900 dark:text-gray-100 ${
                    todo.completed 
                        ? 'line-through text-gray-500 dark:text-gray-400' 
                        : ''
                }">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-all duration-200" data-id="${todo.id}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            this.todoList.appendChild(li);
        });

        this.updateFooter();
        this.updateFilterStyles();
    }

    updateFooter() {
        const activeCount = this.todos.filter(t => !t.completed).length;
        this.activeCount.textContent = activeCount;
        this.itemsText.textContent = activeCount === 1 ? 'item' : 'items';
        
        const hasCompleted = this.todos.some(t => t.completed);
        this.clearCompletedBtn.style.display = hasCompleted ? 'block' : 'none';
    }

    updateFilterStyles() {
        this.filterBtns.forEach(btn => {
            if (btn.classList.contains('active')) {
                btn.className = 'filter-btn px-3 py-1 rounded text-sm transition-all duration-200 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100';
            } else {
                btn.className = 'filter-btn px-3 py-1 rounded text-sm transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100';
            }
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        if (this.themeIcon) {
            if (this.theme === 'light') {
                this.themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
            } else {
                this.themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
            }
        }
    }

    saveTheme() {
        localStorage.setItem('theme', this.theme);
    }

    loadTheme() {
        const saved = localStorage.getItem('theme');
        return saved || 'light';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});