class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.todoIdCounter = 0;
        
        this.initElements();
        this.attachEventListeners();
        this.loadFromLocalStorage();
        this.render();
    }

    initElements() {
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.itemsLeft = document.getElementById('items-left');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const text = this.input.value.trim();
        
        if (text) {
            this.addTodo(text);
            this.input.value = '';
            this.input.focus();
        }
    }

    addTodo(text) {
        const todo = {
            id: this.todoIdCounter++,
            text: text,
            completed: false
        };
        
        this.todos.push(todo);
        this.saveToLocalStorage();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveToLocalStorage();
        this.render();
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

    updateItemsLeft() {
        const activeCount = this.todos.filter(t => !t.completed).length;
        const text = activeCount === 1 ? '1 item left' : `${activeCount} items left`;
        this.itemsLeft.textContent = text;
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        this.todoList.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn">Delete</button>
            `;
            
            const checkbox = li.querySelector('.todo-checkbox');
            const deleteBtn = li.querySelector('.delete-btn');
            
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            
            this.todoList.appendChild(li);
        });
        
        this.updateItemsLeft();
        
        const hasCompleted = this.todos.some(t => t.completed);
        this.clearCompletedBtn.style.visibility = hasCompleted ? 'visible' : 'hidden';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('todoIdCounter', this.todoIdCounter.toString());
    }

    loadFromLocalStorage() {
        const savedTodos = localStorage.getItem('todos');
        const savedCounter = localStorage.getItem('todoIdCounter');
        
        if (savedTodos) {
            try {
                this.todos = JSON.parse(savedTodos);
            } catch (e) {
                console.error('Error loading todos:', e);
                this.todos = [];
            }
        }
        
        if (savedCounter) {
            this.todoIdCounter = parseInt(savedCounter, 10);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});