class TodoApp {
    constructor() {
        this.todos = [];
        this.currentEditingId = null;
        this.nextId = 1;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
    }

    bindEvents() {
        // Add todo events
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Prevent form submission if wrapped in a form
        this.todoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') e.preventDefault();
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: this.nextId++,
            text: text,
            completed: false,
            createdAt: new Date()
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.updateDisplay();
        
        // Add animation class to new item
        setTimeout(() => {
            const newItem = document.querySelector(`[data-id="${todo.id}"]`);
            if (newItem) {
                newItem.classList.add('new');
                setTimeout(() => newItem.classList.remove('new'), 300);
            }
        }, 10);
    }

    editTodo(id) {
        if (this.currentEditingId !== null) {
            this.cancelEdit();
        }

        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        this.currentEditingId = id;
        this.updateDisplay();
        
        // Focus on the input and select text
        const input = document.querySelector(`[data-id="${id}"] .todo-content`);
        if (input) {
            input.focus();
            input.select();
        }
    }

    saveTodo(id) {
        const input = document.querySelector(`[data-id="${id}"] .todo-content`);
        if (!input) return;

        const newText = input.value.trim();
        if (!newText) {
            this.deleteTodo(id);
            return;
        }

        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = newText;
            todo.updatedAt = new Date();
        }

        this.currentEditingId = null;
        this.updateDisplay();
    }

    cancelEdit() {
        this.currentEditingId = null;
        this.updateDisplay();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        if (this.currentEditingId === id) {
            this.currentEditingId = null;
        }
        this.updateDisplay();
    }

    updateDisplay() {
        // Clear current list
        this.todoList.innerHTML = '';

        // Show/hide empty state
        if (this.todos.length === 0) {
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');

        // Render todos
        this.todos.forEach(todo => {
            const li = this.createTodoElement(todo);
            this.todoList.appendChild(li);
        });
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.setAttribute('data-id', todo.id);

        const isEditing = this.currentEditingId === todo.id;

        li.innerHTML = `
            ${isEditing ? 
                `<input type="text" class="todo-content editing" value="${this.escapeHtml(todo.text)}" maxlength="100">` :
                `<span class="todo-content">${this.escapeHtml(todo.text)}</span>`
            }
            <div class="todo-actions">
                ${isEditing ? `
                    <button class="action-btn save-btn" onclick="app.saveTodo(${todo.id})" title="Save changes">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="action-btn cancel-btn" onclick="app.cancelEdit()" title="Cancel editing">
                        <i class="fas fa-times"></i>
                    </button>
                ` : `
                    <button class="action-btn edit-btn" onclick="app.editTodo(${todo.id})" title="Edit todo">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="app.deleteTodo(${todo.id})" title="Delete todo">
                        <i class="fas fa-trash"></i>
                    </button>
                `}
            </div>
        `;

        // Add event listeners for editing mode
        if (isEditing) {
            const input = li.querySelector('.todo-content');
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.saveTodo(todo.id);
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.cancelEdit();
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            });
        }

        return li;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Utility methods for testing
    getTodos() {
        return this.todos;
    }

    getTodoById(id) {
        return this.todos.find(todo => todo.id === id);
    }

    clear() {
        this.todos = [];
        this.currentEditingId = null;
        this.nextId = 1;
        this.updateDisplay();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TodoApp;
}