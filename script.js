let currentProjectId = null;

function loadProjects() {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = projects.map(project => `
        <li class="project-item" onclick="selectProject(${project.id})" onmouseover="hoverProject(this)" onmouseout="unhoverProject(this)">
            <span ondblclick="editProject(${project.id})">${project.name}</span>
            <ul class="board-list" id="boards-${project.id}">
                ${project.boards.map(board => `
                    <li class="board-item" onclick="selectBoard(event, ${project.id}, ${board.id})" onmouseover="hoverBoard(this)" onmouseout="unhoverBoard(this)">
                        <span ondblclick="editBoard(${project.id}, ${board.id})">${board.name}</span>
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
    document.getElementById('selectedProjectName').textContent = projects.find(p => p.id == projectId).name;
}

function editProject(projectId) {
    const project = projects.find(p => p.id == projectId);
    const newName = prompt("Enter new project name:", project.name);
    if (newName) {
        project.name = newName;
        loadProjects();
    }
}

function editBoard(projectId, boardId) {
    const project = projects.find(p => p.id == projectId);
    const board = project.boards.find(b => b.id == boardId);
    const newName = prompt("Enter new board name:", board.name);
    if (newName) {
        board.name = newName;
        loadBoards(project.boards, projectId);
    }
}

function hoverProject(element) {
    element.style.background = "#1abc9c";
}

function unhoverProject(element) {
    element.style.background = "#34495e";
}

function hoverBoard(element) {
    element.style.background = "#3b8bd5";
}

function unhoverBoard(element) {
    element.style.background = "#3b5998";
}

function loadBoards(boards, projectId) {
    const boardsContainer = document.getElementById(`boards-${projectId}`);
    boardsContainer.innerHTML = boards.map(board => `
        <li class="board-item" onclick="selectBoard(event, ${projectId}, ${board.id})" onmouseover="hoverBoard(this)" onmouseout="unhoverBoard(this)">
            <span ondblclick="editBoard(${projectId}, ${board.id})">${board.name}</span>
            <ul class="task-list" id="tasks-${board.id}"></ul>
        </li>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadProjects);
