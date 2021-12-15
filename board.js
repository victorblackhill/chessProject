/*O. TO-DO in board.js
- Transfer un-used buttons to pieces in board or another file or repatriate the buttons to this file
- Check if the Id's are actually used, if not, simplify twoDimSimpleMatrix or eliminate
- Move place the callback to placePieces to piecesInBoard
*/

// 0 --- This file contains the board without the pieces

// Ia --- Target the usefull objects in the document
const theBoard = document.getElementById("the-board");
const cases = document.getElementsByClassName("carreau");

// II  ---- Define the business logic--------------
// II ---- Render the board

//II0 --- Reset the game
function playGame() {
  window.location.reload(false);
}

// IIa --- Creates a 2D matrix, each case contains the future ID of the case in the board
function twoDimSimpleMatrix(x, y) {
  let tab = [];
  let res = [];
  for (let i = 0; i < x; i++) {
    res[i] = [];
    for (let j = 0; j < y; j++) {
      res[i].push([i, j]);
    }
  }
  return res;
}

// IIb --- Renders the board using lines and cases created by IIc and IId
function renderBoard(x, y) {
  //placer les pièces de chque équipe
  const myBoard = twoDimSimpleMatrix(x, y);
  theBoard.innerHTML = "";

  for (let ligne of myBoard) {
    let ligneHTML = insertionCases(ligne);
    insertionLigne(ligneHTML);
  }
}

//placePieces(army, myBoard);

// IIc --- Creates lines of HTML elements with classes
function insertionCases(ligneSource) {
  let ligneHTML = document.createElement("div");
  ligneHTML.classList.add("lignes");

  for (let chiffre of ligneSource) {
    const myCase = document.createElement("div");
    myCase.classList.toggle("carreau");
    myCase.id = chiffre;

    //paint the cases
    if ((chiffre[0] + chiffre[1]) % 2 === 0) {
      myCase.classList.toggle("dark");
    } else {
      myCase.classList.toggle("clear");
    }

    //ajouter un listener au moment d'ajouter la case
    myCase.addEventListener("click", handleButtonClick);

    //ajouter au tableau
    ligneHTML.appendChild(myCase);
  }

  return ligneHTML;
}

// IId --- Appends HTML lines to the board
function insertionLigne(ligneHTML) {
  theBoard.appendChild(ligneHTML);
}

// III --- Set clickers and event listeners
// done during the rendering of each case in IIa2

// IVa --- Imports & exports

import { placePieces, army, restartArmy } from "./piecesInBoard.js";
import { handleButtonClick } from "./piecesInBoard.js";
import { Chessy } from "./chessGame.js";

// IVb --- Initialize: Set the size of the board

// IVb1 --- Set the size of the board
const x = 8;
const y = 8;
renderBoard(x, y);

// IVb2 --- Create and place pieces
let game;

// IVb3 ---Start the game
placePieces(army, theBoard);
game = new Chessy();
game.gameBoard = game.populateNewBoard();

// IVc --- Exports
export { game, x, y, renderBoard, placePieces, theBoard, playGame };
