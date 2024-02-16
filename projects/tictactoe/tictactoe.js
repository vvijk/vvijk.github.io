"use strict";

let oGameData = {};

oGameData.initGlobalObject = function() {
    //Datastruktur för vilka platser som är lediga respektive har brickor
    oGameData.gameField = Array('', '', '', '', '', '', '', '', '');
    oGameData.playerOne = "X";
    oGameData.playerTwo = "O";
    oGameData.currentPlayer = "";
    oGameData.nickNamePlayerOne = "";
    oGameData.nickNamePlayerTwo = "";
    oGameData.colorPlayerOne = "";
    oGameData.colorPlayerTwo = "";
    oGameData.timerEnabled = false;
    oGameData.timerId = null;
}

oGameData.checkHorizontal = function(){
    for(let i = 0; i < oGameData.gameField.length; i++){
        if(i % 3 == 0){
            if(oGameData.gameField[i] == oGameData.gameField[i+1] && oGameData.gameField[i+1] == oGameData.gameField[i+2] && oGameData.gameField[i+2] == oGameData.playerOne){
                return 1;
            }   
            else if(oGameData.gameField[i] == oGameData.gameField[i+1] && oGameData.gameField[i+1] == oGameData.gameField[i+2] && oGameData.gameField[i+2] == oGameData.playerTwo){
                return 2;
            }
        }
    }
}
oGameData.checkVertical = function(){
    for(let i = 0; i < oGameData.gameField.length / 3; i++){
        if(oGameData.gameField[i] == oGameData.gameField[i+3] && oGameData.gameField[i+3] == oGameData.gameField[i+6] && oGameData.gameField[i+6] == oGameData.playerOne){
            return 1;
        }
        else if(oGameData.gameField[i] == oGameData.gameField[i+3] && oGameData.gameField[i+3] == oGameData.gameField[i+6] && oGameData.gameField[i+6] == oGameData.playerTwo){
            return 2;
        }
    }
}
oGameData.checkDiagonalLeftToRight = function(){
    if(oGameData.gameField[0] == oGameData.gameField[4] && oGameData.gameField[4] == oGameData.gameField[8] && oGameData.gameField[8] == oGameData.playerOne){
        return 1;
    }
    else if(oGameData.gameField[0] == oGameData.gameField[4] && oGameData.gameField[4] == oGameData.gameField[8] && oGameData.gameField[8] == oGameData.playerTwo){
        return 2;
    }
}
oGameData.checkDiagonalRightToLeft = function(){
    if(oGameData.gameField[2] == oGameData.gameField[4] && oGameData.gameField[4] == oGameData.gameField[6] && oGameData.gameField[6] == oGameData.playerOne){
        return 1;
    }
    else if(oGameData.gameField[2] == oGameData.gameField[4] && oGameData.gameField[4] == oGameData.gameField[6] && oGameData.gameField[6] == oGameData.playerTwo){
        return 2;
    }
}
oGameData.checkForDraw = function(){
 for(let i = 0; i < oGameData.gameField.length; i++){
     if(oGameData.gameField[i] == ''){
        return 0; 
     }
 }
 return 3;
}
oGameData.checkForGameOver = function() {
    
    if (oGameData.checkHorizontal()){           return oGameData.checkHorizontal();}
    if (oGameData.checkVertical()){             return oGameData.checkVertical();}
    if (oGameData.checkDiagonalLeftToRight()){  return oGameData.checkDiagonalLeftToRight();}
    if (oGameData.checkDiagonalRightToLeft()){  return oGameData.checkDiagonalRightToLeft();}
    if (oGameData.checkForDraw()) {             return oGameData.checkForDraw();}
    return 0;
}

window.addEventListener('load', function(){
    oGameData.initGlobalObject();
    timerBody();
    document.querySelector('#gameArea').classList.add('d-none');
    
    document.querySelector('#newGame').addEventListener('click', function(){
        if(validateForm()){
            let timerCheckBox = document.querySelector('#timerCheckBox');
            if(timerCheckBox.checked){
                    oGameData.timerEnabled = true;
                console.log("Timer started");
            }
            initiateGame();
        }
    })
});

function validateForm(){
    let min_name_length = 3; 
    let white = "#ffffff"; //Förbjuden färg
    let black = "#000000"; //Förbjuden färg
    try {
        // NAMNCHECK
        if(document.querySelector('#nick1').value.length < min_name_length){
            alert("NickName1 är för kort")
            throw("NickName1 är för kort");
        }
        if(document.querySelector('#nick2').value.length < min_name_length){
            alert("NickName2 is too short")
            throw("Nickname2 är för kort");
        }
        if(document.querySelector('#nick2').value === document.querySelector('#nick1').value){
            alert("Same nickname not allowed...")
            throw("Same nickname not allowed...");
        }
        // FÄRGCHECK
        let colorP1 = document.querySelector('#color1').value;
        let colorP2 = document.querySelector('#color2').value;
        if(colorP1 == white || colorP1 == black){
            throw("Player 1 has a forbidden colour");
        }
        if(colorP2 == white || colorP2 == black){
            throw("Player 1 has a forbidden colour");
        }
        if(colorP1 === colorP2){
            throw("Players cant have same color!");
        }
        return true;
    } catch (e){
        console.log(e);
        document.querySelector('#errorMsg').textContent = e;
        return false;
    }
}

function initiateGame(){
    document.querySelector('form').classList.add('d-none');
    document.querySelector('#gameArea').classList.remove('d-none');
    document.querySelector('#errorMsg').classList.add('d-none');
    oGameData.nickNamePlayerOne = document.querySelector('#nick1').value;
    oGameData.nickNamePlayerTwo = document.querySelector('#nick2').value;
    oGameData.colorPlayerOne = document.querySelector('#color1').value;
    oGameData.colorPlayerTwo = document.querySelector('#color2').value;
    
    let cells  = document.querySelectorAll('td');
    cells.forEach(function(cell){
        cell.textContent='';
        cell.setAttribute('style', 'background-color: white');
    });

    // Remove the bounce class from the h1 element
    const h1Element = document.querySelector('.jumbotron >h1');
    h1Element.classList.remove('bounce');

    let playerChar;
    let playerName;
    if(Math.random() < 0.5){
        playerChar = oGameData.playerOne;
        playerName = oGameData.nickNamePlayerOne;
        oGameData.currentPlayer = oGameData.playerOne;
    } else {
        playerChar = oGameData.playerTwo;
        playerName = oGameData.nickNamePlayerTwo;
        oGameData.currentPlayer = oGameData.playerTwo;
    }
    document.querySelector('.jumbotron >h1').textContent = "Aktuell spelare är " + playerName;
    document.querySelector('table').addEventListener('click', executeMove);
}

function executeMove(oEvent){

    let cells = document.querySelectorAll('td');
    for(let i = 0; i < cells.length; i++){
        if(oEvent.target.getAttribute('data-id') == i){     //Hämta data-id
            if(oGameData.gameField[i] == ''){ 
                cells[i].textContent = oGameData.currentPlayer;
                oGameData.gameField[i] = oGameData.currentPlayer;

                if(oGameData.currentPlayer == oGameData.playerOne){
                    cells[i].style = 'background-color: ' + oGameData.colorPlayerOne;
                    oGameData.currentPlayer = oGameData.playerTwo;
                    document.querySelector('.jumbotron >h1').textContent = "Current player is " + oGameData.nickNamePlayerTwo;
                } else if(oGameData.currentPlayer == oGameData.playerTwo){
                    cells[i].style = 'background-color: ' + oGameData.colorPlayerTwo;
                    oGameData.currentPlayer = oGameData.playerOne;
                    document.querySelector('.jumbotron >h1').textContent = "Current player is " + oGameData.nickNamePlayerOne;
                }
                if(oGameData.timerEnabled){
                    clearTimeout(oGameData.TimerId);
                    startTimer();
                }
                if(oGameData.checkForGameOver()){
                    if(oGameData.timerEnabled){  
                        clearTimeout(oGameData.TimerId);

                    }
                    document.querySelector('table').removeEventListener('click', executeMove);
                    document.querySelector('form').classList.remove('class', 'd-none');
                    //Kollar vem som vunnit
                    // if(oGameData.checkForGameOver() == 2){
                    //     document.querySelector('.jumbotron >h1').textContent = oGameData.nickNamePlayerTwo + '(' + oGameData.playerTwo + ')' + ' vann! Spela igen?';
                    // }else if (oGameData.checkForGameOver() == 1) {
                    //     document.querySelector('.jumbotron >h1').textContent = oGameData.nickNamePlayerOne + '(' + oGameData.playerOne + ')' + ' vann! Spela igen?';
                        
                    // } else if(oGameData.checkForGameOver() == 3){
                    //     document.querySelector('.jumbotron >h1').textContent = 'Oavgjort! Spela igen?';
                    // }

                    let winnerText = '';
                    if (oGameData.checkForGameOver() == 2) {
                        winnerText = `${oGameData.nickNamePlayerTwo} (${oGameData.playerTwo}) won!`;
                    } else if (oGameData.checkForGameOver() == 1) {
                        winnerText = `${oGameData.nickNamePlayerOne} (${oGameData.playerOne}) won!`;
                    } else if (oGameData.checkForGameOver() == 3) {
                        winnerText = 'Even steven...';
                    }
                    
                    document.querySelector('.jumbotron >h1').textContent = winnerText;
                    
                    if (oGameData.checkForGameOver() == 2) {
                        document.querySelector('.jumbotron >h1').style.color = oGameData.colorPlayerTwo;
                    } else if (oGameData.checkForGameOver() == 1) {
                        document.querySelector('.jumbotron >h1').style.color = oGameData.colorPlayerOne;
                    }

                    const h1Element = document.querySelector('.jumbotron >h1');
                    h1Element.textContent = winnerText;
                    h1Element.classList.add('fade-in');
                    h1Element.classList.add('bounce');

                    document.querySelector('#gameArea').classList.add('d-none');
                    oGameData.initGlobalObject();
                }
            }
        }
    }
}

function timerBody(){

    let timerdiv = document.createElement("div")
    timerdiv.classList.add('class', 'col-6');

    let timerCheckBox = document.createElement("input");
    timerCheckBox.setAttribute("type","checkbox");
    timerCheckBox.setAttribute("id", "timerCheckBox");
    timerCheckBox.setAttribute("name", "timerCheckBox");
    timerCheckBox.classList.add('class','form-check-input');

    timerCheckBox.addEventListener('change', function() {
        if(this.checked){
            oGameData.timerEnabled = true;
        } else {
            oGameData.timerEnabled = false;
        }
    });

    let checkBoxLabel = document.createElement("label")
    checkBoxLabel.setAttribute("for","timerCheckBox");
    checkBoxLabel.classList.add('class','form-check-label');

    let text = document.createTextNode("Play with 5 sec timer?");
    checkBoxLabel.appendChild(text);

    let parentDiv = document.querySelector("#divInForm");
    let btnDiv = document.querySelector('#divWithA');

    timerdiv.appendChild(timerCheckBox);
    timerdiv.appendChild(checkBoxLabel);
    parentDiv.insertBefore(timerdiv, btnDiv);
}

function startTimer(){ 
    oGameData.TimerId = setTimeout(switchPlayerTurn, 5000);
}

function switchPlayerTurn(){
    if(oGameData.currentPlayer == oGameData.playerOne){
        oGameData.currentPlayer = oGameData.playerTwo;
        document.querySelector('.jumbotron >h1').textContent = "Current player is " + oGameData.nickNamePlayerTwo;
    } else if(oGameData.currentPlayer == oGameData.playerTwo){
        oGameData.currentPlayer = oGameData.playerOne;
        document.querySelector('.jumbotron >h1').textContent = "Current player is " + oGameData.nickNamePlayerOne;
    }
    clearTimeout(oGameData.TimerId);
    startTimer();
}

document.getElementById('backBtn').addEventListener('click', function() {
    window.location.href = '../../index.html';
});
