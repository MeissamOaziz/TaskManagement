let currentProjectId = null;
let currentBoardId = null;
let currentTaskGroupId = null;
let progressOptions = [
    { name: "New", color: "#3498db" },
    { name: "In Progress", color: "#f1c40f" },
    { name: "Completed", color: "#2ecc71" }
];

// Initialize projects from localStorage
if (!window.projects) {
    try {
        window.projects = JSON.parse(localStorage.getItem('projects')) || [];
    } catch (error) {
        console.error("Error loading projects from localStorage:", error);
        window.projects = [];
    }
}

// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Script loaded successfully");

    // Get buttons and modals
    const addProjectBtn = document.getElementById('addProjectBtn');
    const addTaskGroupBtn = document.getElementById('addTaskGroupBtn');
    const taskFormModal = document.getElementById('taskFormModal');
    const progressOptionsModal = document.getElementById('progressOptionsModal');

    // Attach event listeners
    if (addProjectBtn) addProjectBtn.addEventListener('click', addProject);
    if (addTaskGroupBtn) addTaskGroupBtn.addEventListener('click', () => {
        if (currentBoardId) {
            addTaskGroup(currentBoardId);
        } else {
            alert("Please select a board first.");
        }
    });

    // Event delegation for dynamically added elements
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-task-btn')) {
            openTaskFormModal(event.target.dataset.taskGroupId);
        }
    });

    // Close modals when clicking the close button
    document.querySelectorAll('.modal .close').forEach(button => {
        button.addEventListener('click', () => {
            closeModal('taskFormModal');
            closeModal('progressOptionsModal');
        });
    });

    // Load projects into the UI
    loadProjects();
});

// Save projects to localStorage
function saveProjects() {
    try {
        localStorage.setItem('projects', JSON.stringify(window.projects));
    } catch (error) {
        console.error("Error saving projects to localStorage:", error);
    }
}

// Load projects into the UI
function loadProjects() {
    console.log("Loading projects...");
    const projectList = document.getElementById('projectList');
    if (!projectList) return;

    projectList.innerHTML = '';
    window.projects.forEach(project => {
        const projectItem = document.createElement('li');
        projectItem.classList.add('project-item');
        projectItem.textContent = project.name;
        projectItem.onclick = () => selectProject(project.id);

        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = (event) => {
            event.stopPropagation();
            deleteProject(project.id);
        };
        projectItem.appendChild(deleteBtn);

        // Add board button
        const addBoardBtn = document.createElement('button');
        addBoardBtn.textContent = '+ Add Board';
        addBoardBtn.classList.add('add-btn');
        addBoardBtn.onclick = (event) => {
            event.stopPropagation();
            addBoard(project.id);
        };
        projectItem.appendChild(addBoardBtn);

        // Add board list
        const boardList = document.createElement('ul');
        boardList.classList.add('board-list');
        boardList.id = `boards-${project.id}`;
        projectItem.appendChild(boardList);

        projectList.appendChild(projectItem);
    });
    saveProjects();
}

// Delete a project
function deleteProject(projectId) {
    window.projects = window.projects.filter(p => p.id !== projectId);
    saveProjects();
    loadProjects();
}

// Add a new project
function addProject() {
    console.log("Adding a new project...");
    const projectName = prompt("Enter project name:");
    if (projectName) {
        const newProject = { id: Date.now(), name: projectName, boards: [] };
        window.projects.push(newProject);
        saveProjects();
        loadProjects();
    } else {
        console.log("Project creation cancelled or invalid name.");
    }
}

// Add a new board to a project
function addBoard(projectId) {
    console.log("Adding a new board...");
    const boardName = prompt("Enter board name:");
    if (boardName) {
        const project = window.projects.find(p => p.id == projectId);
        if (project) {
            const newBoard = { id: Date.now(), name: boardName, taskGroups: [] };
            project.boards.push(newBoard);
            saveProjects();
            loadBoards(projectId); // Refresh the boards UI
        }
    }
}

// Load boards for a selected project
function loadBoards(projectId) {
    console.log("Loading boards for project:", projectId);
    const project = window.projects.find(p => p.id === projectId);
    if (project) {
        const boardList = document.getElementById(`boards-${projectId}`);
        if (boardList) {
            boardList.innerHTML = ''; // Clear the existing list
            project.boards.forEach(board => {
                const boardItem = document.createElement('li');
                boardItem.classList.add('board-item');
                boardItem.textContent = board.name;
                boardItem.onclick = () => selectBoard(board.id);
                boardList.appendChild(boardItem);
            });
        }
    }
}

// Select a project
function selectProject(projectId) {
    currentProjectId = projectId; // Set the current project ID
    const selectedProject = window.projects.find(p => p.id === projectId);
    if (selectedProject) {
        document.getElementById('selectedProjectName').textContent = selectedProject.name;
        loadBoards(projectId); // Load boards for the selected project
    }
}

// Select a board
function selectBoard(boardId) {
    currentBoardId = boardId;
    loadTaskGroups(boardId);
}

// Load task groups for a selected board
function loadTaskGroups(boardId) {
    const taskGroupSection = document.getElementById('taskGroupSection');
    if (taskGroupSection) {
        taskGroupSection.innerHTML = '';
        const board = window.projects
            .find(p => p.id === currentProjectId)
            ?.boards.find(b => b.id === boardId);
        if (board) {
            board.taskGroups.forEach(taskGroup => {
                const taskGroupDiv = document.createElement('div');
                taskGroupDiv.classList.add('task-group');
                taskGroupDiv.innerHTML = `
                    <h3>${taskGroup.name}</h3>
                    <button class="add-task-btn" data-task-group-id="${taskGroup.id}">+ Add Task</button>
                    <ul class="task-list"></ul>
                `;
                taskGroupSection.appendChild(taskGroupDiv);
                loadTasks(taskGroup.id, taskGroupDiv.querySelector('.task-list'));
            });
        }
    }
}

// Load tasks for a selected task group
function loadTasks(taskGroupId, taskListElement) {
    const taskGroup = window.projects
        .find(p => p.id === currentProjectId)
        ?.boards.find(b => b.id === currentBoardId)
        ?.taskGroups.find(tg => tg.id === taskGroupId);
    if (taskGroup && taskListElement) {
        taskListElement.innerHTML = '';
        taskGroup.tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.textContent = task.name;
            taskListElement.appendChild(taskItem);
        });
    }
}

// Open the task form modal
function openTaskFormModal(taskGroupId) {
    const taskFormModal = document.getElementById('taskFormModal');
    const taskForm = document.getElementById('taskForm');
    taskForm.dataset.taskGroupId = taskGroupId;
    taskFormModal.style.display = 'flex';
}

// Save a new task
function saveTask(event) {
    event.preventDefault(); // Prevent form submission
    const taskForm = document.getElementById('taskForm');
    const taskName = document.getElementById('taskName').value.trim();
    const startDate = document.getElementById('startDate').value;
    const dueDate = document.getElementById('dueDate').value;
    const progress = document.getElementById('progress').value;
    const taskGroupId = taskForm.dataset.taskGroupId;

    if (!taskName || !startDate || !dueDate || !progress) {
        alert("Please fill out all fields.");
        return;
    }

    const project = window.projects.find(p => p.id === currentProjectId);
    const board = project?.boards.find(b => b.id === currentBoardId);
    const taskGroup = board?.taskGroups?.find(tg => tg.id == taskGroupId);
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
        loadTaskGroups(currentBoardId); // Refresh the task groups UI
        closeModal('taskFormModal');
    }
}

// Close a modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
