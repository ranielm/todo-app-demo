class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.remainingCount = document.getElementById('remaining-count');
        this.themeToggle = document.getElementById('theme-toggle');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.prioritySelect = document.getElementById('priority-select');
        
        this.init();
    }
    
    init() {
        this.todoForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
        
        this.loadTheme();
        this.render();
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const text = this.todoInput.value.trim();
        const priority = this.prioritySelect.value;
        
        if (text) {
            this.addTodo(text, priority);
            this.todoInput.value = '';
            this.prioritySelect.value = 'medium';
            this.todoInput.focus();
        }
    }
    
    addTodo(text, priority = 'medium') {
        const todo = {
            id: Date.now(),
            text,
            completed: false,
            priority
        };
        
        this.todos.push(todo);
        this.save();
        this.render();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
        this.render();
    }
    
    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    
    render() {
        this.todoList.innerHTML = '';
        
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.parentElement.classList.add('empty');
        } else {
            this.todoList.parentElement.classList.remove('empty');
        }
        
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            
            const priorityColors = {
                high: 'bg-red-500',
                medium: 'bg-orange-500',
                low: 'bg-green-500'
            };
            
            li.className = `flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 ${todo.completed ? 'opacity-60' : ''}`;
            
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="w-5 h-5 mr-4 cursor-pointer accent-purple-500" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <span class="w-1 h-5 rounded mr-3 flex-shrink-0 ${priorityColors[todo.priority || 'medium']}"></span>
                <span class="flex-1 text-base text-gray-900 dark:text-gray-100 ${todo.completed ? 'line-through' : ''}">${this.escapeHtml(todo.text)}</span>
                <button class="p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-200" data-id="${todo.id}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            
            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            
            this.todoList.appendChild(li);
        });
        
        this.updateCount();
    }
    
    updateCount() {
        const remaining = this.todos.filter(t => !t.completed).length;
        this.remainingCount.textContent = remaining;
        
        const hasCompleted = this.todos.some(t => t.completed);
        this.clearCompletedBtn.disabled = !hasCompleted;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark');
        localStorage.setItem('darkMode', isDarkMode);
    }
    
    loadTheme() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark');
        }
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
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
    
    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.save();
        this.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});