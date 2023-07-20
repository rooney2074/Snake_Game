const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX , foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let SetIntervalid;
let score = 0;

//getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0; 
highScoreElement.innerHTML = `High Score: ${highScore}`

const changeFoodPosition = () =>{
    foodX = Math.floor(Math.random() * 30 ) + 1;
    foodY = Math.floor(Math.random() * 30 ) + 1;
}

const handleGameOver = () => {
    //clearing timer and relaoding the game
    clearInterval(SetIntervalid);
    alert('Game Over! Press OK to replay')
    location.reload();
}

const changeDirection = (e) => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
});

const initGame = () =>{
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //checking if the snake hit the food
    if(snakeX == foodX && snakeY == foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);// pushing food position to snake body array
        score++;

        highScore= score >= highScore ? score: highScore;
        localStorage.setItem("high-score", highScore)

        scoreElement.innerHTML = `Score: ${score}`
    }

    for(let i = snakeBody.length - 1; i>0; i--){
        //shifting forward the vlaues of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX,snakeY]; //setting first element of snake body to current snake position

    //updating the snake's head position based in the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    //cheacking game over
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30 ){
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++){
        // adding a div for each part of the snake's body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //cheaking hte snake hit the body
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
SetIntervalid = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection)