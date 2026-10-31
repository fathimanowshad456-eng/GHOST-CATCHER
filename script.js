let score = 0;
let timeLeft = 30;
let bestScore = Number(localStorage.getItem("ghostBest")) || 0;

let gameRunning = false;
let timerInterval;
let spawnInterval;

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const bestDisplay = document.getElementById("best");
const message = document.getElementById("message");
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-btn");

bestDisplay.textContent = bestScore;

function startGame() {

    if (gameRunning) return;

    score = 0;
    timeLeft = 30;
    gameRunning = true;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    message.textContent = "The ghosts are coming... Catch them!";

    startButton.disabled = true;
    startButton.textContent = "HUNT IN PROGRESS...";

    gameArea.querySelectorAll(".target").forEach(target => {
        target.remove();
    });

    spawnTarget();

    spawnInterval = setInterval(spawnTarget, 750);

    timerInterval = setInterval(() => {

        timeLeft--;

        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }

    }, 1000);
}

function spawnTarget() {

    if (!gameRunning) return;

    const target = document.createElement("button");

    target.className = "target";

    const isPumpkin = Math.random() < 0.25;

    target.textContent = isPumpkin ? "🎃" : "👻";

    target.setAttribute(
        "aria-label",
        isPumpkin ? "Cursed pumpkin" : "Ghost"
    );

    const maxX = gameArea.clientWidth - 70;
    const maxY = gameArea.clientHeight - 95;

    target.style.left = Math.max(5, Math.random() * maxX) + "px";

    target.style.top = Math.max(5, Math.random() * maxY) + "px";

    target.addEventListener("click", () => {

        if (!gameRunning) return;

        if (isPumpkin) {

            score = Math.max(0, score - 2);

            message.textContent = "Cursed pumpkin! -2 points!";

        } else {

            score++;

            message.textContent = "Ghost caught! +1 point!";

        }

        scoreDisplay.textContent = score;

        target.remove();

    });

    gameArea.appendChild(target);

    setTimeout(() => {
        target.remove();
    }, 1400);
}

function endGame() {

    gameRunning = false;

    clearInterval(timerInterval);
    clearInterval(spawnInterval);

    gameArea.querySelectorAll(".target").forEach(target => {
        target.remove();
    });

    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem("ghostBest", bestScore);

        bestDisplay.textContent = bestScore;

        message.textContent = "New high score! You survived the hunt!";

    } else {

        message.textContent = "The midnight hunt is over!";

    }

    timeDisplay.textContent = 0;

    startButton.disabled = false;

    startButton.textContent = "PLAY AGAIN";
}

startButton.addEventListener("click", startGame);