let currentProjectId = null;
let projects = JSON.parse(localStorage.getItem('projects')) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    document.getElementById('addProjectBtn').addEventListener('click', addProject);
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
});

function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function loadProjects() {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = projects.map(project => `
        <li class="project-item" onclick="selectProject(${project.id})">
            <span ondblclick="editProject(${project.id})">${project.name}</span>
            <button class="add-board-btn" data-project-id="${project.id}">+ Add Board</button>
            <ul class="board-list" id="boards-${project.id}">
                ${project.boards.map(board => `
                    <li class="board-item" onclick="selectBoard(event, ${project.id}, ${board.id})">
                        <span ondblclick="editBoard(${project.id}, ${board.id})">${board.name}</span>
                    </li>
                `).join('')}
            </ul>
        </li>
    `).join('');
    saveProjects();
    document.querySelectorAll('.add-board-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            addBoard(parseInt(button.getAttribute('data-project-id')));
        });
    });
}

function selectProject(projectId) {
    currentProjectId = projectId;
    document.querySelectorAll('.project-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`.project-item[onclick='selectProject(${projectId})']`).classList.add('active');
    loadBoards(projects.find(p => p.id == projectId).boards, projectId);
}

function addProject() {
    const projectName = prompt("Enter project name:");
    if (projectName) {
        const newProject = { id: Date.now(), name: projectName, boards: [] };
        projects.push(newProject);
        loadProjects();
    }
}

function editProject(projectId) {
    const project = projects.find(p => p.id == projectId);
    const newName = prompt("Enter new project name:", project.name);
    if (newName) {
        project.name = newName;
        loadProjects();
    }
}

function addBoard(projectId) {
    const boardName = prompt("Enter board name:");
    if (boardName) {
        const project = projects.find(p => p.id == projectId);
        if (project) {
            project.boards.push({ id: Date.now(), name: boardName, tasks: [] });
            loadProjects();
        }
    }
}

function editBoard(projectId, boardId) {
    const project = projects.find(p => p.id == projectId);
    const board = project.boards.find(b => b.id == boardId);
    const newName = prompt("Enter new board name:", board.name);
    if (newName) {
        board.name = newName;
        loadProjects();
    }
}

function addTask() {
    if (!currentProjectId) {
        alert("Select a project first.");
        return;
    }
    const taskName = prompt("Enter task name:");
    if (taskName) {
        const project = projects.find(p => p.id == currentProjectId);
        if (project && project.boards.length > 0) {
            project.boards[0].tasks.push({ id: Date.now(), name: taskName });
            loadProjects();
        }
    }
}
