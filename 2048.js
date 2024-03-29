var board;
var origin_board;
var score = 0;
var rows = 4;
var columns = 4;
var highest_score = 0;
var flag2048 = false;
var youwinFlag = false;


window.onload = function() {
    setGame();
}

 function setGame() {

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    //create 2 to begin the game
    setTwo();
    setTwo();

}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        if(num == 2048) flag2048 = true;
        if (num <= 4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }                
    }
}

function isOver() {
    for(let i=0; i<rows-1; i++){
        for(let j=0; j<columns-1; j++){
            if(board[i][j] == board[i][j+1] || board[i][j] == board[i+1][j]) 
                return false;
        }
    }
    for(let j=0; j<columns-1; j++){
        if(board[rows-1][j] == board[rows-1][j+1]) return false;
    }
    for(let i=0; i<rows-1; i++){
        if(board[i][columns-1] == board[i+1][columns-1]) return false;
    }

    for(let i=0; i<rows; i++){
        for(let j=0; j<columns; j++){
            if(board[i][j] == 0) return false;
        }
    }
    return true;
}

document.addEventListener('keyup', (e) => {
    origin_board = board.map(v => [...v]);
    if (e.code == "ArrowLeft") {
        slideLeft();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
    }
    else if (e.code == "ArrowUp") {
        slideUp();

    }
    else if (e.code == "ArrowDown") {
        slideDown();
    }

    if(JSON.stringify(board) != JSON.stringify(origin_board)){
        setTwo();
    }
    if(!youwinFlag && flag2048){
        document.getElementById('youwinPopupContainer').style.display = 'block';
        flag2048 = false;
        youwinFlag = true;
    }

    if(isOver()) {
        document.getElementById('gameoverPopupContainer').style.display = 'block';
    }

    document.getElementById("score").innerText = score;
    if(score > highest_score) {
        highest_score = score;
        document.getElementById("highest_score").innerText = score;
    }
    
});

document.addEventListener('touchstart', (event) => {
    touchX = event.changedTouches[0].clientX;
    touchY = event.changedTouches[0].clientY;
  });

  document.addEventListener('touchend', (event) => {
    const deltaX = event.changedTouches[0].clientX - touchX;
    const deltaY = event.changedTouches[0].clientY - touchY;

    if(!(deltaX == 0 && deltaY == 0)){
        origin_board = board.map(v => [...v]);
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
              slideLeft();
            } else {
              slideRight();
            }
          } else {
            if (deltaY < 0) {
              slideUp();
            } else {
              slideDown();
            }
        }
        if(JSON.stringify(board) != JSON.stringify(origin_board)){
            setTwo();
        }
        if(!youwinFlag && flag2048){
            document.getElementById('youwinPopupContainer').style.display = 'block';
            flag2048 = false;
            youwinFlag = true;
        }    
    
        if(isOver()) {
            document.getElementById('gameoverPopupContainer').style.display = 'block';
        }
    }

    document.getElementById("score").innerText = score;
    if(score > highest_score) {
        highest_score = score;
        document.getElementById("highest_score").innerText = score;
    }
  });

function restart() {
    flag2048 = false;
    youwinFlag = false;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 0);
            board[r][c] = 0;
        }
    }
    score = 0;
    document.getElementById("score").innerText = score;
    setTwo();
    setTwo();
}

function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    } //[4, 0, 2]
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();

        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}

// popup
function closeGameoverPopup() {
    document.getElementById('gameoverPopupContainer').style.display = 'none';
}
function closeYouwinPopup() {
    document.getElementById('youwinPopupContainer').style.display = 'none';
}