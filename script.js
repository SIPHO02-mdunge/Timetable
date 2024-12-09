document.addEventListener("DOMContentLoaded", () => {
    const timeSlotSelect = document.getElementById("time-slot");
    const timetable = document.getElementById("timetable").getElementsByTagName("tbody")[0];
    const undoButton = document.getElementById("undo-button");
    let lastAction = null; // To track the last added entry

    // Generate time slots starting from 08:45 in 45-minute intervals
    const startTime = new Date();
    startTime.setHours(8, 45, 0);
    for (let i = 0; i < 10; i++) {
        const endTime = new Date(startTime.getTime() + 45 * 60 * 1000);
        const slot = `${formatTime(startTime)} - ${formatTime(endTime)}`;
        const option = document.createElement("option");
        option.value = slot;
        option.textContent = slot;
        timeSlotSelect.appendChild(option);
        startTime.setTime(endTime.getTime());
    }

    // Generate timetable rows
    for (let i = 0; i < timeSlotSelect.length; i++) {
        const row = timetable.insertRow();
        const timeCell = row.insertCell();
        timeCell.textContent = timeSlotSelect.options[i].value;
        for (let j = 0; j < 6; j++) {
            const cell = row.insertCell();
            cell.className = "timetable-cell";
        }
    }

    // Add entry to timetable
    document.getElementById("add-button").addEventListener("click", () => {
        const teacher = document.getElementById("teacher").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const className = document.getElementById("class").value.trim();
        const day = document.getElementById("day").selectedIndex;
        const timeSlot = document.getElementById("time-slot").selectedIndex;

        if (!teacher || !subject || !className) {
            alert("Please fill in all fields.");
            return;
        }

        const row = timetable.rows[timeSlot];
        const cell = row.cells[day + 1];

        // Create new entry
        const newEntry = document.createElement("div");
        newEntry.textContent = `${teacher} (${subject}, ${className})`;
        newEntry.style.marginBottom = "5px";

        // Add Edit Button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.style.marginLeft = "10px";
        editButton.addEventListener("click", () => editEntry(newEntry, teacher, subject, className, timeSlot, day));
        newEntry.appendChild(editButton);

        cell.appendChild(newEntry);

        // Store last action for undo
        lastAction = { cell, entry: newEntry };

        // Clear form inputs
        document.getElementById("teacher").value = "";
        document.getElementById("subject").value = "";
        document.getElementById("class").value = "";
    });

    // Undo last action
    undoButton.addEventListener("click", () => {
        if (lastAction) {
            lastAction.cell.removeChild(lastAction.entry);
            lastAction = null;
        } else {
            alert("No actions to undo.");
        }
    });

    // Edit entry
    function editEntry(entryElement, teacher, subject, className, timeSlot, day) {
        document.getElementById("teacher").value = teacher;
        document.getElementById("subject").value = subject;
        document.getElementById("class").value = className;
        document.getElementById("time-slot").selectedIndex = timeSlot;
        document.getElementById("day").selectedIndex = day;

        // Remove the current entry
        entryElement.parentNode.removeChild(entryElement);

        // Clear last action to avoid undo issues
        lastAction = null;
    }

    // Helper function to format time
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
});



