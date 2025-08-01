// Todo App JavaScript

// State
let todos = [];
let currentFilter = 'all';
let currentTheme = localStorage.getItem('theme') || 'light';
let draggedItem = null;

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dueDateInput = document.getElementById('due-date-input');
const prioritySelect = document.getElementById('priority-select');
const todoList = document.getElementById('todo-list');
const activeCount = document.getElementById('active-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

// Load todos from localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format due date for display
function formatDueDate(dateString) {
    if (!dateString) return '';
    
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return { text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`, class: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30' };
    } else if (diffDays === 0) {
        return { text: 'Due today', class: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30' };
    } else if (diffDays === 1) {
        return { text: 'Due tomorrow', class: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' };
    } else if (diffDays <= 7) {
        return { text: `Due in ${diffDays} days`, class: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' };
    } else {
        return { text: dueDate.toLocaleDateString(), class: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30' };
    }
}

// Create todo item HTML
function createTodoElement(todo, index) {
    const li = document.createElement('li');
    li.className = `todo-item relative flex items-center gap-3 p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-move ${todo.completed ? 'completed opacity-75' : ''}`;
    li.draggable = true;
    li.dataset.id = todo.id;
    li.dataset.index = index;

    const dueDateInfo = formatDueDate(todo.dueDate);
    const dueDateHtml = todo.dueDate ? 
        `<span class="text-xs px-2 py-1 rounded-full whitespace-nowrap ${dueDateInfo.class}">${dueDateInfo.text}</span>` : '';

    const priority = todo.priority || 'medium';
    const priorityColors = {
        high: 'bg-gradient-to-r from-red-500 to-pink-500',
        medium: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        low: 'bg-gradient-to-r from-green-500 to-teal-500'
    };
    const priorityIcons = {
        high: '🔴',
        medium: '🟡',
        low: '🟢'
    };

    li.innerHTML = `
        <div class="absolute left-0 top-0 w-1 h-full ${priorityColors[priority]} rounded-l"></div>
        <input type="checkbox" class="todo-checkbox w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text flex-1 text-gray-800 dark:text-gray-200 ${todo.completed ? 'line-through' : ''}">${escapeHtml(todo.text)}</span>
        <span class="text-xs px-3 py-1 rounded-full bg-gradient-to-r ${priorityColors[priority]} text-white font-semibold">${priorityIcons[priority]} ${priority.toUpperCase()}</span>
        ${dueDateHtml}
        <button class="delete-btn px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all opacity-0 group-hover:opacity-100">
            Delete
        </button>
    `;

    // Make the parent li a group for hover effects
    li.classList.add('group');

    // Add event listeners
    const checkbox = li.querySelector('.todo-checkbox');
    checkbox.addEventListener('change', () => {
        toggleTodo(todo.id);
        if (checkbox.checked) {
            li.classList.add('animate-bounce-in');
        }
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    // Drag and drop event listeners
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragend', handleDragEnd);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
    li.addEventListener('dragenter', handleDragEnter);
    li.addEventListener('dragleave', handleDragLeave);

    return li;
}

// Drag and drop handlers
function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('opacity-50');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('opacity-50');
    
    const items = todoList.querySelectorAll('.todo-item');
    items.forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedItem !== this) {
        const draggedIndex = parseInt(draggedItem.dataset.index);
        const targetIndex = parseInt(this.dataset.index);
        
        // Reorder todos array
        const [removed] = todos.splice(draggedIndex, 1);
        todos.splice(targetIndex, 0, removed);
        
        saveTodos();
        render();
    }

    return false;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add new todo
function addTodo(text, dueDate, priority) {
    const todo = {
        id: generateId(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: dueDate || null,
        priority: priority || 'medium'
    };

    todos.unshift(todo);
    saveTodos();
    render();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        render();
    }
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    render();
}

// Clear completed todos
function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    render();
}

// Filter todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// Update active count
function updateActiveCount() {
    const count = todos.filter(t => !t.completed).length;
    activeCount.textContent = count;
}

// Render todos
function render() {
    const filteredTodos = getFilteredTodos();
    
    // Clear list
    todoList.innerHTML = '';

    // Show empty state or todos
    if (todos.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'text-center py-12 text-gray-500 dark:text-gray-400';
        emptyState.innerHTML = '<p class="text-lg">No todos yet. Add one above!</p>';
        todoList.appendChild(emptyState);
    } else if (filteredTodos.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'text-center py-12 text-gray-500 dark:text-gray-400';
        emptyState.innerHTML = `<p class="text-lg">No ${currentFilter} todos</p>`;
        todoList.appendChild(emptyState);
    } else {
        filteredTodos.forEach((todo, index) => {
            todoList.appendChild(createTodoElement(todo, index));
        });
    }

    // Update counts and button states
    updateActiveCount();
    
    // Show/hide clear completed button
    const hasCompleted = todos.some(t => t.completed);
    clearCompletedBtn.style.visibility = hasCompleted ? 'visible' : 'hidden';
}

// Event Listeners
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text, dueDateInput.value, prioritySelect.value);
        todoInput.value = '';
        dueDateInput.value = '';
        prioritySelect.value = 'medium';
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active filter
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

// Theme functions
function setTheme(theme) {
    currentTheme = theme;
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Initialize app
setTheme(currentTheme);
loadTodos();
render();