const grid = document.querySelector(".grid")

const scoreDisplay = document.getElementById('score')
const highscoreDisplay = document.getElementById('highscore')
const gameOverDisplay = document.getElementById('end')

const startButton = document.getElementById('start')

let squares = []
let currentSnake = [36,35,34]
let fireIndex = 0
let score = 0
let highscore = JSON.parse(localStorage.getItem('highscore'))
let direction = 1
let timerId = 0
let intervalTime = 1000
const width = 10


function createGrid() {
    for (let i = 0; i < 100; i++) {
        const square = document.createElement('div')
        square.classList.add('square')
        grid.appendChild(square)
        squares.push(square)
        highscoreDisplay.textContent = highscore
        scoreDisplay.textContent = score
    }
}
createGrid()

function startGame() {
    highscoreDisplay.textContent = highscore
    gameOverDisplay.classList.remove('show')
    squares[currentSnake[0]].innerText = ''
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    squares[fireIndex].classList.remove('fire')
    squares[fireIndex].innerText = ''
    clearInterval(timerId)
    currentSnake = [36,35,34]
    score = 0
    scoreDisplay.textContent = score
    direction = 1
    intervalTime = 1000
    generateFire()
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    squares[currentSnake[0]].innerText = '🐲'
    timerId = setInterval(move, intervalTime)
}

function generateFire() {
    do {
       fireIndex = Math.floor(Math.random() * squares.length)
    } while (squares[fireIndex].classList.contains('snake'))
    squares[fireIndex].innerText = '🔥'
    squares[fireIndex].classList.add('fire')
}

function move() {
    if (
        (currentSnake[0] + width >= width*width && direction == width) ||
        (currentSnake[0] % width === width-1 && direction === 1) ||
        (currentSnake[0] % width === 0 && direction === -1) ||
        (currentSnake[0] - width < 0 && direction === -width) ||
        (squares[currentSnake[0] + direction].classList.contains('snake'))
    )
    return gameOver()

    const tail = currentSnake.pop()
    squares[tail].classList.remove('snake')
    squares[currentSnake[0]].innerText = ''
    currentSnake.unshift(currentSnake[0] + direction)
    squares[currentSnake[0]].classList.add('snake')
    squares[currentSnake[0]].innerText = '🐲'

    if (squares[currentSnake[0]].classList.contains('fire')) {
        squares[currentSnake[0]].classList.remove('fire')
        squares[tail].classList.add('snake')
        currentSnake.push(tail)
        generateFire()
        score++
        scoreDisplay.textContent = score
        clearInterval(timerId)
        intervalTime = intervalTime * 0.9
        timerId = setInterval(move, intervalTime)
    }
}

function control(event) {
    if (event.code === "ArrowRight") {
        direction = 1
    } else if (event.code === "ArrowUp") {
        direction = -width
    } else if (event.code === "ArrowLeft") {
        direction = -1
    } else if (event.code === "ArrowDown") {
        direction = width
    }
}

function gameOver() {
    clearInterval(timerId)
    gameOverDisplay.classList.add('show')
    if (score > highscore) {
       localStorage.setItem('highscore', JSON.stringify(score))
    }
}



document.addEventListener('keyup', control)

startButton.addEventListener('click', startGame)

window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
},false );