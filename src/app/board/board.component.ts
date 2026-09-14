import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: false,
})
export class BoardComponent implements OnInit {
  board: string[][] = new Array();
  oldBoardState: string[][] = new Array();
  atLeastOneBlockMoved = false;

  flag: boolean = true;
  // items = ["item 1", "item 2", "item 3"];
  state: string = 'move';

  locked = false;

  animationDisabled = true;

  score = 0;
  bestScore = 0;

  constructor() {}

  ngOnInit(): void {
    this.bestScore = this.getBestScore();
    this.newGame();
  }

  newGame() {
    this.score = 0;

    // console.log(this.board)
    for (var i: number = 0; i < 4; i++) {
      this.board[i] = [];
      for (var j: number = 0; j < 4; j++) {
        this.board[i][j] = '';
      }
    }

    // init with two rnd-values
    this.createNewRandomNumberAndField(2);
    this.placeNewNumber();
    this.createNewRandomNumberAndField();
    this.placeNewNumber();

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
          emptyBlocks.push([i, j]);
        } else {
          filledBlocks.push([i, j]);
        }
      }
    }
    // console.log("emptyblocks: ", emptyBlocks)
    // console.table(filledBlocks)
    // game lost
    emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)];
    // debugger;
    this.newNumberToPlace = numberToPlace
      ? numberToPlace.toString()
      : [2, 4][Math.floor(Math.random() * 2)].toString();
    this.randomEmptyBlock =
      emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)];
    // this.board[emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)][0]][emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)][1]] = newNumberToPlace;
    // this.board[this.randomEmptyBlock[0][this.randomEmptyBlock[1]]] = this.newNumberToPlace;
  }

  checkBlock(i: number, j: number) {
    return this.randomEmptyBlock[0] === i && this.randomEmptyBlock[1] === j;
  }

  placeNewNumber() {
    if (this.flag) {
      // Enabling Animation
      this.flag = !this.flag;
    }

    this.board[this.randomEmptyBlock[0]][this.randomEmptyBlock[1]] =
      this.newNumberToPlace;
    // console.clear();
    // console.log("newNumberToPlace: ", this.newNumberToPlace)
    // console.log("randomEmptyBlock: ", this.randomEmptyBlock)
    // console.table(this.oldBoardState)
    this.oldBoardState = this.board;
    // this.randomMove();
    // this.createNewRandomNumberAndField();

    if (this.isLost()) {
      setTimeout(() => {
        alert('YOU LOST!');
      }, 1);
    }

    this.animationDisabled = true;
  }

  isLost(): boolean {
    let emptyBlocks: any[] = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === '') {
          emptyBlocks.push([i, j]);
        }
      }
    }

    let onePairFound = false;

    if (emptyBlocks.length === 0) {
      let transposedArray = this.transposeArray(this.board);

      // check is neighbor is same
      for (let i = 0; i < this.board.length; i++) {
        if (
          this.checkRightNeighborForSimilarity(this.board[i]) ||
          this.checkRightNeighborForSimilarity(transposedArray[i])
        ) {
          onePairFound = true;
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

  private getBestScore(): number {
    const storedBestScore = localStorage.getItem('2048-best-score');
    const parsedBestScore = storedBestScore ? Number(storedBestScore) : 0;

    return Number.isFinite(parsedBestScore) ? parsedBestScore : 0;
  }

  private updateBestScore(): void {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('2048-best-score', String(this.bestScore));
    }
  }

  randomMove() {
    const functions = ['left', 'right', 'up', 'down'];
    const direction = functions[Math.floor(Math.random() * functions.length)];

    switch (direction) {
      case 'left':
        this.moveLeft();
        break;
      case 'right':
        this.moveRight();
        break;
      case 'up':
        this.moveUp();
        break;
      case 'down':
        this.moveDown();
        break;
    }
  }

  onSwipe(evt: any) {
    const deltaX = Math.abs(evt.deltaX || 0);
    const deltaY = Math.abs(evt.deltaY || 0);

    if (deltaX < 40 && deltaY < 40) {
      return;
    }

    let direction: 'left' | 'right' | 'up' | 'down';

    if (deltaX > deltaY) {
      direction = evt.deltaX > 0 ? 'right' : 'left';
    } else {
      direction = evt.deltaY > 0 ? 'down' : 'up';
    }

    this.handleMove(direction);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let direction: 'left' | 'right' | 'up' | 'down' | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
    }

    if (direction) {
      this.handleMove(direction);
    }
  }

  setNewRandomNumber() {
    // setTimeout(() => {
    this.createNewRandomNumberAndField();
    // console.table(this.board)
    // }, 300)
  }

  moveLeft(checkOnly: boolean = false) {
    this.handleMove('left', checkOnly);
  }

  moveRight(checkOnly: boolean = false) {
    this.handleMove('right', checkOnly);
  }

  moveUp(checkOnly: boolean = false) {
    this.handleMove('up', checkOnly);
  }

  moveDown(checkOnly: boolean = false) {
    this.handleMove('down', checkOnly);
  }

  private boardEquals(
    firstBoard: string[][],
    secondBoard: string[][],
  ): boolean {
    return JSON.stringify(firstBoard) === JSON.stringify(secondBoard);
  }

  private moveLine(line: string[]): { line: string[]; gainedScore: number } {
    const values = line.filter((value) => value !== '');
    const merged: string[] = [];
    let gainedScore = 0;
    let index = 0;

    while (index < values.length) {
      const current = values[index];
      const next = values[index + 1];

      if (next !== undefined && next === current) {
        const mergedValue = (Number(current) * 2).toString();
        merged.push(mergedValue);
        gainedScore += Number(mergedValue);
        index += 2;
      } else {
        merged.push(current);
        index += 1;
      }
    }

    while (merged.length < line.length) {
      merged.push('');
    }

    return { line: merged, gainedScore };
  }

  private handleMove(
    direction: 'left' | 'right' | 'up' | 'down',
    checkOnly: boolean = false,
  ) {
    const previousBoard = this.board.map((row) => row.slice());
    let nextBoard = previousBoard.map((row) => row.slice());
    let gainedScore = 0;

    switch (direction) {
      case 'left':
        nextBoard = previousBoard.map((row) => {
          const result = this.moveLine(row);
          gainedScore += result.gainedScore;
          return result.line;
        });
        break;
      case 'right':
        nextBoard = previousBoard.map((row) => {
          const result = this.moveLine([...row].reverse());
          gainedScore += result.gainedScore;
          return result.line.reverse();
        });
        break;
      case 'up':
        nextBoard = this.transposeArray(previousBoard);
        nextBoard = nextBoard.map((column) => {
          const result = this.moveLine(column);
          gainedScore += result.gainedScore;
          return result.line;
        });
        nextBoard = this.transposeArray(nextBoard);
        break;
      case 'down':
        nextBoard = this.transposeArray(previousBoard);
        nextBoard = nextBoard.map((column) => {
          const result = this.moveLine([...column].reverse());
          gainedScore += result.gainedScore;
          return result.line.reverse();
        });
        nextBoard = this.transposeArray(nextBoard);
        break;
    }

    this.atLeastOneBlockMoved = !this.boardEquals(previousBoard, nextBoard);

    if (!this.atLeastOneBlockMoved) {
      this.randomEmptyBlock = null;
      this.newNumberToPlace = null;
      return;
    }

    if (checkOnly) {
      return;
    }

    this.score += gainedScore;
    this.updateBestScore();
    this.board = nextBoard;
    this.createNewRandomNumberAndField();
    this.placeNewNumber();
  }

  invertRow(row: any) {
    return row.reverse();
  }

  getColumns(board: any) {
    let column = [];
    for (let i = 0; i < board.length; i++) {
      column.push(board[i][0]);
    }
    return column;
  }

  transposeArray(array: any) {
    return array[0].map((_: any, colIndex: string | number) =>
      array.map((row: { [x: string]: any }) => row[colIndex]),
    );
  }
}
