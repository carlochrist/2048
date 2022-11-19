import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  board: string[][] = new Array();
  oldBoardState: string[][] = new Array();
  atLeastOneBlockMoved = false;

  flag: boolean = true;
  // items = ["item 1", "item 2", "item 3"];
  state: string = "move";

  locked = false;

  animationDisabled = true;

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    // console.log(this.board)
    for (var i: number = 0; i < 4; i++) {
      this.board[i] = [];
      for (var j: number = 0; j < 4; j++) {
        this.board[i][j] = '';
      }
    }

    // init with two rnd-values
    this.createNewRandomNumberAndField(2);
    this.placeNewNumber()
    this.createNewRandomNumberAndField();
    this.placeNewNumber()

    // this.board[0][0] = '16'
    // this.board[0][1] = '16'
    // this.board[0][2] = '16'
    // this.board[0][3] = '16'
    // this.board[1][0] = '8'
    // this.board[1][1] = '16'
    // this.board[1][2] = '8'
    // this.board[1][3] = '4'
    // this.board[2][0] = '16'
    // this.board[2][1] = '16'
    // this.board[2][2] = '16'
    // this.board[2][3] = '4'
    // this.board[3][0] = '16'
    // this.board[3][1] = '16'
    // this.board[3][2] = '16'
    // this.board[3][3] = '4'
  }

  randomEmptyBlock: any;
  newNumberToPlace: any;

  createNewRandomNumberAndField(numberToPlace?: number) {
    let emptyBlocks: any[] = [];
    let filledBlocks: any[] = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === '') {
          emptyBlocks.push([i, j])
        } else {
          filledBlocks.push([i, j])
        }
      }
    }
    // console.log("emptyblocks: ", emptyBlocks)
    // console.table(filledBlocks)
    // game lost
    emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)];
    // debugger;
    this.newNumberToPlace = numberToPlace ? numberToPlace.toString() : [2, 4][Math.floor(Math.random() * 2)].toString();
    this.randomEmptyBlock = emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)];
    // this.board[emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)][0]][emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)][1]] = newNumberToPlace;
    // this.board[this.randomEmptyBlock[0][this.randomEmptyBlock[1]]] = this.newNumberToPlace;
  }

  checkBlock(i: number, j: number) {
    return (this.randomEmptyBlock[0] === i && this.randomEmptyBlock[1] === j);
  }

  placeNewNumber() {

    if (this.flag) {
      // Enabling Animation
      this.flag = !this.flag;
    }

    this.board[this.randomEmptyBlock[0]][this.randomEmptyBlock[1]] = this.newNumberToPlace;
    // console.clear();
    // console.log("newNumberToPlace: ", this.newNumberToPlace)
    // console.log("randomEmptyBlock: ", this.randomEmptyBlock)
    // console.table(this.oldBoardState)
    this.oldBoardState = this.board;
    // this.randomMove();
    // this.createNewRandomNumberAndField();

    if (this.isLost()) {
      setTimeout(() => {
        alert("YOU LOST!")
      }, 1);
    }

    this.animationDisabled = true;

  }

  isLost(): boolean {
    let emptyBlocks: any[] = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === '') {
          emptyBlocks.push([i, j])
        }
      }
    }

    let onePairFound = false;

    if (emptyBlocks.length === 0) {
      let transposedArray = this.transposeArray(this.board)

      // check is neighbor is same
      for (let i = 0; i < this.board.length; i++) {
        if ((this.checkRightNeighborForSimilarity(this.board[i])
          || this.checkRightNeighborForSimilarity(transposedArray[i])
        )) {
          onePairFound = true
        }
      }

      if (!onePairFound) {
        return true;
      }

    }
    return false;
  }

  checkRightNeighborForSimilarity(row: any): boolean {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        return true;
      }
    }
    return false;
  }

  randomMove() {
    const functions = [
      'this.moveLeft()',
      'this.moveRight()',
      'this.moveUp()',
      'this.moveDown()'
    ]
    const rndFnc = functions[Math.floor(Math.random() * functions.length)];
    console.log(rndFnc)
    eval(rndFnc.toString())
    this.createNewRandomNumberAndField();
  }


  onSwipe(evt: any) {
    this.atLeastOneBlockMoved = false;

    const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left') : '';
    const y = Math.abs(evt.deltaY) > 40 ? (evt.deltaY > 0 ? 'down' : 'up') : '';

    // if keyboard is locked: exit keydown handler
    if (this.locked) {
      return;
    }

    // lock keyboard input
    this.locked = true;

    if (x === 'left') {
      this.moveLeft();
    }
    if (x === 'right') {
      this.moveRight()
    }
    if (y === 'up') {
      this.moveUp();
    }
    if (y === 'down') {
      this.moveDown();
    }

    // allow swipes after 300 ms
    setTimeout(() => { this.locked = false; }, 600);

    if (this.atLeastOneBlockMoved) {
      this.createNewRandomNumberAndField();
      this.placeNewNumber()
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    // if keyboard is locked: exit keydown handler
    if (this.locked) {
      console.log("LOCKED!!!")
      return;
    }

    // lock keyboard input
    this.locked = true;

    this.atLeastOneBlockMoved = false;

    // console.log(event.key)
    switch (event.key) {
      case "ArrowLeft": this.moveLeft(); break;
      case "ArrowRight": this.moveRight(); break;
      case "ArrowUp": this.moveUp(); break;
      case "ArrowDown": this.moveDown(); break;
      // default: null;
    }

    // unlock keyboard input after 300 ms
    setTimeout(() => { this.locked = false; }, 300);

    if (this.atLeastOneBlockMoved) {
      this.createNewRandomNumberAndField();
      this.placeNewNumber()
    }
  }

  setNewRandomNumber() {
    // setTimeout(() => {
    this.createNewRandomNumberAndField();
    // console.table(this.board)
    // }, 300)
  }

  moveLeft(checkOnly: boolean = false) {
    for (let i = 0; i < this.board.length; i++) {
      this.checkRow(this.invertRow(this.board[i]), checkOnly)
      this.invertRow(this.board[i]);
    }
  }

  moveRight(checkOnly: boolean = false) {
    for (let i = 0; i < this.board.length; i++) {
      this.checkRow(this.board[i], checkOnly)
    }
  }

  moveUp(checkOnly: boolean = false) {
    const transposedArray = this.transposeArray(this.board)
    for (let i = 0; i < transposedArray.length; i++) {
      this.checkRow(this.invertRow(transposedArray[i]), checkOnly)
      this.invertRow(transposedArray[i])
    }

    if (this.atLeastOneBlockMoved) {
      this.board = this.transposeArray(transposedArray)
    }
  }

  moveDown(checkOnly: boolean = false) {
    const transposedArray = this.transposeArray(this.board)
    for (let i = 0; i < transposedArray.length; i++) {
      this.checkRow(transposedArray[i], checkOnly)
    }
    if (this.atLeastOneBlockMoved) {
      this.board = this.transposeArray(transposedArray)
    }
  }

  invertRow(row: any) {
    return row.reverse();
  }

  getColumns(board: any) {
    let column = [];
    for (let i = 0; i < board.length; i++) {
      column.push(board[i][0])
    }
    return column;
  }

  transposeArray(array: any) {
    return array[0].map((_: any, colIndex: string | number) => array.map((row: { [x: string]: any; }) => row[colIndex]));
  }

  checkRow(row: any, checkOnly: boolean = false) {
    // debugger;
    let lastValueFound = '';
    let lastEmptyPositionFound = -1;
    for (let i = row.length - 1; i >= 0; i--) {
      if (row[i] !== '') {
        if (lastValueFound !== '') {
          if (row[i] === lastValueFound) {
            if (lastEmptyPositionFound !== -1) {
              if (!checkOnly) {
                row[lastEmptyPositionFound + 1] = (row[i] * 2).toString();
              }
            } else {
              if (!checkOnly) {
                row[i + 1] = (row[i] * 2).toString();
                lastEmptyPositionFound = i;
              }
            }
            if (!checkOnly) {
              row[i] = '';
              lastValueFound = '';
            }
            this.atLeastOneBlockMoved = true;
          } else {
            if (lastEmptyPositionFound !== -1) {
              if (!checkOnly) {
                row[lastEmptyPositionFound] = row[i];
                lastValueFound = row[i];
                row[i] = '';
                lastEmptyPositionFound = i
              }
              this.atLeastOneBlockMoved = true;
            } else {
              if (!checkOnly) {
                lastValueFound = row[i];
              }
            }
          }
        }
        else {
          if (lastEmptyPositionFound !== -1) {
            if (!checkOnly) {
              row[lastEmptyPositionFound] = row[i];
              lastValueFound = row[i];
              row[i] = '';
              lastEmptyPositionFound--;
            }
            this.atLeastOneBlockMoved = true;
          } else {
            if (!checkOnly) {
              lastValueFound = row[i];
            }
          }
        }
      } else {
        if (i > lastEmptyPositionFound) {
          if (!checkOnly) {
            lastEmptyPositionFound = i;
          }
        }
      }
    }
  }

}



