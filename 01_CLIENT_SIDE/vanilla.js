const container = document.querySelector(".container"),
    instruction = document.querySelector(".instruction"),
    btnInst = document.querySelectorAll(".btn-inst"),
    start = document.querySelector(".start"),
    setUsername = document.getElementById("username"),
    levels = document.querySelectorAll(".level div"),
    btnPlay = document.querySelector(".btn-play"),
    username = document.querySelector(".status .username"),
    timer = document.querySelector(".status .timer"),
    heartIndi = document.querySelectorAll(".heart-indi .img"),
    wallCount = document.querySelector(".wall"),
    tntCount = document.querySelector(".tnt"),
    iceCount = document.querySelector(".ice"),
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    countDown = document.querySelector(".countDown"),
    pause = document.querySelector(".pause"),
    gameOver = document.querySelector(".game-over"),
    usernameOver = document.querySelector(".username-over"),
    timerOver = document.querySelector(".timer-over"),
    wallOver = document.querySelector(".wall-over"),
    tntOver = document.querySelector(".tnt-over"),
    iceOver = document.querySelector(".ice-over"),
    btnSave = document.querySelector(".btn-save"),
    btnLead = document.querySelector(".btn-leaderboard"),
    allRole = document.querySelector(".all-role"),
    btnContinue = document.querySelector(".btn-continue"),
    btnRestart = document.querySelector(".btn-restart"),
    btnReset = document.querySelector(".btn-reset");

const gridWidth = 67;
const gridHeight = 67;
let grid = [],
    count = 3,
    countInterval = null,
    timerInterval = null,
    [gameStart, isPause, startCount] = [false, false, false],
    [times, min] = [0, 0],
    setMode = -1,
    loopId,
    keyUp,
    imageChar = [],
    [charSet, setItem, onLoad] = [
        [
            "./Images/char_right.png",
            "./Images/char_down.png",
            "./Images/char_left.png",
            "./Images/char_up.png",
        ],
        [
            "./Images/bomb.png",
            "./Images/heart.png",
            "./Images/ice.png",
            "./Images/tnt.png",
        ],
    ],
    setChar = 0;

levels.forEach((e, i) => {
    e.onclick = () => {
        setMode = i;
        levels.forEach((e) => e.classList.remove("active"));
        e.classList.add("active");

        if (setMode !== -1 && setUsername.value !== "") {
            btnPlay.onclick = playGame;
            btnPlay.style.backgroundColor = "#fab300";
            btnPlay.style.cursor = "pointer";
        }
    };
});

btnInst.forEach((e) => {
    e.onclick = function () {
        instruction.classList.toggle("active");
    };
});

btnContinue.onclick = () => {
    if (!startCount && isPause) {
        startCount = true;
    }
};

setUsername.addEventListener("input", function (e) {
    if (e.target.value === "") {
        btnPlay.onclick = null;
        btnPlay.style.backgroundColor = "#737373";
        btnPlay.style.cursor = "not-allowed";
    } else if (setMode !== -1 && setUsername.value !== "") {
        btnPlay.onclick = playGame;
        btnPlay.style.backgroundColor = "#fab300";
        btnPlay.style.cursor = "pointer";
    }
});

function playGame() {
    if (setUsername.value !== "" && setMode !== -1) {
        gameStart = true;
        startCount = true;
        start.style.display = "none";
        username.innerHTML = "Username: " + setUsername.value;
        timer.innerHTML = "Timer: 00:00";
        countDownStart(playing);
    }
}

function countDownStart(callback = null) {
    if (countInterval) return;

    count = 3;
    countDown.innerHTML = count;
    allRole.style.display = "flex";
    countDown.style.display = "flex";
    pause.style.display = "none";

    countInterval = setInterval(() => {
        count--;
        countDown.innerHTML = count;

        if (count <= 0) {
            clearInterval(countInterval);
            countInterval = null;
            count = 3;
            countDown.innerHTML = count;
            allRole.style.display = "none";
            countDown.style.display = "none";
            pause.style.display = "none";
            isPause = false;
            startCount = false;

            if (callback) {
                callback();
            }
        }
    }, 1000);
}

function playing() {
    if (gameStart) {
        let matrix = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 5, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 3, 2, 0, 4, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 6, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        const brokeHeart = 5;
        const tnts = 3;
        const ices = 4;
        const bomb = 6;

        const key = {
            w: 3,
            a: 2,
            s: 1,
            d: 0,
        };

        timerInterval = setInterval(() => {
            if (!isPause) {
                times++;
                if (times >= 59) {
                    min++;
                    times = 0;
                }
                timer.innerHTML =
                    "Timer: " +
                    (times < 59
                        ? times < 10
                            ? "00:0" + times
                            : "00:" + times
                        : "0" + min + ":" + times);
            }
        }, 1000);

        let whereChar = 0;
        let indexChar = 0;
        let whereWall = [];
        let indexWall = 0;

        let whereIce = 0;
        let indexIce = 0;

        let whereTnt = 0;
        let indexTnt = 0;

        let whereBomb = 0;
        let indexBomb = 0;

        let whereBroken = 0;
        let indexBroken = 0;

        matrix.forEach((e, q) => {
            if (matrix[q].indexOf(2) != -1) {
                whereChar = matrix[q].indexOf(2);
                indexChar = q;
            }

            if (matrix[q].indexOf(brokeHeart) != -1) {
                whereBroken = matrix[q].indexOf(brokeHeart);
                indexBroken = q;
            }

            if (matrix[q].indexOf(tnts) != -1) {
                whereTnt = matrix[q].indexOf(tnts);
                indexTnt = q;
            }

            if (matrix[q].indexOf(ices) != -1) {
                whereIce = matrix[q].indexOf(ices);
                indexIce = q;
            }

            if (matrix[q].indexOf(bomb) != -1) {
                whereBomb = matrix[q].indexOf(bomb);
                indexBomb = q;
            }
        });

        keyUp = function (e) {
            if (e.key === "w") {
                e.preventDefault();
                onLoad = imageChar[key["w"]];
                setChar = 3;
                if (matrix[indexChar - 1][whereChar] === 1) {
                    indexChar = indexChar;
                } else if (
                    matrix[indexChar - 1][whereChar] <= 1 ||
                    matrix[indexChar - 1][whereChar] >= 1
                ) {
                    matrix[indexChar][whereChar] = 0;
                    indexChar--;
                }
            } else if (e.key === "a") {
                e.preventDefault();
                onLoad = imageChar[key["a"]];
                setChar = 2;
                if (matrix[indexChar][whereChar - 1] === 1) {
                    whereChar = whereChar;
                } else if (
                    matrix[indexChar][whereChar - 1] <= 1 ||
                    matrix[indexChar][whereChar - 1] >= 1
                ) {
                    matrix[indexChar][whereChar] = 0;
                    whereChar--;
                }
            } else if (e.key === "s") {
                e.preventDefault();
                onLoad = imageChar[key["s"]];
                setChar = 1;
                if (matrix[indexChar + 1][whereChar] === 1) {
                    indexChar = indexChar;
                } else if (
                    matrix[indexChar + 1][whereChar] <= 1 ||
                    matrix[indexChar + 1][whereChar] >= 1
                ) {
                    matrix[indexChar][whereChar] = 0;
                    indexChar++;
                }
            } else if (e.key === "d") {
                e.preventDefault();
                setChar = 0;
                onLoad = imageChar[key["d"]];
                if (matrix[indexChar][whereChar + 1] === 1) {
                    whereChar = whereChar;
                } else if (
                    matrix[indexChar][whereChar + 1] <= 1 ||
                    matrix[indexChar][whereChar + 1] >= 1
                ) {
                    matrix[indexChar][whereChar] = 0;
                    whereChar++;
                }
            }

            if (e.key === "Escape" && !isPause && !startCount) {
                isPause = true;
                allRole.style.display = "flex";
                countDown.style.display = "none";
                pause.style.display = "flex";
            } else if (e.key === "Escape" && isPause && !startCount) {
                startCount = true;
            }
        };

        document.addEventListener("keyup", keyUp);
        let char = document.querySelector(".char");
        let iceItem = document.querySelector(".ice-items");
        let tntItem = document.querySelector(".tnt-items");
        let heartItem = document.querySelector(".heart-items");
        let bombItem = document.querySelector(".bomb-items");

        const draw = () => {
            let posChar = {
                x: whereChar * gridWidth,
                y: indexChar * gridHeight,
            };

            let posHeart = {
                x: whereBroken * gridWidth,
                y: indexBroken * gridHeight,
            };

            let posIce = {
                x: whereIce * gridWidth,
                y: indexIce * gridHeight,
            };

            let posTnt = {
                x: whereTnt * gridWidth,
                y: indexTnt * gridHeight,
            };

            let posBomb = {
                x: whereBomb * gridWidth,
                y: indexBomb * gridHeight,
            };

            char.querySelector(".char-img").src = charSet[setChar];
            iceItem.querySelector("img").src = setItem[2];
            tntItem.querySelector("img").src = setItem[3];
            heartItem.querySelector("img").src = setItem[1];
            bombItem.querySelector("img").src = setItem[0];

            char.style.top = posChar.y + "px";
            char.style.left = posChar.x + "px";

            heartItem.style.top = posHeart.y + "px";
            heartItem.style.left = posHeart.x + "px";

            iceItem.style.top = posIce.y + "px";
            iceItem.style.left = posIce.x + "px";

            tntItem.style.top = posTnt.y + "px";
            tntItem.style.left = posTnt.x + "px";

            bombItem.style.top = posBomb.y + "px";
            bombItem.style.left = posBomb.x + "px";
        };

        function loop() {
            loopId = requestAnimationFrame(loop);

            if (startCount) {
                countDownStart();
                return;
            }

            if (!isPause) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                draw();
            }
        }

        loop();
    }
}
