let currentProjectId = null;
let currentBoardId = null;
let currentTaskGroupId = null;
let progressOptions = [
    { name: "New", color: "#3498db" },
    { name: "In Progress", color: "#f1c40f" },
    { name: "Completed", color: "#2ecc71" }
];

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
    const addTaskGroupBtn = document.getElementById('addTaskGroupBtn');
    const taskFormModal = document.getElementById('taskFormModal');
    const progressOptionsModal = document.getElementById('progressOptionsModal');
    const addProgressOptionBtn = document.getElementById('addProgressOptionBtn');

    if (addProjectBtn) addProjectBtn.addEventListener('click', addProject);
    if (addTaskGroupBtn) addTaskGroupBtn.addEventListener('click', () => {
        if (currentBoardId) {
            addTaskGroup(currentBoardId);
        } else {
            alert("Please select a board first.");
        }
    });

    // Open task form modal
    document.querySelectorAll('.add-task-btn').forEach(button => {
        button.addEventListener('click', () => {
            openTaskFormModal();
        });
    });

    // Close modals
    document.querySelectorAll('.modal .close').forEach(button => {
        button.addEventListener('click', () => {
            taskFormModal.style.display = 'none';
            progressOptionsModal.style.display = 'none';
        });
    });

    // Save task form
    document.getElementById('taskForm').addEventListener('submit', (event) => {
        event.preventDefault();
        saveTask();
    });

    // Add progress option
    if (addProgressOptionBtn) {
        addProgressOptionBtn.addEventListener('click', () => {
            addProgressOption();
        });
    }

    // Save progress options
    document.getElementById('progressOptionsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        saveProgressOptions();
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
        addBoardBtn.classList.add('add-btn');
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

                // Load task groups under the board
                const taskGroupList = document.createElement('ul');
                taskGroupList.classList.add('task-group-list');
                board.taskGroups?.forEach(taskGroup => {
                    const taskGroupItem = document.createElement('li');
                    taskGroupItem.classList.add('task-group-item');
                    taskGroupItem.textContent = taskGroup.name;
                    taskGroupItem.onclick = (event) => {
                        event.stopPropagation();
                        selectTaskGroup(board.id, taskGroup.id);
                    };
                    taskGroupList.appendChild(taskGroupItem);
                });
                boardItem.appendChild(taskGroupList);
                boardList.appendChild(boardItem);
            });
        }
        projectItem.appendChild(boardList);
        projectList.appendChild(projectItem);
    });
    loadTaskGroups();
    saveProjects();
}

function loadTaskGroups() {
    const taskGroupSection = document.getElementById('taskGroupSection');
    if (!taskGroupSection) return;
    taskGroupSection.innerHTML = '';

    const project = window.projects.find(p => p.id === currentProjectId);
    if (!project) return;

    const board = project.boards.find(b => b.id === currentBoardId);
    if (!board) return;

    board.taskGroups?.forEach(taskGroup => {
        const taskGroupElement = document.createElement('div');
        taskGroupElement.classList.add('task-group');
        taskGroupElement.innerHTML = `<h3>${taskGroup.name}</h3>`;

        // Add "Add Task" button under the task group
        const addTaskBtn = document.createElement('button');
        addTaskBtn.textContent = '+ Add Task';
        addTaskBtn.classList.add('add-btn');
        addTaskBtn.onclick = () => openTaskFormModal(taskGroup.id);
        taskGroupElement.appendChild(addTaskBtn);

        // Load tasks under the task group
        const taskTable = document.createElement('table');
        taskTable.classList.add('task-table');
        taskTable.innerHTML = `
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Start Date</th>
                    <th>Due Date</th>
                    <th>Progress</th>
                    <th>Files</th>
                </tr>
            </thead>
            <tbody>
                ${taskGroup.tasks?.map(task => `
                    <tr>
                        <td>${task.name}</td>
                        <td>${task.startDate || ''}</td>
                        <td>${task.dueDate || ''}</td>
                        <td style="background-color: ${task.progressColor || '#fff'}">${task.progress || ''}</td>
                        <td>${task.files || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        taskGroupElement.appendChild(taskTable);
        taskGroupSection.appendChild(taskGroupElement);
    });
}

function openTaskFormModal(taskGroupId) {
    const taskFormModal = document.getElementById('taskFormModal');
    const taskForm = document.getElementById('taskForm');
    const progressSelect = document.getElementById('progress');

    // Clear previous options
    progressSelect.innerHTML = '';

    // Add progress options
    progressOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.name;
        optionElement.textContent = option.name;
        optionElement.style.backgroundColor = option.color;
        progressSelect.appendChild(optionElement);
    });

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    document.getElementById('dueDate').value = today;

    // Show modal
    taskFormModal.style.display = 'flex';
    taskForm.dataset.taskGroupId = taskGroupId;
}

function saveTask() {
    const taskForm = document.getElementById('taskForm');
    const taskName = document.getElementById('taskName').value;
    const startDate = document.getElementById('startDate').value;
    const dueDate = document.getElementById('dueDate').value;
    const progress = document.getElementById('progress').value;
    const taskGroupId = taskForm.dataset.taskGroupId;

    if (taskName && taskGroupId) {
        const project = window.projects.find(p => p.id === currentProjectId);
        const board = project?.boards.find(b => b.id === currentBoardId);
        const taskGroup = board?.taskGroups?.find(tg => tg.id === taskGroupId);
        if (taskGroup) {
            const newTask = {
                id: Date.now(),
                name: taskName,
                startDate,
                dueDate,
                progress,
                progressColor: progressOptions.find(opt => opt.name === progress)?.color || '#fff',
                files: ''
            };
            taskGroup.tasks = taskGroup.tasks || [];
            taskGroup.tasks.push(newTask);
            saveProjects();
            loadTaskGroups();
            closeModal('taskFormModal');
        }
    }
}

function addProgressOption() {
    const progressOptionsList = document.getElementById('progressOptionsList');
    const optionElement = document.createElement('div');
    optionElement.classList.add('progress-option');
    optionElement.innerHTML = `
        <input type="text" placeholder="Progress Name" required>
        <input type="color" value="#3498db">
    `;
    progressOptionsList.appendChild(optionElement);
}

function saveProgressOptions() {
    const progressOptionsList = document.getElementById('progressOptionsList');
    const options = Array.from(progressOptionsList.children).map(option => {
        const name = option.querySelector('input[type="text"]').value;
        const color = option.querySelector('input[type="color"]').value;
        return { name, color };
    });
    progressOptions = options;
    closeModal('progressOptionsModal');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
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
            loadProjects();
        }
    }
}

function selectProject(projectId) {
    console.log("Selected project ID:", projectId);
    currentProjectId = projectId;
    currentBoardId = null;
    currentTaskGroupId = null;
    loadProjects();
}

function selectBoard(projectId, boardId) {
    console.log("Selected board ID:", boardId);
    currentProjectId = projectId;
    currentBoardId = boardId;
    currentTaskGroupId = null;
    loadProjects();
}

function selectTaskGroup(boardId, taskGroupId) {
    console.log("Selected task group ID:", taskGroupId);
    currentBoardId = boardId;
    currentTaskGroupId = taskGroupId;
    loadTaskGroups();
}
