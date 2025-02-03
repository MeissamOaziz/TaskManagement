let currentProjectId = null;

function loadProjects() {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = projects.map(project => `
        <li onclick="selectProject(${project.id})">${project.name}</li>
    `).join('');
}

function selectProject(projectId) {
    currentProjectId = projectId;
    const project = projects.find(p => p.id == projectId);
    document.getElementById('selectedProjectName').textContent = project.name;
    loadBoards(project.boards);
}

function addProject() {
    const projectName = prompt("Enter project name:");
    if (projectName) {
        const newProject = { id: Date.now(), name: projectName, boards: [] };
        projects.push(newProject);
        loadProjects();
    }
}

function loadBoards(boards) {
    const boardsContainer = document.getElementById('boards');
    boardsContainer.innerHTML = boards.map(board => `
        <div class="board" onclick="selectBoard(${board.id})">${board.name}</div>
    `).join('');
}

function addBoard() {
    if (!currentProjectId) return alert("Select a project first");
    const boardName = prompt("Enter board name:");
    if (boardName) {
        const project = projects.find(p => p.id == currentProjectId);
        project.boards.push({ id: Date.now(), name: boardName, tasks: [] });
        loadBoards(project.boards);
    }
}

function loadTasks(tasks) {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = tasks.map(task => `
        <tr>
            <td>${task.name}</td>
            <td>${task.startDate || ''}</td>
            <td>${task.endDate || ''}</td>
            <td>${task.progress || 'New'}</td>
            <td>${task.files ? '<a href="#">Download</a>' : ''}</td>
            <td><button onclick="deleteTask(${task.id})">Delete</button></td>
        </tr>
    `).join('');
}

function addTask() {
    if (!currentProjectId) return alert("Select a project first");
    const taskName = prompt("Enter task name:");
    if (taskName) {
        const project = projects.find(p => p.id == currentProjectId);
        if (project && project.boards.length > 0) {
            const board = project.boards[0];
            board.tasks.push({
                id: Date.now(),
                name: taskName,
                startDate: '',
                endDate: '',
                progress: 'New',
                files: ''
            });
            loadTasks(board.tasks);
        }
    }
}

document.addEventListener('DOMContentLoaded', loadProjects);
