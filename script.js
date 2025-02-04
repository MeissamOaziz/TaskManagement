let currentProjectId = null;
let currentBoardId = null;
let currentTaskGroupId = null;
let progressOptions = [
    { name: "New", color: "#3498db" },
    { name: "In Progress", color: "#f1c40f" },
    { name: "Completed", color: "#2ecc71" }
];

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

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-task-btn')) {
            openTaskFormModal(event.target.dataset.taskGroupId);
        }
    });

    document.querySelectorAll('.modal .close').forEach(button => {
        button.addEventListener('click', () => {
            taskFormModal.style.display = 'none';
            progressOptionsModal.style.display = 'none';
        });
    });

    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            saveTask();
        });
    }

    if (addProgressOptionBtn) {
        addProgressOptionBtn.addEventListener('click', () => {
            addProgressOption();
        });
    }

    const progressOptionsForm = document.getElementById('progressOptionsForm');
    if (progressOptionsForm) {
        progressOptionsForm.addEventListener('submit', (event) => {
            event.preventDefault();
            saveProgressOptions();
        });
    }

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
        if (project.id === currentProjectId) {
            projectItem.classList.add('active');
        }
        projectList.appendChild(projectItem);
    });
    saveProjects();
}

function openTaskFormModal(taskGroupId) {
    const taskFormModal = document.getElementById('taskFormModal');
    const taskForm = document.getElementById('taskForm');
    const progressSelect = document.getElementById('progress');

    progressSelect.innerHTML = '';
    progressOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.name;
        optionElement.textContent = option.name;
        optionElement.style.backgroundColor = option.color;
        progressSelect.appendChild(optionElement);
    });

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    document.getElementById('dueDate').value = today;

    taskForm.dataset.taskGroupId = taskGroupId;
    taskFormModal.style.display = 'flex';
}

function saveTask() {
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
        loadProjects();
        closeModal('taskFormModal');
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
