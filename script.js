let currentProjectId = null;
let currentBoardId = null;

// Ensure 'projects' is only declared once
if (!window.projects) {
    try {
        window.projects = JSON.parse(localStorage.getItem('projects')) || [];
    } catch (error) {
        console.error("Error loading projects from localStorage:", error);
        window.projects = [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Script loaded successfully");
    const addProjectBtn = document.getElementById('addProjectBtn');
    const addBoardBtn = document.getElementById('addBoardBtn');
    const addTaskBtn = document.getElementById('addTaskBtn');

    if (addProjectBtn) addProjectBtn.addEventListener('click', addProject);
    if (addBoardBtn) addBoardBtn.addEventListener('click', () => {
        if (currentProjectId) {
            addBoard(currentProjectId);
        } else {
            alert("Please select a project first.");
        }
    });
    if (addTaskBtn) addTaskBtn.addEventListener('click', () => {
        if (currentProjectId && currentBoardId) {
            addTask();
        } else {
            alert("Please select a board first.");
        }
    });
    
    loadProjects();
});

function saveProjects() {
    try {
        localStorage.setItem('projects', JSON.stringify(window.projects));
    } catch (error) {
        console.error("Error saving projects to localStorage:", error);
    }
}

function loadProjects() {
    console.log("Loading projects...");
    const projectList = document.getElementById('projectList');
    if (!projectList) return;
    
    projectList.innerHTML = '';
    window.projects.forEach(project => {
        console.log("Project found:", project.name);
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
            console.log("Board found:", board.name);
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
    console.log("Selected project ID:", projectId);
    currentProjectId = projectId;
    currentBoardId = null;
    document.querySelectorAll('.project-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`.project-item:nth-child(${window.projects.findIndex(p => p.id === projectId) + 1})`).classList.add('active');
    loadProjects();
}

function selectBoard(projectId, boardId) {
    console.log("Selected board ID:", boardId);
    currentProjectId = projectId;
    currentBoardId = boardId;
}

function addProject() {
    console.log("Adding new project...");
    const projectName = prompt("Enter project name:");
    if (projectName) {
        const newProject = { id: Date.now(), name: projectName, boards: [] };
        window.projects.push(newProject);
        loadProjects();
    }
}

function editProject(projectId) {
    const project = window.projects.find(p => p.id == projectId);
    const newName = prompt("Enter new project name:", project.name);
    if (newName) {
        project.name = newName;
        loadProjects();
    }
}

function addBoard(projectId) {
    console.log("Adding board to project ID:", projectId);
    const boardName = prompt("Enter board name:");
    if (boardName) {
        const project = window.projects.find(p => p.id == projectId);
        if (project) {
            const newBoard = { id: Date.now(), name: boardName, tasks: [] };
            project.boards.push(newBoard);
            loadProjects();
        }
    }
}

function editBoard(projectId, boardId) {
    const project = window.projects.find(p => p.id == projectId);
    const board = project.boards.find(b => b.id == boardId);
    const newName = prompt("Enter new board name:", board.name);
    if (newName) {
        board.name = newName;
        loadProjects();
    }
}

function addTask() {
    console.log("Adding task to board ID:", currentBoardId);
    if (!currentProjectId || !currentBoardId) {
        alert("Select a project and board first.");
        return;
    }
    const taskName = prompt("Enter task name:");
    if (taskName) {
        const project = window.projects.find(p => p.id == currentProjectId);
        const board = project.boards.find(b => b.id == currentBoardId);
        if (board) {
            board.tasks.push({ id: Date.now(), name: taskName });
            loadProjects();
        }
    }
}
