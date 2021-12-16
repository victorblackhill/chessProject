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
    this.menaces = {
      Roi: this.computeMenaceKing,
      Tour: this.computeMenaceRook,
    };
    this.turn = "w";

    //this is the actual gameBoard, validated
    this.gameBoard = virtualBoard(x, y);
    this.check = { w: false, b: false };
    this.draw = { w: false, b: false };
  }

  //A ------ MAIN METHODS ---------------------------------------------------------------------
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
          ? "Check! Now " + this.turn + " can defend"
          : "Now " + this.turn + " can play";
      }
      //End turn, id est : Change player
    } else {
      //go back to the former version of the game (the one stored in this.gameBoard)
      this.undoMove();
      //RENDER
      renderBoard(x, y);
      placePieces(army, theBoard);
      //restart turn
      return this.turn + " Please replay";
    }
  }

  applyCheckDraw(board, statusCheck, statusDraw) {
    //Check if Whites in Check
    statusCheck.w = this.menaceChecking("wRoi", this.blackArmy, board);

    //Check if Blacks in Check
    statusCheck.b = this.menaceChecking("bRoi", this.whiteArmy, board);

    //Check if White King anb B King can move

    //Each king has to extracted for his eval in order to avoid a bug
    const boardWithoutWKing = this.extractPiece("wRoi", board);
    const boardWithoutBKing = this.extractPiece("bRoi", board);

    statusDraw.b = !this.canPieceMove(
      "bRoi",
      this.blackArmy,
      this.whiteArmy,
      boardWithoutBKing
    )[0];
    statusDraw.w = !this.canPieceMove(
      "wRoi",
      this.whiteArmy,
      this.blackArmy,
      boardWithoutWKing
    )[0];

    return {
      w: { check: statusCheck.w, draw: statusDraw.w },
      b: { check: statusCheck.b, draw: statusDraw.b },
    };
  }

  extractPiece(pieceName, board) {
    const newBoard = this.populateNewBoard();
    const coords = this.findPiece(pieceName, newBoard);
    newBoard[coords.x][coords.y].occupiedBy = false;
    return newBoard;
  }

  //Change status of the turn
  changePlayer() {
    if (this.turn === "w") {
      this.turn = "b";
    } else if (this.turn === "b") {
      this.turn = "w";
    }
    return this.turn;
  }

  //B ------ Methods that validate the stages --------------------------------------------------
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
    }

    return army;
  }

  validateMove(aPiece, board) {
    const oldPlaceObj = this.findPiece(aPiece.name, board);
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

    return menacedSpaces.reduce((preV, presV) => {
      return Boolean(preV + compareCases(presV, oldPlace));
    }, 0);
  }

  //C ------ Build the virtual board -----------------------------------------------------------
  //Calledback during initialization and re-rendering of the board
  occupyCases(aPiece, board) {
    board[aPiece.x][aPiece.y].occupiedBy = aPiece.name;
  }

  populateNewBoard() {
    const newBoard = hardCopy(virtualBoard(x, y));
    game.occupyCases(game.blackArmy.bRoi, newBoard);
    game.occupyCases(game.whiteArmy.wTour, newBoard);
    game.occupyCases(game.whiteArmy.wRoi, newBoard);
    return newBoard;
  }

  //D ------- Pieces of the board ---------------------------------------------------------------
  //Add methods here when adding a new piece to the board
  computeMenaceKing(aPiece, board) {
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

  computeMenaceRook(aPiece, board) {
    const res = [];
    res[0] = [];
    res[1] = [];

    const menancedLinePlus = linePlus(aPiece, board);
    res[0] = res[0].concat(menancedLinePlus[0]);
    res[1].push(menancedLinePlus[1]);

    const menancedLineMinus = lineMinus(aPiece, board);
    res[0] = res[0].concat(menancedLineMinus[0]);
    res[1].push(menancedLineMinus[1]);

    const menacedColMinus = colMinus(aPiece, board);
    res[0] = res[0].concat(menacedColMinus[0]);
    res[1].push(menacedColMinus[1]);

    const menacedColPlus = colPlus(aPiece, board);
    res[0] = res[0].concat(menacedColPlus[0]);
    res[1].push(menacedColPlus[1]);

    return res;
  }

  casesMenacedRook(aPiece, board) {
    const res = this.computeMenaceRook(aPiece, board)[0];
    /*
    const twoDimTable = this.computeMenaceRook(aPiece, board);
    for (let myLine of twoDimTable[0]) {
      for (let myCase of myLine) {
        res.push(myCase);
      }
    }
    // Option: const res = [].concat(...twoDimTable[0])
    */
    return res;
  }

  // F ------ Methods applied to compute the menaces ------------------------------------------------
  canPieceMove(pieceName, playerArmy, opponentArmy, board) {
    //take the cases where each piece can moove
    let possibles = this.menaces[playerArmy[pieceName].type](
      playerArmy[pieceName],
      board
    )[0];

    //filter pieces occupied by own pieces, that I CANNOT kill
    let ownPieces = [];
    for (let ownPiece in playerArmy) {
      ownPieces.push([playerArmy[ownPiece].x, playerArmy[ownPiece].y]);
    }

    for (let myCase of ownPieces) {
      possibles = possibles.filter(
        (casePossible) => !compareCases(casePossible, myCase)
      );
    }

    //filter the cases menaced by each piece of the opponent's army
    for (let opPieceName in opponentArmy) {
      const menacedCases = this.menaces[opponentArmy[opPieceName].type](
        opponentArmy[opPieceName],
        board
      )[0];
      for (let myCase of menacedCases) {
        possibles = possibles.filter(
          (casePossible) => !compareCases(casePossible, myCase)
        );
      }
    }

    return possibles;
  }
  //Returns yes if the piece is menaced by any piece of the other army
  menaceChecking(pieceName = String, playerArmy, board) {
    let newStatusCheck = false;
    // a piece is menaced by the other army if
    for (let piece in playerArmy) {
      newStatusCheck =
        this.menaces[playerArmy[piece].type](
          playerArmy[piece],
          board
        )[1].includes(pieceName) || newStatusCheck;
    }
    return newStatusCheck;
  }
  //Returns menaced pieces by the whole army
  menacePieces(playerArmy, board) {
    let list = [];
    // a piece is menaced by the other army if
    for (let piece in playerArmy) {
      list.concat(
        this.menaces[playerArmy[piece].type](
          playerArmy[piece],
          board
        )[1].includes(pieceName)
      );
    }

    return list;
  }

  //Helper functions
  findPiece(pieceName, board) {
    let res = null;

    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        const myCase = board[i][j];
        if (myCase.occupiedBy === pieceName) {
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

// Former methods, I had to put them as helper functions called by computeMenaceRook

function linePlus(aPiece, board) {
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

function lineMinus(aPiece, board) {
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

function colPlus(aPiece, board) {
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

function colMinus(aPiece, board) {
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
