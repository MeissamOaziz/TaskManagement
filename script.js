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
    const addTaskGroupBtn = document.createElement('button');
    addTaskGroupBtn.textContent = '+ Add Task Group';
    addTaskGroupBtn.classList.add('add-task-group-btn');
    addTaskGroupBtn.onclick = () => addTaskGroup(currentBoardId);
    document.querySelector('.board-header').appendChild(addTaskGroupBtn);

    if (addProjectBtn) addProjectBtn.addEventListener('click', addProject);
    if (addBoardBtn) addBoardBtn.addEventListener('click', () => {
        if (currentProjectId) {
            addBoard(currentProjectId);
        } else {
            alert("Please select a project first.");
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
        projectNameSpan.ondblclick = (event) => {
            event.stopPropagation();
            projectNameSpan.contentEditable = true;
            projectNameSpan.focus();
        };
        projectNameSpan.onblur = () => {
            projectNameSpan.contentEditable = false;
            project.name = projectNameSpan.textContent;
            saveProjects();
        };
        projectNameSpan.onkeydown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                projectNameSpan.blur(); // Save and exit edit mode
            }
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
                boardNameSpan.ondblclick = (event) => {
                    event.stopPropagation();
                    boardNameSpan.contentEditable = true;
                    boardNameSpan.focus();
                };
                boardNameSpan.onblur = () => {
                    boardNameSpan.contentEditable = false;
                    board.name = boardNameSpan.textContent;
                    saveProjects();
                };
                boardNameSpan.onkeydown = (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        boardNameSpan.blur(); // Save and exit edit mode
                    }
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
    const kanbanBoard = document.getElementById('kanbanBoard');
    if (!kanbanBoard) return;
    kanbanBoard.innerHTML = '';

    const project = window.projects.find(p => p.id === currentProjectId);
    if (!project) return;

    const board = project.boards.find(b => b.id === currentBoardId);
    if (!board) return;

    // Load task groups
    board.taskGroups?.forEach(taskGroup => {
        const taskGroupElement = document.createElement('div');
        taskGroupElement.classList.add('task-group');
        taskGroupElement.innerHTML = `<h3>${taskGroup.name}</h3>`;

        const taskList = document.createElement('ul');
        taskList.classList.add('task-list');
        taskGroup.tasks?.forEach(task => {
            const taskCard = document.createElement('li');
            taskCard.classList.add('task-card');
            taskCard.innerHTML = `
                <h4>${task.name}</h4>
                <p>${task.description || ''}</p>
            `;
            taskList.appendChild(taskCard);
        });
        taskGroupElement.appendChild(taskList);
        kanbanBoard.appendChild(taskGroupElement);
    });

    // Enable drag-and-drop for task groups
    Sortable.create(kanbanBoard, {
        group: 'taskGroups',
        animation: 150,
        handle: '.task-group',
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
            const newBoard = { id: Date.now(), name: boardName, taskGroups: [] };
            project.boards.push(newBoard);
            saveProjects();
            loadProjects();
        }
    }
}

function addTaskGroup(boardId) {
    console.log("Adding task group to board ID:", boardId);
    const taskGroupName = prompt("Enter task group name:");
    if (taskGroupName) {
        const project = window.projects.find(p => p.id === currentProjectId);
        const board = project?.boards.find(b => b.id === boardId);
        if (board) {
            const newTaskGroup = { id: Date.now(), name: taskGroupName, tasks: [] };
            board.taskGroups = board.taskGroups || [];
            board.taskGroups.push(newTaskGroup);
            saveProjects();
            loadBoards();
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
