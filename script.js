let currentProjectId = null;

function loadProjects() {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = projects.map(project => `
        <li class="project-item" onclick="selectProject(${project.id})">
            ${project.name}
            <ul class="board-list" id="boards-${project.id}">
                ${project.boards.map(board => `
                    <li class="board-item" onclick="selectBoard(event, ${project.id}, ${board.id})">${board.name}
                        <ul class="task-list" id="tasks-${board.id}"></ul>
                    </li>
                `).join('')}
            </ul>
            <button class="add-board-btn" onclick="addBoard(${project.id})">+ Add Board</button>
        </li>
    `).join('');
}

function selectProject(projectId) {
    currentProjectId = projectId;
    document.querySelectorAll('.project-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`li[onclick='selectProject(${projectId})']`).classList.add('active');
    loadBoards(projects.find(p => p.id == projectId).boards, projectId);
}

function addProject() {
    const projectName = prompt("Enter project name:");
    if (projectName) {
        const newProject = { id: Date.now(), name: projectName, boards: [{ id: Date.now(), name: "Board 1", tasks: [] }] };
        projects.push(newProject);
        loadProjects();
    }
}

function loadBoards(boards, projectId) {
    const boardsContainer = document.getElementById(`boards-${projectId}`);
    boardsContainer.innerHTML = boards.map(board => `
        <li class="board-item" onclick="selectBoard(event, ${projectId}, ${board.id})">
            ${board.name}
            <ul class="task-list" id="tasks-${board.id}"></ul>
        </li>
    `).join('');
}

function addBoard(projectId) {
    const boardName = prompt("Enter board name:");
    if (boardName) {
        const project = projects.find(p => p.id == projectId);
        project.boards.push({ id: Date.now(), name: boardName, tasks: [] });
        loadBoards(project.boards, projectId);
    }
}

function loadTasks(tasks, boardId) {
    const tasksContainer = document.getElementById(`tasks-${boardId}`);
    tasksContainer.innerHTML = tasks.map(task => `
        <li>${task.name}</li>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadProjects);
