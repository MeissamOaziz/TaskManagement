let currentProjectId = null;

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
        </div>
    `).join('');
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
            loadProjects();
        }
    }
}

// Delete Project
function deleteProject() {
    if (confirm("Are you sure you want to delete this project?")) {
        projects = projects.filter(p => p.id != currentProjectId);
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
                columns: [],
                tasks: []
            };
            project.boards.push(newBoard);
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
            const board = project.boards[0]; // Add to the first board for now
            board.tasks.push({
                id: Date.now(),
                name: taskText,
                columns: {}
            });
            taskInput.value = '';
            loadTasks(board.tasks);
        }
    }
}

// Load Tasks
function loadTasks(tasks) {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task" data-task-id="${task.id}">
            <div>${task.name}</div>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', loadProjects);
