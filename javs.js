let board;
let boardwidth = 480;
let bordheight = 700;

let birdheight = 30;
let birdwidth = 40;
let birdx = boardwidth / 8;
let birdy = bordheight / 2;
let bird = {
    x: birdx,
    y: birdy,
    width: birdwidth,
    height: birdheight
};

let birdimg;

let pipes;
let pipeArr = [];
let pipewidth = 70;
let pipeheight = 560;
let pipex = boardwidth;
let pipey = 0;

let toppipeimg;
let downpipeimg;

let velocityx = -2.3;
let velocityy = 0;
let gravity = 0.2;

let started = false;
let gameover = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = bordheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    // Load bird image
    birdimg = new Image();
    birdimg.src = "NicePng_flappy-bird-background-png_3520144.png";
    birdimg.onload = function(){
        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    };

    // Load pipe images
    toppipeimg = new Image();
    toppipeimg.src = "NicePng_pipes-png_388476.png";

    downpipeimg = new Image();
    downpipeimg.src = "downpipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);

    displayStartScreen();
    
    // Listen for keyboard and touch events
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", moveBirdTouch);
};

function update(){
    if (!started || gameover) 
        return;

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Update bird position
    velocityy += gravity;
    bird.y = Math.max(bird.y + velocityy, 0);
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > bordheight)
        gameover = true;

    // Update pipes
    for(let i = 0; i < pipeArr.length; i++) {
        let pipe = pipeArr[i];
        pipe.x += velocityx;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }
        if(detectcollosion(bird, pipe)) {
            gameover = true;
        }
    }
    
    // Clear offscreen pipes
    while(pipeArr.length > 0 && pipeArr[0].x < -pipewidth) {
        pipeArr.shift();
    }

    // Display score
    context.fillStyle = "blue";
    context.font = "45px sans-serif";
    context.fillText(score, 15, 45);

    if(gameover) {
        displayGameOverScreen();
        return;
    }
}

function displayStartScreen() {
    context.clearRect(0, 0, board.width, bordheight);
    context.fillStyle = "black";
    context.font = "40px sans-serif";
    context.textAlign = "center";
    context.fillText("Press Touch to Start", board.width / 2, board.height / 2);
    context.fillText("Or Spacebar", board.width / 2, board.height / 2 + 50);
}

function placePipes(){
    if (!started || gameover)
        return;

    let randomPipey = pipey - pipeheight / 4 - Math.random() * (pipeheight / 1.5);
    let openingSpace = board.height / 4;

    let toppipe = {
        img: toppipeimg,
        x: pipex,
        y: randomPipey,
        width: pipewidth,
        height: pipeheight,
        passed: false
    };
    pipeArr.push(toppipe);

    let bottompipe = {
        img: downpipeimg,
        x: pipex,
        y: randomPipey + pipeheight + openingSpace,
        width: pipewidth,
        height: pipeheight,
        passed: false
    };
    pipeArr.push(bottompipe);
}

function moveBird(e){
    if(e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        velocityy = -6;
        if(gameover) {
            resetGame();
            return;
        }
        if(!started) {
            started = true;
            update();
            return;
        }
    }
}

// Touch event handler for mobile
function moveBirdTouch(e) {
    e.preventDefault(); // Prevent default touch behavior
    velocityy = -6;
    if(gameover) {
        resetGame();
        return;
    }
    if(!started) {
        started = true;
        update();
        return;
    }
}

function displayGameOverScreen() {
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(0, 0, board.width, bordheight);

    context.fillStyle = "darkred";
    context.font = "50px sans-serif";
    context.fillText("GAME OVER", 260, 350);

    context.font = "30px sans-serif";
    context.fillStyle = "yellow";
    context.fillText(`Final Score: ${Math.floor(score)}`, 260, 390);

    context.fillStyle = "lightblue";
    context.fillText("Touch/Space Restart", 260, 430);
}

function detectcollosion(a, b){
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resetGame() {
    bird.y = birdy;
    velocityy = 0;
    pipeArr = [];
    score = 0;
    gameover = false;
    update();
}
