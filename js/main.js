//------------------------------------------------------------------------------------
//-------------------------BOARDS AND PLAYER NAMES------------------------------------
//------------------------------------------------------------------------------------

//GAME BOARD STORING COLORS
var gameBoard = 
[[0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0]];

//GAME BOARD STORING LETTERS
 var gameBoardLetters = 
 [[0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0]];

//GET PLAYER NAMES FROM LOCAL STORAGE
var players = {
 player1Name: localStorage.getItem("player1"),
 player2Name: localStorage.getItem("player2"),
 };

 //IF PLAYER NAMES ARE NOT SET UP, REDIRECT TO INDEX PAGE
if(players.player1Name == null || players.player2Name == null) {
  window.location.href = "index.html";
}

//PLAYER NAMES TO UPPER CASE
players.player1Name = players.player1Name.toUpperCase();
players.player2Name = players.player2Name.toUpperCase();

//PLAYER NAMES SPLIT INTO ARRAY FOR COIN LETTERS
var player1NameArray = players.player1Name.split("");
var player2NameArray = players.player2Name.split("");

//CONCATINATE PLAYER LETTERS ARRAYS INTO SINGLE ARRAY
var playersNameArray = [];
for(var i = 0; i <=3; i++){
  playersNameArray.push(player1NameArray[i]);
  playersNameArray.push(player2NameArray[i]);
}

//------------------------------------------------------------------------------------
//--------------------------------FUNCTIONS-------------------------------------------
//------------------------------------------------------------------------------------


function addCoin(row, col, color, letter) {
  gameBoard[row][col] = color;
  gameBoardLetters[row][col] = letter;
}

function printCoin() {
  for(var row = 0; row <= 5; row++) {
    for(var col = 0; col <= 6; col++) {
     if(gameBoard[row][col] != 0){
      var cell = $("tr:eq(" + row + ")").find('td').eq(col);
      cell.children('button').addClass(gameBoard[row][col]);
     }
     if(gameBoardLetters[row][col] != 0){
      cell.children('button').html(gameBoardLetters[row][col]);
     }
    }
  }
}

//DROP COIN TO BOTTOM OF THE COLUMN
function putCoinToBottom(col, row) {
  for(var i = 5; i > row; i--) {
    if(gameBoard[i][col] == 0) {
      return i;
     }
   }
   return row;
}

//SWITCH PLAYER NAME LETTER
var currentLetter = playersNameArray[0];
var counter = 1;
function switchLetter() {
  if(counter <= 7) {
      currentLetter = playersNameArray[counter];
      counter++;
    } else {
      currentLetter = playersNameArray[0];
      counter = 1;
  }
}

var i = 0;
var j = 0;
//CHANGE COLOR OF THE COIN AND SWITCH PLAYER INFO TEXT ON TURN END
var currentPlayerColor = "red";
function switchPlayer() {
  if(currentPlayerColor == "red") {
    //CHANGE COLOR OF THE COIN
    currentPlayerColor = "yellow";

    //CHANGE PLAYER COIN LETTER IN THE UPPER BUTTON
    if(i < 3){
      i++;
    } else {
      i = 0;
    }
    $("#team1").children("button").html(player1NameArray[0 + i]);

    //SWITCH PLAYER INFO TEXT ON TURN END
    $('#currentPlayer1').hide();
    $('#currentPlayer2').show();

  } else {
    currentPlayerColor = "red";

    if(j < 3){
      j++;
    } else {
      j = 0;
    }
    $("#team2").children("button").html(player2NameArray[0 + j]);

    $('#currentPlayer1').show();
    $('#currentPlayer2').hide();
  }
}

//RETURN TRUE IF SELECTED CELL IS OCCUPIED
function occupiedCell(col, row) {
  var selectedCell = gameBoard[row][col];
  if(selectedCell == 0){
    return false;
  } else {
    return true;
  }
}

//RETURN TRUE IF ALL CELLS ARE OCCUPIED
function gameDraw() {
   for (var row = 0; row <= 5; row++) {
    for (var col = 0; col <= 6; col++) {
      if (gameBoard[row][col] === 0) {
       return false;
      }
    }
  }
  return true;
}

var winCellCounter = 4;
var winnerCells = [];
function horizontalWin() {
    var currentCell,
        previousCell,
        total;

    //GO TROUGH ROWS
    for (var row = 0; row <= 5; row++) {
        for (var col = 0; col <= 6; col++) {
            currentCell = gameBoard[row][col];

            if (currentCell == previousCell && currentCell != 0) {
                total = total + 1;


                winnerCells.push(row);
                winnerCells.push(col);
            } else {
                //RESET TOTAL AND WINNER CELLS IF BREAK IS FOUND
                total = 0;
                winnerCells = [];
            }
            if (total == winCellCounter - 1) {
                winnerCells.unshift(winnerCells[1] - 1);
                winnerCells.unshift(winnerCells[1]);
                return true;
            }
            previousCell = currentCell;
        }

        //RESET ON ROW END
        total = 0;
        previousCell = 0;
    }
    //RETURN FALSE IF ROW DOES NOT HAVE WINNING SERIES
    return false;
}


function horizontalWinByLetters() {
  //REVERSE PLAYER NAMES TO CHECK FOR HORIZONTAL WIN FROM RIGHT TO LEFT
  var player1NameReverse = players.player1Name.split("").reverse().join("");
  var player2NameReverse = players.player2Name.split("").reverse().join("");

  //GO TROUGH ROWS
  for (var row = 0; row <= 5; row++) {
    for (var col = 0; col <= 6; col++) {
      if(gameBoardLetters[row].toString().replace(/,/g,"").indexOf(players.player1Name)>-1 == true)  {
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = gameBoardLetters[row].toString().replace(/,/g,"").indexOf(players.player1Name);
        
        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index + i);
        }

        return true;

      }else if (gameBoardLetters[row].toString().replace(/,/g,"").indexOf(player1NameReverse)>-1 == true){
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = gameBoardLetters[row].toString().replace(/,/g,"").indexOf(players.player1Name);

        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index - i);
        }

        //HORIZONATAL WIN FROM RIGHT TO LEFT FOR PLAYER 1
        return true;

      }else if (gameBoardLetters[row].toString().replace(/,/g,"").indexOf(player2NameReverse)>-1 == true) {
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = gameBoardLetters[row].toString().replace(/,/g,"").indexOf(players.player2Name);

        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index - i);
        }

        //HORIZONATAL WIN FROM RIGHT TO LEFT FOR PLAYER 2
        return true;

      }else if (gameBoardLetters[row].toString().replace(/,/g,"").indexOf(players.player2Name)>-1 == true){
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = gameBoardLetters[row].toString().replace(/,/g,"").indexOf(players.player2Name);
        
        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index + i);
        }

        return true;
      }
    }
  }
  //RETURN FALSE IF ROW DOES NOT HAVE WINNING STRING
  return false;
}

function verticalWin() {
    var currentCell,
        previousCell,
        total;

    //GO TROUGH COLUMNS
    for (var col = 0; col <= 6; col++) {
        for (var row = 0; row <= 5; row++) {
            currentCell = gameBoard[row][col];
            if (currentCell == previousCell && currentCell != 0) {
                total = total + 1;

                winnerCells.push(row);
                winnerCells.push(col);
            } else {
                //RESET TOTAL AND WINNER CELLS IF BREAK IS FOUND
                total = 0;
                winnerCells = [];
            }
            if (total == winCellCounter - 1) {
                winnerCells.unshift(winnerCells[1]);
                winnerCells.unshift(winnerCells[1] - 1);
                return true;
            }
            previousCell = currentCell;
        }

        //RESET ON COLUMN END
        total = 0;
        previousCell = 0;
    }

    //RETURN FALSE IF COLUMN DOES NOT HAVE WINNING STRING
    return false;
}

var firstIndexPos;
var winColumn;
//FIND A COLUMN WITH PLAYER NAME
function searchForNameVertically (board, name) {
  for (var j = 0; j < board[0].length; j++) {
    var verticalName= '';
    for (var i = 0; i < board.length; i++) {
      verticalName = verticalName + board[i][j];
      winColumn = j;
    }
    if ((verticalName.includes(name)) || (verticalName.split('').reverse().join('').includes(name))) {
      firstIndexPos = verticalName.indexOf(players.player1Name[0]);
      return true;
    }
  }
  return false;
}

function verticalWinByLetters() {
  //GO TROUGH COLUMNS
  for (var col = 0; col <= 6; col++) {
    for (var row = 0; row <= 5; row++) {
      if(searchForNameVertically(gameBoardLetters, players.player1Name) == true || searchForNameVertically(gameBoardLetters, players.player2Name) == true){

        //FIND WINNER CELLS
        if(firstIndexPos >= 3){
          //WIN FROM BOTTOM TO TOP
          for(var i = 3; i >= 0; i--){
            winnerCells.push(firstIndexPos - i);
            winnerCells.push(winColumn);
          } 
        } else {
          //WIN FROM TOP TO BOTTOM
          winnerCells.push(firstIndexPos);
          winnerCells.push(winColumn);
          for(var i = 3; i >= 1; i--){
            winnerCells.push(firstIndexPos + i);
            winnerCells.push(winColumn);
          } 
        }
        return true;
      }

    }
  }
  //RETURN FALSE IF COLUMN DOES NOT HAVE WINNING STRING
  return false;
}

function diagonalWin() {
  var col,
    row,
    colAlt,
    rowAlt,
    currentCell,
    previousCell = 0,
    total = 0;

  
  /*[[x,x,x,x,x,x,x],
     [0,x,x,x,x,x,x],
     [0,0,x,x,x,x,x],
     [0,0,0,x,x,x,x],
     [0,0,0,0,x,x,x],
     [0,0,0,0,0,x,x]];*/
  //CHECK FROM TOP LEFT TO RIGHT DOWN
  for (col = 0; col <= 6; col++) {
    colAlt = col;
    rowAlt = 0;

    while (colAlt <= 6 && rowAlt <= 5) {
      currentCell = gameBoard[rowAlt][colAlt];
      if (currentCell == previousCell && currentCell !== 0) {
          total = total + 1;

          //FIND WINNER CELLS
          winnerCells.push(rowAlt);
          winnerCells.push(colAlt);
      } else {
          //RESET TOTAL AND WINNER CELLS IF BREAK IS FOUND
          total = 0;
          winnerCells = [];
      }
      if (total == winCellCounter - 1) {
        winnerCells.unshift(winnerCells[1] - 1); 
        winnerCells.unshift(winnerCells[1] - 1);
        return true;
      }
      previousCell = currentCell;

      //ONE DIAGONAL POSITION
      colAlt++;
      rowAlt++;
    }
    //RESET ON DIAGONAL END
    total = 0;
    previousCell = 0;
  }


  /*[[x,x,x,x,x,x,x],
     [x,x,x,x,x,x,0],
     [x,x,x,x,x,0,0],
     [x,x,x,x,0,0,0],
     [x,x,x,0,0,0,0],
     [x,x,0,0,0,0,0]];*/
  //CHECK FROM TOP RIGHT TO LEFT DOWN
  for (col = 0; col <= 6; col++) {
    colAlt = col;
    rowAlt = 0;

    while (0 <= colAlt && rowAlt <= 5) {
      currentCell = gameBoard[rowAlt][colAlt];
      if (currentCell == previousCell && currentCell !== 0) {
        total = total + 1;

        //FIND WINNER CELLS
        winnerCells.push(rowAlt);
        winnerCells.push(colAlt);
      } else {
        //RESET TOTAL AND WINNER CELLS IF BREAK IS FOUND
        total = 0;
        winnerCells = [];
      }
      if (total == winCellCounter - 1) {
        winnerCells.unshift(winnerCells[1] + 1); 
        winnerCells.unshift(winnerCells[1] - 1);
        return true;
      }
      previousCell = currentCell;

      //ONE DIAGONAL POSITION
      colAlt--;
      rowAlt++;
    }
    //RESET ON DIAGONAL END
    total = 0;
    previousCell = 0;
  }

  /*[[x,0,0,0,0,0,0],
     [x,x,0,0,0,0,0],
     [x,x,x,0,0,0,0],
     [x,x,x,x,0,0,0],
     [x,x,x,x,x,0,0],
     [x,x,x,x,x,x,0]];*/
  //CHECK FROM TOP LEFT TO RIGHT DOWN
  for (row = 0; row <= 5; row++) {
    colAlt = 0;
    rowAlt = row;

    while (colAlt <= 6 && rowAlt <= 5) {
      currentCell = gameBoard[rowAlt][colAlt];
      if (currentCell == previousCell && currentCell !== 0) {
        total = total + 1;

        //FIND WINNER CELLS
        winnerCells.push(rowAlt);
        winnerCells.push(colAlt);
      } else {
        //RESET TOTAL AND WINNER CELLS IF BREAK IS FOUND
        total = 0;
        winnerCells = [];
      }
      if (total == winCellCounter - 1) {
        winnerCells.unshift(winnerCells[1] - 1); 
        winnerCells.unshift(winnerCells[1] - 1);
        return true;
      }
      previousCell = currentCell;

      //ONE DIAGONAL POSITION
      colAlt++;
      rowAlt++;
    }
    //RESET ON DIAGONAL END
    total = 0;
    previousCell = 0;
  }

  /*[[0,0,0,0,0,0,x],
     [0,0,0,0,0,x,x],
     [0,0,0,0,x,x,x],
     [0,0,0,x,x,x,x],
     [0,0,x,x,x,x,x],
     [0,x,x,x,x,x,x]];*/
  //CHECK FROM TOP RIGHT TO LEFT DOWN
  for (row = 0; row <= 5; row++) {
    colAlt = 6;
    rowAlt = row;

    while (0 <= colAlt && rowAlt <= 5) {
      currentCell = gameBoard[rowAlt][colAlt];
      if (currentCell == previousCell && currentCell !== 0) {
        total = total + 1;

        //FIND WINNER CELLS
        winnerCells.push(rowAlt);
        winnerCells.push(colAlt);
      } else {
        //RESET TOTAL AND WINNER CELLS IF BREAK IS FOUND
        total = 0;
        winnerCells = [];
      }
      if (total == winCellCounter - 1) {
        winnerCells.unshift(winnerCells[1] + 1); 
        winnerCells.unshift(winnerCells[1] - 1);
        return true;
      }
      previousCell = currentCell;

      //ONE DIAGONAL POSITION DOWN
      colAlt--;
      rowAlt++;
    }
    //RESET ON DIAGONAL END
    total = 0;
    previousCell = 0;
  }

  //RETURN FALSE IF DIAGONALS DO NOT HAVE WINNING STRING
  return false;
}


function diagonalWinByLetters() {
  //REVERSE PLAYER NAMES
  var player1NameReverse = players.player1Name.split("").reverse().join("");
  var player2NameReverse = players.player2Name.split("").reverse().join("");

  var col,
      row,
      colAlt,
      rowAlt,
      currentCell;
  var currentDiagonal = [];

  /*[[x,x,x,x,x,x,x],
     [0,x,x,x,x,x,x],
     [0,0,x,x,x,x,x],
     [0,0,0,x,x,x,x],
     [0,0,0,0,x,x,x],
     [0,0,0,0,0,x,x]];*/
  //CHECK FROM TOP LEFT TO RIGHT DOWN
  for (col = 0; col <= 6; col++) {
    colAlt = col;
    rowAlt = 0;

    while (colAlt <= 6 && rowAlt <= 5) {
      currentCell = gameBoardLetters[rowAlt][colAlt];
      if(currentCell != 0) {
        currentDiagonal.push(currentCell);
      }

      if(currentDiagonal.toString().replace(/,/g,"").indexOf(players.player1Name)>-1 == true)  {
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player1Name);
        
        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index);
        } 

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(player1NameReverse)>-1 == true){
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player1Name);

        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row + i);
          winnerCells.push(index - i);
        } 

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(player2NameReverse)>-1 == true) {
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name);

        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index - i);
        }

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name)>-1 == true){
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name);
        
        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index + i);
        }

        return true;
      }

      //ONE DIAGONAL POSITION UP
      colAlt++;
      rowAlt++;
    }
    //RESET ON DIAGONAL END
    total = 0;
    previousCell = 0;
    currentDiagonal = [];
  }

  /*[[x,x,x,x,x,x,x],
     [x,x,x,x,x,x,0],
     [x,x,x,x,x,0,0],
     [x,x,x,x,0,0,0],
     [x,x,x,0,0,0,0],
     [x,x,0,0,0,0,0]];*/
  //CHECK FROM TOP RIGHT TO LEFT DOWN
  for (col = 0; col <= 6; col++) {
    colAlt = col;
    rowAlt = 0;

    while (0 <= colAlt && rowAlt <= 5) {
      currentCell = gameBoardLetters[rowAlt][colAlt];
      if(currentCell != 0) {
        currentDiagonal.push(currentCell);
      }

      if(currentDiagonal.toString().replace(/,/g,"").indexOf(players.player1Name)>-1 == true)  {
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player1Name);
        
        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index);
        } 

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(player1NameReverse)>-1 == true){
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player1Name);

        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row + i);
          winnerCells.push(index - i);
        } 

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(player2NameReverse)>-1 == true) {
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name);

        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index - i);
        }

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name)>-1 == true){
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name);
        
        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index + i);
        }

        return true;
      }

      //ONE DIAGONAL POSITION DOWN
      colAlt--;
      rowAlt++;
    }
    //RESET ON DIAGONAL END
    total = 0;
    previousCell = 0;
    currentDiagonal = [];
  }

   /*[[x,0,0,0,0,0,0],
      [x,x,0,0,0,0,0],
      [x,x,x,0,0,0,0],
      [x,x,x,x,0,0,0],
      [x,x,x,x,x,0,0],
      [x,x,x,x,x,x,0]];*/
  //CHECK FROM TOP LEFT TO RIGHT DOWN
  for (row = 0; row <= 5; row++) {
    colAlt = 0;
    rowAlt = row;

    while (colAlt <= 6 && rowAlt <= 5) {
      currentCell = gameBoardLetters[rowAlt][colAlt];
      if(currentCell != 0) {
        currentDiagonal.push(currentCell);
      }

      if(currentDiagonal.toString().replace(/,/g,"").indexOf(players.player1Name)>-1 == true)  {
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player1Name);
        
        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index);
        } 

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(player1NameReverse)>-1 == true){
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player1Name);

        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row + i);
          winnerCells.push(index - i);
        } 

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(player2NameReverse)>-1 == true) {
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name);

        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index - i);
        }

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name)>-1 == true){
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name);
        
        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index + i);
        }

        return true;
      }

      //ONE DIAGONAL POSITION DOWN
      colAlt++;
      rowAlt++;
    }
    //RESET ON DIAGONAL END
    total = 0;
    previousCell = 0;
    currentDiagonal = [];
  }
  
  /*[[0,0,0,0,0,0,x],
     [0,0,0,0,0,x,x],
     [0,0,0,0,x,x,x],
     [0,0,0,x,x,x,x],
     [0,0,x,x,x,x,x],
     [0,x,x,x,x,x,x]];*/
  //CHECK FROM TOP RIGHT TO LEFT DOWN
  for (row = 0; row <= 5; row++) {
    colAlt = 6;
    rowAlt = row;

    while (0 <= colAlt && rowAlt <= 5) {
      currentCell = gameBoardLetters[rowAlt][colAlt];
      if(currentCell != 0) {
        currentDiagonal.push(currentCell);
      }

      if(currentDiagonal.toString().replace(/,/g,"").indexOf(players.player1Name)>-1 == true)  {
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player1Name);
        
        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index);
        } 

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(player1NameReverse)>-1 == true){
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(player1NameReverse);

        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row + i);
          winnerCells.push(index - i);
        } 

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(player2NameReverse)>-1 == true) {
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name);

        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index - i);
        }

        return true;

      }else if (currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name)>-1 == true){
        //FIND CELL INDEX OF THE START OF THE WINNING CELLS
        var index = currentDiagonal.toString().replace(/,/g,"").indexOf(players.player2Name);
        
        //FIND WINNER CELLS
        for(var i = 0; i <= 3; i++){
          winnerCells.push(row);
          winnerCells.push(index + i);
        }

        return true;
      }
      //ONE DIAGONAL POSITION DOWN
      colAlt--;
      rowAlt++;
      
    }
    //RESET ON DIAGONAL END
    total = 0;
    previousCell = 0;
    currentDiagonal = [];
  }

  //RETURN FALSE IF DIAGONALS DO NOT HAVE WINNING STRING
  return false;
}


//--------------------------------------------------------------------------------------
//------------------------------------EXECUTION-----------------------------------------
//--------------------------------------------------------------------------------------


$(document).ready(function() {
  //PRINT PLAYER NAMES AT THE TOP OF THE PAGE
  $(".player1Name").html(players.player1Name);
  $(".player2Name").html(players.player2Name);

  //PRINT PLAYERS FIRST LETTER ON UPPER BUTTONS AT THE START OF THE GAME
  $("#team1").children("button").html(player1NameArray[0]);
  $("#team2").children("button").html(player2NameArray[0]);

  //PRINT 'PLAYER 1'S TURN' INFO TEXT AT START OF THE GAME
  $('#currentPlayer1').show();

  $('.gameBoard button').click(function(e){
    //FIND ROW AND COLUMN OF THE CLICKED BUTTON WITH STARTING ZERO FROM TOP LEFT
    var row = $('.gameBoard tr').index($(this).closest('tr'));
    var col = $(this).closest('tr').find('td').index($(this).closest('td'));

    //PUT COIN TO THE BOTTOM OF THE COLUMN
    row = putCoinToBottom(col, row);

    //IGNORE CLICK IF PLAYER CLICKS ON OCCPIED CELL
    if(occupiedCell(col, row) == true){
      return;
    }

    //PRINT COIN TO BOARD WHEN PLAYER CLICKS ON COLUMN
    addCoin(row, col, currentPlayerColor, currentLetter);
    printCoin();

    if (verticalWin() || verticalWinByLetters() || horizontalWin() || horizontalWinByLetters() || diagonalWin() || diagonalWinByLetters()) {
      //DISABLE PLAY
      $('.gameBoard button').off('click');
      alert('We have a winner!');

      //ADD 'CHANGE PLAYERS' AND 'REPLAY' BUTTONS
      $('#replay').slideToggle(200);
      $('#changePlayers').slideToggle(200);

      //CHANGE BACKGROUND COLOR OF THE TD ELEMENT FOR WINNING CELLS
      for(var i = 0; i <= 6; i+=2){
        $("tr:eq(" + winnerCells[i] + ")").find('td').eq(winnerCells[i+1]).css('background-color', '#E9967A');
      }

      return;

    } else if(gameDraw()){
      //DISABLE PLAY
      $('.gameBoard button').off('click');
      alert('Game is draw.');

      //ADD 'CHANGE PLAYERS' AND 'REPLAY' BUTTONS
      $('#replay').slideToggle(200);
      $('#changePlayers').slideToggle(200);
    } 

    //SWITCH PLAYER COINS ON TURN END
    switchPlayer();
    switchLetter();
    

 
  })

  //SHOW REPLAY BUTTON
  $('#replay').click(function(e) {
    window.location.reload();
  });

  //SHOW CHANGE PLAYER BUTTON
  $('#changePlayers').click(function(e) {
    localStorage.removeItem('player1');
    localStorage.removeItem('player2');
    window.location.href = "index.html";
  });




});

