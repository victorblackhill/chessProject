/*O. TO-DO in board.js
- Clean unused classes
- Clean unused harcopies of populateNewBoard
- Separate big methods: doTurn,menaces...
- Minuciously refactor the game
- Major improvement : increments rather than full board calculation
- Major improvement : battle dynamics
- Add other pieces
- Use the helper functions to refactor overall code (many loops for example)
- Fix bug (checkmate not working if the king is not against a wall)
    // Verify that the king considers his own place as occupied andor menaced
- Clean all the console logs

*/

// 0 this file contains the game itself

// II - Game Class
class Chessy {
  constructor(
    whiteArmy,
    blackArmy,
    turn,
    gameBoard,
    nextGameBoard,
    check,
    nextCheck
  ) {
    //At all moments, the army are the "physical pieces"
    this.whiteArmy = { wRoi: army["wRoi"], wTour: army["wTour"] };
    this.blackArmy = { bRoi: army["bRoi"] };
    this.turn = "w";

    //this is the actual gameBoard, validated
    this.gameBoard = virtualBoard(x, y);
    this.check = { w: false, b: false };
    this.draw = { w: false, b: false };
    //this board is used to validate moves, at the end of validation, the Game Board "is pushed into the board"
    //this.nextGameBoard = virtualBoard(hauteur, largeur);
    //this.nextCheck = { w: false, b: false };
    //this.nextDraw = { w: false, b: false };
  }

  //Mecanics that will allow pieces to influence the board

  //This is used to make sure that the references are recalculated between turns
  updateReferences() {
    this.whiteArmy = { wRoi: army["wRoi"], wTour: army["wTour"] };
    this.blackArmy = { bRoi: army["bRoi"] };
  }

  //Pieces occupies a space
  occupyCases(aPiece, board) {
    board[aPiece.x][aPiece.y].occupiedBy = aPiece.name;
  }
  //returns an array with the cases menaced by a piece supposed to be a King
  computeMenaceKing(aPiece, board) {
    console.log("pieceagain", aPiece);
    const x = aPiece.x;
    const y = aPiece.y;
    const menacedSpaces = [];
    let piece = [];

    //To-do : refactor with higher order functions and starting the counts at -1 and x-1
    for (let line = 0; line <= 7; line++) {
      for (let column = 0; column <= 7; column++) {
        //This is the specific condition of a King in terms of menace
        //for king menaces his own space as cannot be killed
        if (Math.abs(line - x) <= 1 && Math.abs(column - y) <= 1) {
          menacedSpaces.push([line, column]);

          if (board[line][column].occupiedBy) {
            piece.push(board[line][column].occupiedBy);
          }
        }
      }
    }
    return [menacedSpaces, piece];
  }
  //returns an array with the cases menaced by a piece supposed to be a Rook
  computeMenaceRook(aPiece, board) {
    const res = [];
    res[0] = [];
    res[1] = [];

    const menancedLinePlus = this.linePlus(aPiece, board);
    res[0].push(menancedLinePlus[0]);
    res[1].push(menancedLinePlus[1]);

    const menancedLineMinus = this.lineMinus(aPiece, board);
    res[0].push(menancedLineMinus[0]);
    res[1].push(menancedLineMinus[1]);

    const menacedColMinus = this.colMinus(aPiece, board);
    res[0].push(menacedColMinus[0]);
    res[1].push(menacedColMinus[1]);

    const menacedColPlus = this.colPlus(aPiece, board);
    res[0].push(menacedColPlus[0]);
    res[1].push(menacedColPlus[1]);

    //To-do : refactor with higher order functions

    /*
      for(let line =0;line<=7;line++){
        for(let column = 0; column <= 7; column++){
          //This is the specific condition of a Rook in terms of menace
          if((x===line || y === column) && ((line-x)||(column-y))){
            menacedSpaces.push([line,column])
          }
  
          //// IMPORTANT = add break for any other blocking piece!
            /// for let line x + 1 line +++
            /// for let line x -1, line --
            ///break 
        }
      }
      */

    return res;
  }

  casesMenacedRook(aPiece, board) {
    const res = [];
    const twoDimTable = this.computeMenaceRook(aPiece, board);
    for (let myLine of twoDimTable[0]) {
      for (let myCase of myLine) {
        res.push(myCase);
      }
    }
    return res;
  }

  //lets you calculate which pieces are menaced by the current piece in the current board
  //returns [[case][case][case][case],menaced piece or ""]
  //Idem for lineMinus(){}, colPlus(){}, colMoins(){}
  //pieces are not menaced if protected by other pieces (break in the algorithm)
  linePlus(aPiece, board) {
    const menacedSpaces = [];
    let piece = "";

    const x = aPiece.x;
    const y = aPiece.y;

    for (let line = x + 1; line <= 7; line++) {
      menacedSpaces.push([line, y]);
      if (board[line][y].occupiedBy) {
        piece = board[line][y].occupiedBy;
        break;
      }
    }

    return [menacedSpaces, piece];
  }

  lineMinus(aPiece, board) {
    const menacedSpaces = [];
    let piece = "";

    const x = aPiece.x;
    const y = aPiece.y;

    for (let line = x - 1; line >= 0; line--) {
      menacedSpaces.push([line, y]);
      if (board[line][y].occupiedBy) {
        piece = board[line][y].occupiedBy;
        break;
      }
    }

    return [menacedSpaces, piece];
  }

  colPlus(aPiece, board) {
    const menacedSpaces = [];
    let piece = "";

    const x = aPiece.x;
    const y = aPiece.y;

    for (let column = y + 1; column <= 7; column++) {
      menacedSpaces.push([x, column]);
      if (board[x][column].occupiedBy) {
        piece = board[x][column].occupiedBy;
        break;
      }
    }

    return [menacedSpaces, piece];
  }

  colMinus(aPiece, board) {
    const menacedSpaces = [];
    let piece = "";

    const x = aPiece.x;
    const y = aPiece.y;

    for (let column = y - 1; column >= 0; column--) {
      menacedSpaces.push([x, column]);
      if (board[x][column].occupiedBy) {
        piece = board[x][column].occupiedBy;
        break;
      }
    }

    return [menacedSpaces, piece];
  }

  //Calculates the status of the board
  //status is check or nextCheck{w:,b:}
  applyCheckDraw(board, statusCheck, statusDraw) {
    //Check if Whites in check
    //to do : refactor when more pieces will be added
    const menacedbyBKing = this.computeMenaceKing(this.blackArmy.bRoi, board);
    statusCheck.w = Boolean(menacedbyBKing[1].includes("wRoi"));

    //Check if Blacks in check
    //to do : refactor when more pieces will be added
    const menacedbyWKing = this.computeMenaceKing(this.whiteArmy.wRoi, board);
    const menacedbyWRook = this.computeMenaceRook(this.whiteArmy.wTour, board);
    statusCheck.b = Boolean(
      menacedbyWRook[1].includes("bRoi") + menacedbyWKing[1].includes("bRoi")
    );

    //Check if White King can still move

    let wPossible = menacedbyWKing[0];

    //filter places menaced by the other
    for (let myCase of menacedbyBKing[0]) {
      wPossible = wPossible.filter((pos) => !compareCases(pos, myCase));
    }

    //filter space occupiedby King
    const wKingSpace = [this.whiteArmy.wRoi.x, this.whiteArmy.wRoi.y];
    wPossible = wPossible.filter((pos) => !compareCases(pos, wKingSpace));

    //filter space occupied by own Rook

    const rookSpace = [this.whiteArmy.wTour.x, this.whiteArmy.wTour.y];
    wPossible = wPossible.filter((pos) => !compareCases(pos, rookSpace));

    //CheckIfBKing can move

    let bPossible = menacedbyBKing[0];
    for (let myCase of menacedbyWKing[0]) {
      bPossible = bPossible.filter((pos) => !compareCases(pos, myCase));
    }

    for (let myLine of menacedbyWRook[0]) {
      for (let myCase of myLine) {
        bPossible = bPossible.filter((pos) => !compareCases(pos, myCase));
      }
    }

    //filter space occupied by king himself
    const bKingSpace = [this.blackArmy.bRoi.x, this.blackArmy.bRoi.y];
    bPossible = bPossible.filter((pos) => !compareCases(pos, bKingSpace));

    //each player is in draw mode if their King cannot move
    statusDraw.b = !bPossible[0];
    statusDraw.w = !wPossible[0];

    return {
      w: { check: statusCheck.w, draw: statusDraw.w },
      b: { check: statusCheck.b, draw: statusDraw.b },
    };
  }



  //status du board for me, at the beggining of the turn : "nominal," "échec", "mat"


  //How the turn is going to advance
  //the player has already suggested a move
  //This is the main method, from which everything else is explained :D
  doTurn() {
    const player = game.turn;
    const opponent = player === "w" ? "b" : "w";

    const nextGameB = this.populateNewBoard();
    let nextC = hardCopy(this.check);
    let nextD = hardCopy(this.draw);

    //Take into account the position of the piecesto verify the moove's validity
    const nextStatus = this.applyCheckDraw(nextGameB, nextC, nextD);
    const isPlayerCheck = nextStatus[player].check;
    const isPlayerDraw = nextStatus[player].draw;

    //verify if the move is accepted by the piece
    //To-Do: refactor as for the moment we are verifying ALL pieces, even the ones that don't move
    const isAccepted =
      this.validateMove(this.whiteArmy.wRoi, this.gameBoard) &&
      this.validateMove(this.whiteArmy.wTour, this.gameBoard) &&
      this.validateMove(this.blackArmy.bRoi, this.gameBoard);
      
    console.log(this.findPiece("bRoi", game.gameBoard));
    if (isAccepted && !isPlayerCheck) {
      // Next is validated if the player is not in check
      // In that case Next "se déverse" into the actual board if Next is validated
      this.gameBoard = hardCopy(nextGameB);
      this.check = hardCopy(nextC);
      this.draw = hardCopy(nextD);

      //RENDER Not necessary as the move comes from the board

      //it is therefore already rendered

      //Check if the present player has won
      const isOpponentCheck = nextStatus[opponent].check;
      const isOpponentDraw = nextStatus[opponent].draw;

      console.log(opponent, "c :", isOpponentCheck, "d :", isOpponentDraw);
      //WIN CONDITIONS - IMPORTANT
      if (isOpponentCheck && isOpponentDraw) {
        return player + " Won!";
      } else if (!isOpponentCheck && isOpponentDraw) {
        return "Stalemate!";
      } else {
        this.changePlayer();
        return isOpponentCheck
          ? "Check ! Now " + this.turn + " can defend"
          : "Now " + this.turn + " can play";
      }
      //End turn, id est : Change player
    } else {
      //go back to the former version of the game (the one stored in this.gameBoard)
      this.undoMove();
      //RENDER
      renderBoard(x, y);
      console.log(">> Army", army);
      placePieces(army, theBoard);
      //restart turn
      return this.turn + " Please replay";
    }
  }

  //Change turn after a new gameBoard is recalculated
  changePlayer() {
    if (this.turn === "w") {
      this.turn = "b";
    } else if (this.turn === "b") {
      this.turn = "w";
    }
    return this.turn;
  }

  //this method populates the board with the actual pieces
  //improve when add more pieces
  populateBoard(board) {
    game.occupyCases(game.blackArmy.bRoi, board);
    game.occupyCases(game.whiteArmy.wTour, board);
    game.occupyCases(game.whiteArmy.wRoi, board);
    return board;
  }

  populateNewBoard() {
    const newBoard = hardCopy(virtualBoard(x, y));
    game.occupyCases(game.blackArmy.bRoi, newBoard);
    game.occupyCases(game.whiteArmy.wTour, newBoard);
    game.occupyCases(game.whiteArmy.wRoi, newBoard);
    return newBoard;
  }

  undoMove() {
    for (let piece in this.whiteArmy) {
      const pos = this.findPiece(piece, game.gameBoard);

      army[piece].x = pos.x;
      army[piece].y = pos.y;
    }
    for (let piece in this.blackArmy) {
      const pos = this.findPiece(piece, game.gameBoard);

      army[piece].x = pos.x;
      army[piece].y = pos.y;
      console.log("army >>>", army, pos);
    }

    return army;
  }

  validateMove(aPiece, board) {
    const oldPlaceObj = this.findPiece(aPiece.name, board);
    console.log(">>", aPiece.name, board);
    const oldPlace = [oldPlaceObj.x, oldPlaceObj.y];
    const newPlace = [army[aPiece.name].x, army[aPiece.name].y];
    let menacedSpaces;
    if (compareCases(oldPlace, newPlace)) {
      return true;
    }

    //If moving a Rook
    if (aPiece.name[1] === "T") {
      menacedSpaces = this.casesMenacedRook(aPiece, board);
    }

    //If moving a King
    if (aPiece.name[1] === "R") {
      menacedSpaces = this.computeMenaceKing(aPiece, board)[0];
    }
    console.log(menacedSpaces, oldPlace);

    return menacedSpaces.reduce((preV, presV) => {
      console.log(
        "inside reduce",
        preV,
        presV,
        oldPlace,
        compareCases(presV, [oldPlace.x, oldPlace.y])
      );
      return Boolean(preV + compareCases(presV, oldPlace));
    }, 0);
  }

  //method to find the position of a piece within the board
  findPiece(aPiece, board) {
    let res = null;

    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        const myCase = board[i][j];
        if (myCase.occupiedBy === aPiece) {
          res = {};
          res.x = i;
          res.y = j;
          break;
        }
      }
      if (res) {
        break;
      }
    }
    return res;
  }
}

// IVa - Imports
import { hardCopy, virtualBoard, compareCases } from "./helpers.js";
import { army } from "./piecesInBoard.js";
import { x, y, game, renderBoard, placePieces, theBoard } from "./board.js";

// IVb - Initialisation
//const game = new Chessy()

// IVc - Exports
export { Chessy };
