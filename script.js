let currentProjectId = null;
let currentBoardId = null;

// Load Projects into Dropdown
function loadProjects() {
    const projectSelect = document.getElementById('projectSelect');
    projectSelect.innerHTML = projects.map(project => `
        <option value="${project.id}">${project.name}</option>
    `).join('');
    loadProject();
}

// Load Selected Project
function loadProject() {
    const projectSelect = document.getElementById('projectSelect');
    currentProjectId = projectSelect.value;
    const project = projects.find(p => p.id == currentProjectId);
    if (project) {
        loadBoards(project.boards);
    }
}

// Load Boards
function loadBoards(boards) {
    const boardsContainer = document.getElementById('boards');
    boardsContainer.innerHTML = boards.map(board => `
        <div class="board" data-board-id="${board.id}">
            <h3>${board.name}</h3>
            <button onclick="editBoard(${board.id})">Edit</button>
            <button onclick="deleteBoard(${board.id})">Delete</button>
            <button onclick="setCurrentBoard(${board.id})">View Tasks</button>
        </div>
    `).join('');
}

// Set Current Board
function setCurrentBoard(boardId) {
    currentBoardId = boardId;
    const project = projects.find(p => p.id == currentProjectId);
    if (project) {
        const board = project.boards.find(b => b.id == boardId);
        if (board) {
            loadTasks(board.tasks);
            loadColumns(board.columns);
        }
    }
}

// Load Columns
function loadColumns(columns) {
    const columnsContainer = document.getElementById('columns');
    columnsContainer.innerHTML = columns.map(column => `
        <div class="column" data-column-name="${column.name}">
            <h4>${column.name}</h4>
        </div>
    `).join('');
}

// Load Tasks
function loadTasks(tasks) {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task" data-task-id="${task.id}">
            <div>${task.name}</div>
            ${task.columns ? Object.entries(task.columns).map(([key, value]) => `
                <div>${key}: ${value}</div>
            `).join('') : ''}
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join('');
    initializeSortable();
}

// Initialize Drag-and-Drop
function initializeSortable() {
    const tasksContainer = document.getElementById('tasks');
    Sortable.create(tasksContainer, {
        group: 'tasks',
        animation: 150,
        onEnd: function (evt) {
            saveProjects();
        }
    });
}

// Add New Project
function addProject() {
    const projectName = prompt("Enter project name:");
    if (projectName) {
        const newProject = {
            id: Date.now(),
            name: projectName,
            boards: []
        };
        projects.push(newProject);
        saveProjects();
        loadProjects();
    }
}

// Rename Project
function renameProject() {
    const project = projects.find(p => p.id == currentProjectId);
    if (project) {
        const newName = prompt("Enter new project name:", project.name);
        if (newName) {
            project.name = newName;
            saveProjects();
            loadProjects();
        }
    }
}

// Delete Project
function deleteProject() {
    if (confirm("Are you sure you want to delete this project?")) {
        projects = projects.filter(p => p.id != currentProjectId);
        saveProjects();
        loadProjects();
    }
}

// Add New Board
function addBoard() {
    const boardName = prompt("Enter board name:");
    if (boardName) {
        const project = projects.find(p => p.id == currentProjectId);
        if (project) {
            const newBoard = {
                id: Date.now(),
                name: boardName,
                columns: [
                    { name: "Task", type: "text" },
                    { name: "Progress", type: "dropdown", options: ["New", "In Progress", "Completed"] },
                    { name: "Files", type: "file" }
                ],
                tasks: []
            };
            project.boards.push(newBoard);
            saveProjects();
            loadBoards(project.boards);
        }
    }
}

// Edit Board
function editBoard(boardId) {
    const project = projects.find(p => p.id == currentProjectId);
    if (project) {
        const board = project.boards.find(b => b.id == boardId);
        if (board) {
            const newName = prompt("Enter new board name:", board.name);
            if (newName) {
                board.name = newName;
                saveProjects();
                loadBoards(project.boards);
            }
        }
    }
}

// Delete Board
function deleteBoard(boardId) {
    if (confirm("Are you sure you want to delete this board?")) {
        const project = projects.find(p => p.id == currentProjectId);
        if (project) {
            project.boards = project.boards.filter(b => b.id != boardId);
            saveProjects();
            loadBoards(project.boards);
        }
    }
}

// Add Task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText) {
        const project = projects.find(p => p.id == currentProjectId);
        if (project && project.boards.length > 0) {
            const board = project.boards.find(b => b.id == currentBoardId);
            if (board) {
                board.tasks.push({
                    id: Date.now(),
                    name: taskText,
                    columns: {}
                });
                taskInput.value = '';
                saveProjects();
                loadTasks(board.tasks);
            }
        }
    }
}

// Edit Task
function editTask(taskId) {
    const project = projects.find(p => p.id == currentProjectId);
    if (project) {
        const board = project.boards.find(b => b.id == currentBoardId);
        if (board) {
            const task = board.tasks.find(t => t.id == taskId);
            if (task) {
                const newName = prompt("Enter new task name:", task.name);
                if (newName) {
                    task.name = newName;
                    saveProjects();
                    loadTasks(board.tasks);
                }
            }
        }
    }
}

// Delete Task
function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        const project = projects.find(p => p.id == currentProjectId);
        if (project) {
            const board = project.boards.find(b => b.id == currentBoardId);
            if (board) {
                board.tasks = board.tasks.filter(t => t.id != taskId);
                saveProjects();
                loadTasks(board.tasks);
            }
        }
    }
}

// Save Projects to LocalStorage
function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Load Projects from LocalStorage
function loadProjectsFromStorage() {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjectsFromStorage();
    loadProjects();
});
