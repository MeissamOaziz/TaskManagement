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

        if (project.id === currentProjectId) {
            projectItem.classList.add('active');
        }

        const boardList = document.createElement('ul');
        boardList.classList.add('board-list');
        boardList.id = `boards-${project.id}`;

        if (project.id === currentProjectId) {
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
                if (board.id === currentBoardId) {
                    boardItem.classList.add('active');
                }
                boardList.appendChild(boardItem);
            });
        }
        projectItem.appendChild(boardList);
        projectList.appendChild(projectItem);
    });
    loadBoards();
    saveProjects();
}

function loadBoards() {
    const boardsContainer = document.getElementById('boards');
    if (!boardsContainer) return;
    boardsContainer.innerHTML = '';
    const project = window.projects.find(p => p.id === currentProjectId);
    if (!project) return;
    
    project.boards.forEach(board => {
        const boardElement = document.createElement('div');
        boardElement.classList.add('board-view');
        boardElement.innerHTML = `<h3>${board.name}</h3>`;
        
        if (board.id === currentBoardId) {
            boardElement.classList.add('active');
        }
        
        const taskList = document.createElement('ul');
        board.tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.textContent = task.name;
            taskList.appendChild(taskItem);
        });
        boardElement.appendChild(taskList);
        boardsContainer.appendChild(boardElement);
    });
}

function addProject() {
    console.log("Adding new project...");
    const projectName = prompt("Enter project name:");
    if (projectName) {
        const newProject = { id: Date.now(), name: projectName, boards: [] };
        window.projects.push(newProject);
        saveProjects();
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
            saveProjects();
            loadProjects();
        }
    }
}

function selectProject(projectId) {
    console.log("Selected project ID:", projectId);
    currentProjectId = projectId;
    currentBoardId = null;
    loadProjects();
}

function selectBoard(projectId, boardId) {
    console.log("Selected board ID:", boardId);
    currentProjectId = projectId;
    currentBoardId = boardId;
    loadProjects();
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
            saveProjects();
            loadBoards();
        }
    }
}
