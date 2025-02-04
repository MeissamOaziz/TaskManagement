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
    const addTaskBtn = document.getElementById('addTaskBtn');

    if (addProjectBtn) addProjectBtn.addEventListener('click', addProject);
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
        const projectNameSpan = document.createElement('span');
        projectNameSpan.textContent = project.name;
        projectNameSpan.classList.add('editable');
        projectNameSpan.contentEditable = true;
        projectNameSpan.ondblclick = (event) => {
            event.stopPropagation();
            projectNameSpan.contentEditable = true;
            projectNameSpan.focus();
        };
        projectNameSpan.onblur = () => {
            project.name = projectNameSpan.textContent;
            saveProjects();
        };
        projectItem.appendChild(projectNameSpan);
        projectItem.onclick = () => selectProject(project.id);
        
        if (project.id === currentProjectId) {
            projectItem.classList.add('active');
        }

        const addBoardBtn = document.createElement('button');
        addBoardBtn.textContent = '+ Add Board';
        addBoardBtn.classList.add('add-board-btn');
        addBoardBtn.onclick = () => addBoard(project.id);
        projectItem.appendChild(addBoardBtn);
        
        const boardList = document.createElement('ul');
        boardList.classList.add('board-list');
        boardList.id = `boards-${project.id}`;

        if (project.id === currentProjectId) {
            project.boards.forEach(board => {
                console.log("Board found:", board.name);
                const boardItem = document.createElement('li');
                boardItem.classList.add('board-item');
                const boardNameSpan = document.createElement('span');
                boardNameSpan.textContent = board.name;
                boardNameSpan.classList.add('editable');
                boardNameSpan.contentEditable = true;
                boardNameSpan.ondblclick = (event) => {
                    event.stopPropagation();
                    boardNameSpan.contentEditable = true;
                    boardNameSpan.focus();
                };
                boardNameSpan.onblur = () => {
                    board.name = boardNameSpan.textContent;
                    saveProjects();
                };
                boardItem.appendChild(boardNameSpan);
                boardItem.onclick = (event) => {
                    event.stopPropagation();
                    selectBoard(project.id, board.id);
                };
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
        const boardNameHeading = document.createElement('h3');
        boardNameHeading.textContent = board.name;
        boardNameHeading.classList.add('editable');
        boardNameHeading.contentEditable = true;
        boardNameHeading.ondblclick = (event) => {
            event.stopPropagation();
            boardNameHeading.contentEditable = true;
            boardNameHeading.focus();
        };
        boardNameHeading.onblur = () => {
            board.name = boardNameHeading.textContent;
            saveProjects();
        };
        boardElement.appendChild(boardNameHeading);
        
        if (board.id === currentBoardId) {
            boardElement.classList.add('active');
        }
        
        const taskList = document.createElement('ul');
        board.tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `<span contenteditable="true" class="editable">${task.name}</span>`;
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
