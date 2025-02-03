// Initialize drag-and-drop for columns
document.addEventListener('DOMContentLoaded', function() {
    initializeSortable('todo-tasks');
    initializeSortable('progress-tasks');
    initializeSortable('done-tasks');
    loadTasks();
});

function initializeSortable(id) {
    Sortable.create(document.getElementById(id), {
        group: 'tasks',
        animation: 150,
        onEnd: function(evt) {
            saveTasks();
        }
    });
}

// Add a new task to "To Do"
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        const task = document.createElement('div');
        task.className = 'task';
        task.textContent = taskText;
        document.getElementById('todo-tasks').appendChild(task);
        taskInput.value = '';
        saveTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = {
        todo: document.getElementById('todo-tasks').innerHTML,
        progress: document.getElementById('progress-tasks').innerHTML,
        done: document.getElementById('done-tasks').innerHTML
    };
    localStorage.setItem('boardTasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('boardTasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        document.getElementById('todo-tasks').innerHTML = tasks.todo;
        document.getElementById('progress-tasks').innerHTML = tasks.progress;
        document.getElementById('done-tasks').innerHTML = tasks.done;
    }
}

// Reset the board
function resetBoard() {
    localStorage.removeItem('boardTasks');
    document.getElementById('todo-tasks').innerHTML = '';
    document.getElementById('progress-tasks').innerHTML = '';
    document.getElementById('done-tasks').innerHTML = '';
}