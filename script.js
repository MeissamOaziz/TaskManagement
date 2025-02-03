let currentProjectId = null;
let projects = JSON.parse(localStorage.getItem('projects')) || [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addProjectBtn').addEventListener('click', addProject);
    document.getElementById('addBoardBtn').addEventListener('click', () => {
        if (currentProjectId) {
            addBoard(currentProjectId);
        } else {
            alert("Please select a project first.");
        }
    });
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        if (currentProjectId) {
            addTask();
        } else {
            alert("Please select a project first.");
        }
    });
    loadProjects();
});

function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function loadProjects() {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = '';
    projects.forEach(project => {
        const projectItem = document.createElement('li');
        projectItem.classList.add('project-item');
        projectItem.textContent = project.name;
        projectItem.onclick = () => selectProject(project.id);
        projectItem.ondblclick = () => editProject(project.id);

        const addBoardBtn = document.createElement('button');
        addBoardBtn.textContent = '+ Add Board';
        addBoardBtn.classList.add('add-board-btn');
        addBoardBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            addBoard(project.id);
        });
        projectItem.appendChild(addBoardBtn);

        const boardList = document.createElement('ul');
        boardList.classList.add('board-list');
        boardList.id = `boards-${project.id}`;

        project.boards.forEach(board => {
            const boardItem = document.createElement('li');
            boardItem.classList.add('board-item');
            boardItem.textContent = board.name;
            boardItem.onclick = (event) => {
                event.stopPropagation();
                selectBoard(project.id, board.id);
            };
            boardItem.ondblclick = () => editBoard(project.id, board.id);
            boardList.appendChild(boardItem);
        });

        projectItem.appendChild(boardList);
        projectList.appendChild(projectItem);
    });
    saveProjects();
}

function selectProject(projectId) {
    currentProjectId = projectId;
    document.querySelectorAll('.project-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`.project-item:nth-child(${projects.findIndex(p => p.id === projectId) + 1})`).classList.add('active');
    loadProjects();
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
