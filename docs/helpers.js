// List of functions used in different files to make tasks easier
// All functions are going to be exported 

export function hardCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

export function virtualBoard(hauteur, largeur) {
    const myVirtualBoard = [];
  
    for (let i = 0; i < hauteur; i++) {
      myVirtualBoard[i] = [];
      for (let j = 0; j < largeur; j++) {
        const myCase = {
          occupiedBy: false,
          menacedByWhites: false,
          menacedByBlacks: false,
        };
  
        myVirtualBoard[i].push(myCase);
      }
    }
  
    return myVirtualBoard;
  }
  
export function compareCases([a, b], [x, y]) {
    return a === x && b === y;
  }

