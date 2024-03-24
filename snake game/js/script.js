// Game constants and variables.

// value of movedInDir tells how much snake has moved in x and y direction.
//initially snake is not moving.
let movedInDir = {
    x: 0,
    y: 0,
};
const food_sound = new Audio('music/food.mp3');
const gameover_sound = new Audio('music/gameover.mp3');
const move_sound = new Audio('music/move.mp3');
const music_sound = new Audio('music/backmusic2.mp3');

//lastPaintTime is the time when screen was last painted.
let lastPaintTime = 0;
let speed = 8;
let score = 0;
let foodOnBody = true;

//contains snake head and body as objects.
let snakeArr = [
    { x: 5, y: 8 }
];

//snake food.
let food = { x: 13, y: 15 };



//Game functions.

//ctime property returns the time when the file was last modified.
//here , ctime returns the timestamp when the main() function is called.

//main() is a game loop.

//window.requestAnimationFrame() is used when we want to display an animation.
//It tells the browser to call a specified function (which is passed to it as an argument) to perform an animation before the repaint.
//It calls a function only one time.

function main(ctime) {
    window.requestAnimationFrame(main);

    // console.log(ctime);
    //controlling time after which screen should be painted ( controlling fps ).
    if (((ctime - lastPaintTime) / 1000) < (1 / speed)) {
        return;
    }
    else {
        lastPaintTime = ctime;
        // console.log(lastPaintTime);
    }
    gameEngine();
};

// checking collision of snake.
function iscollide(snakeArr) {

    //snake colliding with itself.
    for (i = 1; i < snakeArr.length; i++) {
        if ((snakeArr[0].x === snakeArr[i].x) && (snakeArr[0].y === snakeArr[i].y))
            return true;
    }

    //snake colliding with any wall.
    if ((snakeArr[0].x <= 0) || (snakeArr[0].x >= 18) || (snakeArr[0].y <= 0) || (snakeArr[0].y >= 18)) {
        return true;
    }
    return false;
};

function gameEngine() {
    //Part 1 : Updating the snake array and food.

    if (iscollide(snakeArr)) {
        gameover_sound.play();
        music_sound.pause();
        movedInDir = {
            x: 0,
            y: 0,
        };
        alert('Game over.Press any key to play again!');
        music_sound.play();
        snakeArr = [
            { x: 5, y: 8 }
        ];
        score = 0;
        scoreCount.innerHTML = 'Score : ' + score;
    };

    // if snake has eaten the food , then increment the score and regenerate the food.
    //condition of food eaten by snake.
    if ((snakeArr[0].x === food.x) && (snakeArr[0].y === food.y)) {
        food_sound.play();
        score += 1;
        let scoreCount = document.querySelector('#scoreCount');
        scoreCount.innerHTML = "Score : " + score;

        if (score > hiscorevalue) {
            hiscorevalue = score;
            localStorage.setItem("HiScore", JSON.stringify(hiscorevalue));
            let hiscore_on_screen = document.querySelector('#hiscore');
            hiscore_on_screen.innerHTML = 'Hi-Score : ' + hiscorevalue;
        }

        //unshift() method inserts an element at the starting of an array or array-like objects.
        //here , unshift() method inserts a new element in snakeArr array i.e., it is used to make snake body longer.
        snakeArr.unshift({ x: snakeArr[0].x + movedInDir.x, y: snakeArr[0].y + movedInDir.y });

        // if food appears on head or body of snake , then again food is generated.
        // this continues until food does not appears on head or body of snake.
        while (foodOnBody) {
            //regenerating food.
            let a = 2;
            let b = 16;
            food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
            for( i = 0 ; i < snakeArr.length ; i++){
                foodOnBody = false;
                if((food.x === snakeArr[i].x) && (food.y === snakeArr[i].y)){
                    foodOnBody = true;
                    break;
                }
            }
        }
        foodOnBody = true;
    }

    // moving the snake.
    for (let i = snakeArr.length - 2; i >= 0; i--) {

        //assigning the object of snakeArr[i] to snakeArr[i+1]. 
        snakeArr[i + 1] = { ...snakeArr[i] };
    };

    //moving the first element.
    snakeArr[0].x += movedInDir.x;
    snakeArr[0].y += movedInDir.y;

    //Part 2 : Displaying the snake array and food.
    //displaying the snake.

    let board = document.querySelector('#board');
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        // === compares the data type and value of the two variables.
        // == compares only the value of the variables and ignores the data type.
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snakeBody');
        }

        //appendChild() method appends the argument ( node ) as the last child of the node. In this case argument is snakeElement and node is board.
        board.appendChild(snakeElement);
    });

    //displaying food.
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
};



//Main logic starts here.

//.getItem() takes name of variable as argument and returns its value stored in local storage.
//if variable does not exists in local storage , then .getItem() returns null.
//HiScore variable contains a JSON string.

let HiScore = localStorage.getItem("HiScore");
let hiscorevalue;
if (HiScore === null) {
    hiscorevalue = 0;
    
    //.setItem(name of variable as string , value of variable as string).
    //.setItem() sets value of variable in the local storage (value and variable are given as argument).
    //stringify() function is used here to convert int value of hiscorevalue variable to string./
    localStorage.setItem("HiScore", JSON.stringify(hiscorevalue));
}
else {
    
    ///JSON.parse() converts the JSON string contained in HiScore variable to a JS object.
    hiscorevalue = JSON.parse(HiScore);
    let hiscore_on_screen = document.querySelector('#hiscore');
    hiscore_on_screen.innerHTML = 'Hi-Score : ' + hiscorevalue;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    music_sound.play();
    // start the game.
    movedInDir = { x: 0, y: 1 };
    move_sound.play();
    switch (e.key) {
        case "ArrowUp":
            // console.log("arrowup");
            movedInDir.x = 0;
            movedInDir.y = -1;
            break;

        case "ArrowDown":
            // console.log("arrowdown");
            movedInDir.x = 0;
            movedInDir.y = 1;
            break;

        case "ArrowRight":
            // console.log("arrowright");
            movedInDir.x = 1;
            movedInDir.y = 0;
            break;

        case "ArrowLeft":
            // console.log("arrowleft");
            movedInDir.x = -1;
            movedInDir.y = 0;
            break;

        default:
            break;
    }
});