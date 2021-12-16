

// 0. This file contains interactions of the pieces of the board

// I --- Target the usefull objects in the document

// Ia --- Target the usefull objects in the document
const btnRemove = document.getElementById("btn-remove");
const msgCoach = document.getElementById("the-coach");
const btnReset = document.getElementById("btn-reset");

// Ib --- this is "the hand in the board"
const state = {
  pieceSelected: false,
  piece: null,
  x: null,
  y: null,
};

// II  ---- Define the business logic--------------
// Create pieces in the board and specify how they interact with each other
// The heavy part of the logic is contained in handleClickButton, these are all helper functions

function handleButtonClick(evt) {
    //this function should only handle states
    //the rest is in the callbacks

    //Condition to avoid moving after the end of the game
    //downstream interaction
    const myPiece = checkPiece(evt);
    if(msgCoach.textContent === "Stalemate!" || msgCoach.textContent === "w Won!"){}
    //verify that the case contains a piece
    
    else if (state.pieceSelected === false && myPiece&& evt.target.getAttribute("data-piece")[0] === game.turn) {
      selectCase(evt);
      selectPiece(evt, army);
    } else if (state.pieceSelected && !myPiece) {
      newCase(evt);
      oldCase();
      movePiece(evt);
      unSelectPiece();
      //IMPORANT = upstream link => this is what the board communicates to the game
      
      msgCoach.textContent = game.doTurn()

    } else if (state.pieceSelected && state.piece === myPiece) {
      selectCase(evt);
      unSelectPiece(evt);
    } else if (state.piece==="bRoi" && myPiece === "wTour"){
      //upstream interaction, to be refactored within a single doTurn() function to be able to add other pieces
      //Refactor the menace : is menaced by, will allow constructing a menace 2D matrix object for each state :D
  
      // if tower unprotected con
      
      const unprotected = !game.computeMenaceKing(game.whiteArmy.wRoi,game.gameBoard)[1].reduce((past,present)=>{return past || present === "wTour"},false)
      // if tower within reach
      const withinReach = game.computeMenaceKing(game.blackArmy.bRoi,game.gameBoard)[1].reduce((past,present)=>{return past || present === "wTour"},false)
  
      if(unprotected && withinReach){
        console.log("here")
        newCase(evt);
        oldCase();
        movePiece(evt);
        unSelectPiece();
        evt.target.classList.toggle("fa-chess-rook")
        evt.target.classList.toggle("fas")
        evt.target.classList.toggle("w")
        msgCoach.textContent = "Stalemate!"

      }
      
    }
  }

// IIb - Initialisation functions -----------------------------

// IIb1 --- Creates and returns a new Army
function placePieces(army = {}, HTMLboard) {
  //refactor when army changes its looks
  for (let piece in army) {
    const laCase = document.getElementById(army[piece].x + "," + army[piece].y);
    laCase.setAttribute("data-piece",piece)
    laCase.classList.toggle("fas")
    laCase.classList.toggle(army[piece].class)
    laCase.classList.toggle(laCase.getAttribute("data-piece")[0])
  }

  return HTMLboard;
}

// IIb2 --- Creates and returns a new Army
function restartArmy() {
  const army = hardCopy({
    wRoi: { x: 3, y: 0, name: "wRoi" ,class:"fa-chess-king", type:"Roi"},
    wTour: { x: 4, y: 0, name: "wTour", class:"fa-chess-rook",type:"Tour"},
    bRoi: { x: 3, y: 7, name: "bRoi",class:"fa-chess-king",type:"Roi"},
  });
 return army
}

// IIc - Modifies the state object-----------------------------
function movePiece(evt) {
  const myPiece = army[state.piece];
  const newCoords = evt.target.id;
  myPiece.x = Number(newCoords[0]);
  myPiece.y = Number(newCoords[2]);
}

function selectPiece(evt, army) {
  //to be refactored with second player
  //to be refactored if pieces change during the process
  //downstream interaction
  state.piece = army[evt.target.getAttribute("data-piece")].name;
  state.x = army[evt.target.getAttribute("data-piece")].x;
  state.y = army[evt.target.getAttribute("data-piece")].y;
  state.pieceSelected = !state.pieceSelected;
}

function unSelectPiece() {
  state.pieceSelected = !state.pieceSelected;
  state.piece = null;
  state.x = null;
  state.y = null;
}

// IId - Modifies the board-----------------------------
function newCase(evt) {
  const targetCase = evt.target;
  targetCase.setAttribute("data-piece",state.piece)
  
  //copy the classe
  const myClasses = ["fas", army[state.piece].class,state.piece[0]]
  myClasses.forEach((myClass) => targetCase.classList.toggle(myClass))

}

function oldCase() {
  //To be refactored with a better way to retrieve the initial case, maybe a method in the object state?
  const initialCase = document.getElementById(state.x + "," + state.y);
  initialCase.setAttribute("data-piece","") ;
  initialCase.classList.toggle("is-selected");
  
  const myClasses = ["fas", army[state.piece].class,state.piece[0]]
  myClasses.forEach((myClass) => initialCase.classList.toggle(myClass))

}

function checkPiece(evt) {
  if (evt.target.getAttribute("data-piece")) {
    return evt.target.getAttribute("data-piece");
  }
  return false;
}

function selectCase(evt) {
  const clickedBtn = evt.target;
  clickedBtn.classList.toggle("is-selected");
}



//
// III --- Set clickers and event listeners
//btnRemove.onclick = removePieceFromBoard;
btnReset.onclick = playGame;

// IVb --- Initialize pieces
// Restart board contains the initial parameters of the pieces
export let army = restartArmy()

// IVa --- Imports
import {hardCopy} from "./helpers.js"
import{game,playGame} from "./board.js"

// IVc --- Exports

export{placePieces,restartArmy,handleButtonClick}
