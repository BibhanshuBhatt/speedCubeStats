let timerInterval;
let isRunning = false;
let startTime = 0;
let solveTimes = [];
const timerElement = document.getElementById("timer");
const avg5Element = document.getElementById("avg5");
const avg10Element = document.getElementById("avg10");
const bestTimeElement = document.getElementById("bestTime");
const worstTimeElement = document.getElementById("worstTime");
const comparisonElement = document.getElementById("comparison");
const solveTable = document.getElementById("solveTable");
const circularClock = document.getElementById("circularClock");
function saveAllSolves() {
    // Assuming solveTimes is an array of solve times
    fetch('/api/solves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solveTimes)  // Sending array of solve objects
    })
        .then(response => response.json())
        .then(data => console.log('Successfully saved:', data))
        .catch(error => console.error('Error saving solves:', error));
}
function startStopTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        const endTime = Date.now();
        const solveTime = ((endTime - startTime) / 1000).toFixed(2);
        timerElement.textContent = solveTime;
        document.body.classList.remove("glowing");
    } else {
        startTime = Date.now();
        isRunning = true;
        timerInterval = setInterval(() => {
            const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
            timerElement.textContent = elapsedTime;
            circularClock.style.background = `conic-gradient(#58a6ff 0%, #333 ${elapsedTime * 2}%, #333 100%)`;
            document.body.classList.add("glowing");
        }, 10);
    }
}

function saveSolve() {
    if (isRunning) return alert("Stop the timer first!");
    const solveTime = parseFloat(timerElement.textContent);
    solveTimes.push(solveTime);
    updateStats();
    updateTable();
}

function deleteLastSolve() {
    if (solveTimes.length === 0) {
        return alert("No solves to delete!");
    }
    solveTimes.pop();
    updateStats();
    updateTable();
}

function updateStats() {
    const last5 = solveTimes.slice(-5);
    const last10 = solveTimes.slice(-10);

    const avg5 = last5.length > 0 ? (last5.reduce((a, b) => a + b, 0) / last5.length).toFixed(2) : "-";
    const avg10 = last10.length > 0 ? (last10.reduce((a, b) => a + b, 0) / last10.length).toFixed(2) : "-";
    const bestTime = Math.min(...solveTimes);
    const worstTime = Math.max(...solveTimes);

    avg5Element.textContent = avg5;
    avg10Element.textContent = avg10;
    bestTimeElement.textContent = bestTime.toFixed(2);
    worstTimeElement.textContent = worstTime.toFixed(2);

    const lastSolve = solveTimes[solveTimes.length - 1];
    const prevSolve = solveTimes.length > 1 ? solveTimes[solveTimes.length - 2] : null;

    if (prevSolve) {
        if (lastSolve < prevSolve) {
            comparisonElement.textContent = "Faster than previous solve!";
        } else if (lastSolve > prevSolve) {
            comparisonElement.textContent = "Slower than previous solve!";
        } else {
            comparisonElement.textContent = "Same as previous solve!";
        }
    } else {
        comparisonElement.textContent = "-";
    }
}
function saveSolve() {
    if (isRunning) return alert("Stop the timer first!");
    const solveTime = parseFloat(timerElement.textContent);

    console.log('Sending solve time:', solveTime); // Debug log

    fetch('http://localhost:8080/api/solves', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            time: solveTime,
            timestamp: new Date().toISOString()
        })
    })
        .then(response => {
            console.log('Response:', response); // Debug log
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data); // Debug log
            solveTimes.push(solveTime);
            updateStats();
            updateTable();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save solve time');
        });
}
// Get solve by ID
function getSolveById(id) {
    fetch(`http://localhost:8080/api/solves/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Solve not found');
            }
            return response.json();
        })
        .then(data => {
            console.log('Solve:', data);
            // Handle the data as needed
        })
        .catch(error => console.error('Error:', error));
}

// Get today's solves
function getTodaysSolves() {
    fetch('http://localhost:8080/api/solves/today')
        .then(response => response.json())
        .then(data => {
            console.log('Today\'s solves:', data);
            // Update your UI with today's solves
            solveTimes = data.map(solve => solve.time);
            updateStats();
            updateTable();
        })
        .catch(error => console.error('Error:', error));
}

// Call this when page loads to show today's solves
document.addEventListener('DOMContentLoaded', getTodaysSolves);
function updateTable() {
    solveTable.innerHTML = solveTimes
        .map((time, index) => `<tr><td>${index + 1}</td><td>${time.toFixed(2)}</td></tr>`)
        .join("");
}
// Scramble generator function
function generateScramble() {
    const moves = ['L', 'L\'', 'R', 'R\'', 'U', 'U\'', 'D', 'D\'', 'B', 'B\'', 'F', 'F\'', '2L', '2R', '2U', '2B', '2D'];
    let scramble = [];
    let lastMove = '';

    while (scramble.length < 12) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        // Avoid repeating the same face
        if (!lastMove.includes(move[0])) {
            scramble.push(move);
            lastMove = move;
        }
    }

    return scramble.join(' ');
}

// Update the timer display to show scramble

function updateScrambleDisplay() {
    const scramble = generateScramble();
    document.getElementById('scrambleDisplay').textContent = scramble;
    return scramble;
}

// Modified saveSolve function to include scramble
function saveSolve() {
    if (isRunning) {
        alert("Stop the timer first!");
        return;
    }

    const solveTime = parseFloat(document.getElementById('timer').textContent);
    const currentScramble = document.getElementById('scrambleDisplay').textContent;

    fetch('http://localhost:8080/api/solves', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            time: solveTime,
            scramble: currentScramble,
            timestamp: new Date().toISOString()
        })
    })
        .then(response => response.json())
        .then(data => {
            solveTimes.push(solveTime);
            updateStats();
            updateTable();
            updateScrambleDisplay(); // Generate new scramble after saving
        })
        .catch(error => console.error('Error:', error));
}

// Modified delete function to remove from database
function deleteLastSolve() {
    if (solveTimes.length === 0) {
        alert("No solves to delete!");
        return;
    }

    const lastSolveId = document.querySelector('#solveTable tr:last-child').dataset.solveId;

    fetch(`http://localhost:8080/api/solves/${lastSolveId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                solveTimes.pop();
                updateStats();
                updateTable();
            }
        })
        .catch(error => console.error('Error:', error));
}
// Initialize when document loads
document.addEventListener('DOMContentLoaded', function() {
    updateScrambleDisplay();
    getTodaysSolves();
});

// Update the timer reset
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    document.getElementById('timer').textContent = '0.00';
    updateScrambleDisplay();
}

// Update the keydown handler
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
        if (!isRunning) {
            // Starting new solve
            startStopTimer();
        } else {
            // Stopping the solve
            startStopTimer();
            // Don't generate new scramble until solve is saved
        }
    } else if (event.key === "s" || event.key === "S") {
        saveSolve();
        // New scramble is generated in saveSolve function
    } else if (event.key === "d" || event.key === "D") {
        deleteLastSolve();
    }
});

// Update the updateTable function to include scrambles
function updateTable() {
    const tableBody = document.getElementById('solveTable');
    tableBody.innerHTML = solveTimes.map((solve, index) => {
        const prevTime = index > 0 ? solveTimes[index - 1] : null;
        let comparison = '';
        if (prevTime !== null) {
            if (solve.time < prevTime) {
                comparison = '<span style="color: green">Faster ▼</span>';
            } else if (solve.time > prevTime) {
                comparison = '<span style="color: red">Slower ▲</span>';
            } else {
                comparison = '<span style="color: gray">Same =</span>';
            }
        }
        return `
            <tr data-solve-id="${solve.id}">
                <td>${index + 1}</td>
                <td>${solve.time.toFixed(2)}</td>
                <td>${comparison}</td>
                <td class="scramble-cell">${solve.scramble}</td>
                <td>
                    <button onclick="deleteSolve(${solve.id})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}


// Add individual solve deletion function
function deleteSolve(id) {
    if (confirm('Are you sure you want to delete this solve?')) {
        fetch(`http://localhost:8080/api/solves/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    // Remove from local array
                    const index = solveTimes.findIndex(solve => solve.id === id);
                    if (index !== -1) {
                        solveTimes.splice(index, 1);
                        updateStats();
                        updateTable();
                    }
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
        startStopTimer();
    } else if (event.key === "s" || event.key === "S") {
        saveSolve();
    } else if (event.key === "d" || event.key === "D") {
        deleteLastSolve();
    }
});
