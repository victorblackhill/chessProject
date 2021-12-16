# chessProject
Ironhack project 1

**Questions for TAs**
- data-attribute with "" vs eliminating the data attribute

**Prios**
**TO-DO in chessGame**
- Clean unused classes : eliminated populateBoard
- Clean unused harcopies of populateNewBoard
- Separate big methods: doTurn, menaceKing

**Files**
- index.html : calls the board.js script
- styles.css : single styles file
- board.js : the board without the pieces, calls the rest of the files
- piecesInboard.js : interactions of the pieces of the board
- chessGame.js : the Chessy class (THE game)
- helpers.js : functions used in different files to make tasks easier

**To do :CSS improvements**
- Allow board to adapt to the size of the screen
- ~~Adapt the size of the icons~~
- Hover over the cases
- ~~Change the aqua blue~~
- Improve display when stalemate (and other win conditions)
- Improve coach's text
- Add animations : with animista for example
- Check what I can do with Canvas
- Improve the win conditions and stalemate display

**O. TO-DO in board.js**
- Transfer un-used buttons to pieces in board or another file or repatriate the buttons to this file
- Check if the Id's are actually used, if not, simplify twoDimSimpleMatrix or eliminate
- Move place the callback to placePieces to piecesInBoard

**O. TO-DO in pieces.board**
- ~~Replace text.content with the a data-piece attribute~~
- Decide what to do with removePieceFromBoard
- Refactor MovePiece
    //to-do: add something for 2 players(in the state probably)
    //to-do: refactor adding a specific retrieveCase and retrieveCaseID and coordinates
- Refactor SelectPiece
    //to be refactored with second player
    //to be refactored if pieces change during the process
- Refactor CheckPiece
    //Change name : the interaction corresponds to the board, not to the state or the army
    //because we are going to evolve text how the cases interact with the pieces
    
**TO-DO in chessGame**
- Minuciously refactor the game
- Major improvement : Increments rather than full board calculation
- Major improvement : battle dynamics
- Major improvement : Add other pieces
- refactor structures of the armies
- refactor structures of the statusDraw and Check??
- Use the helper functions to refactor overall code (many loops for example)
- Clean all the console logs
- Clean to-do's in the OLD file
- Eliminate two versions casesMenacedRook and computeMenaceRook
- Refactor menaceLines and the rest
- Use different words when a piece is called as a piece object or as a string

**To-Do in helpers.js**
- take some functions from the game that are helpers and put them here


**DONE LOG**
- ~~Separate big methods: applyCheckDraw into applyCheckDraw and canPieceMove~~
- ~~Added properties to calculate the cases menaced by a certain piece~~
- ~~Reordering methods within chessGame~~
- ~~Fix bug in pieceCanMove (the stalemateBug) by evaluating possible moves of each King in a temporary virtual board where the King was extracted with extractPiece: that way the position just behind him is going to be considered menaced nevertheless, adding extractPiece method was necessary~~
