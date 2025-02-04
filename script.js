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
    const addTaskGroupBtn = document.getElementById('addTaskGroupBtn');

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
    if (addTaskGroupBtn) addTaskGroupBtn.addEventListener('click', addTaskGroup);
    
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
        if (board.id === currentBoardId) {
            const boardElement = document.createElement('div');
            boardElement.classList.add('board-view');
            boardElement.innerHTML = `<h3>${board.name}</h3>`;
            
            board.taskGroups = board.taskGroups || [{ id: Date.now(), name: "Task Group 1", tasks: [] }];
            
            board.taskGroups.forEach(taskGroup => {
                const groupElement = document.createElement('div');
                groupElement.classList.add('task-group');
                groupElement.innerHTML = `<h4>${taskGroup.name}</h4>`;
                
                const taskList = document.createElement('ul');
                taskGroup.tasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.textContent = task.name;
                    taskList.appendChild(taskItem);
                });
                
                const addTaskBtn = document.createElement('button');
                addTaskBtn.textContent = '+ Add Task';
                addTaskBtn.onclick = () => addTask(board.id, taskGroup.id);
                
                groupElement.appendChild(taskList);
                groupElement.appendChild(addTaskBtn);
                boardElement.appendChild(groupElement);
            });
            
            boardsContainer.appendChild(boardElement);
        }
    });
}

function addTaskGroup() {
    if (!currentProjectId || !currentBoardId) {
        alert("Select a project and board first.");
        return;
    }
    const project = window.projects.find(p => p.id === currentProjectId);
    const board = project.boards.find(b => b.id === currentBoardId);
    if (board) {
        const newGroup = { id: Date.now(), name: `Task Group ${board.taskGroups.length + 1}`, tasks: [] };
        board.taskGroups.push(newGroup);
        saveProjects();
        loadBoards();
    }
}
