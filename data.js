let projects = [];

// Example Project Structure
const exampleProject = {
    id: Date.now(),
    name: "Example Project",
    boards: [
        {
            id: Date.now(),
            name: "Production",
            columns: [
                { name: "Task", type: "text" },
                { name: "Progress", type: "dropdown", options: ["New", "In Progress", "Completed"] },
                { name: "Files", type: "file" }
            ],
            tasks: []
        }
    ]
};

projects.push(exampleProject);