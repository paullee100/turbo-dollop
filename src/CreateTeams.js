const inputName = document.getElementById("input-name"),
      nameContainer = document.getElementById("name-container")

const participants = [];      
function enterName() {
    if (inputName.value == '') {
        alert("Name cannot be blanked!");
        return;
    }

    participants.push(inputName.value + "\n");
    inputName.value = '';

    nameContainer.textContent = participants.join("");
}

function enterInput(inputField, e) {
    if (e.key === "Enter") {

        switch(inputField.id) {

            case "input-name":
                enterName();
                break;
            case "input-number-of-teams":
                createTeams();
                break;
            default:
                alert("An unknown error has occurred!");
        }
    }
}

function createTeams() {
    const inputNumberOfTeams = document.getElementById("input-number-of-teams")
    const numberOfTeams = inputNumberOfTeams.value;

    if (numberOfTeams <= 1) {
        alert("Number of teams cannot be less than or equal to 1");
        return;
    }

    let everyName = nameContainer.textContent.split("\n");
    everyName = everyName.filter(name => name.trim().length > 0);

    const teams = []
    for (let i = 0; i < numberOfTeams; i++) {
        teams.push([]);
    }

    while (everyName.length >= numberOfTeams) {
        for (let i = 0; i < numberOfTeams; i++) {
            teams[i].push(everyName.splice(Math.floor(Math.random() * everyName.length), 1)[0])
        }
    }

    visited = []
    for (let i = 0; i < everyName.length; i++) {

        let index = Math.floor(Math.random() * teams.length);
        while (visited.includes(index)) {
            index = Math.floor(Math.random() * teams.length);
        }
        visited.push(index);
        teams[index].push(everyName[i]);
    }

    const tableContainer = document.getElementById("table-container");
    const table = document.createElement("table");

    if (tableContainer.hasChildNodes) {
        clearTable();
    }

    // Create a table header
    const headerRow = table.insertRow();
    for (let i = 0; i < numberOfTeams; i++) {
        const teamName = document.createElement("input");
        teamName.addEventListener("keydown", (e) => inputTeamName(teamName, e))
        const th = document.createElement("th");
        th.appendChild(teamName);
        headerRow.appendChild(th);
    }

    const row = table.insertRow();
    for (let i = 0; i < numberOfTeams; i++) {
        const cell = row.insertCell();
        const ul = document.createElement('ul');
        for (let j = 0; j < teams[i].length; j++) {
            const li = document.createElement('li');
            li.textContent = teams[i][j];
            ul.appendChild(li);
        }
        cell.appendChild(ul);
        
    }

    tableContainer.appendChild(table);
    console.log(tableContainer.getBoundingClientRect().width);

}

console.log(window.innerWidth);

function inputTeamName(inputName, e) {
    console.log(inputName);
    if (e.key === "Enter") {
        inputName.style.background = "transparent";
    }
}

function clearTable() {
    const tableContainer = document.getElementById("table-container");
    tableContainer.removeChild(tableContainer.firstChild);
}