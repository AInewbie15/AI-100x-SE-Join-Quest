
import { Given, When, Then } from '@cucumber/cucumber';
import { ChessService } from '../../src/chess/chess.service';

const chessService = new ChessService();

// Soldier 相關步驟
Given(/^the board is empty except for a Red Soldier at \(\s*(\d+),\s*(\d+)\s*\)$/, function (row: number, col: number) {
  chessService.setBoard({
    pieces: [
      { type: 'Soldier', color: 'Red', position: [row, col] }
    ]
  });
});
When(/^Red moves the Soldier from \(\s*(\d+),\s*(\d+)\s*\) to \(\s*(\d+),\s*(\d+)\s*\)$/, function (fromRow: number, fromCol: number, toRow: number, toCol: number) {
  chessService.movePiece([fromRow, fromCol], [toRow, toCol]);
});

// Elephant 相關步驟
Given(/^the board is empty except for a Red Elephant at \(\s*(\d+),\s*(\d+)\s*\)$/, function (row: number, col: number) {
  chessService.setBoard({
    pieces: [
      { type: 'Elephant', color: 'Red', position: [row, col] }
    ]
  });
});
When(/^Red moves the Elephant from \(\s*(\d+),\s*(\d+)\s*\) to \(\s*(\d+),\s*(\d+)\s*\)$/, function (fromRow: number, fromCol: number, toRow: number, toCol: number) {
  chessService.movePiece([fromRow, fromCol], [toRow, toCol]);
});

// Cannon 相關步驟
Given(/^the board is empty except for a Red Cannon at \(\s*(\d+),\s*(\d+)\s*\)$/, function (row: number, col: number) {
  chessService.setBoard({
    pieces: [
      { type: 'Cannon', color: 'Red', position: [row, col] }
    ]
  });
});
When(/^Red moves the Cannon from \(\s*(\d+),\s*(\d+)\s*\) to \(\s*(\d+),\s*(\d+)\s*\)$/, function (fromRow: number, fromCol: number, toRow: number, toCol: number) {
  chessService.movePiece([fromRow, fromCol], [toRow, toCol]);
});

// Horse 相關步驟
Given(/^the board is empty except for a Red Horse at \(\s*(\d+),\s*(\d+)\s*\)$/, function (row: number, col: number) {
  chessService.setBoard({
    pieces: [
      { type: 'Horse', color: 'Red', position: [row, col] }
    ]
  });
});
When(/^Red moves the Horse from \(\s*(\d+),\s*(\d+)\s*\) to \(\s*(\d+),\s*(\d+)\s*\)$/, function (fromRow: number, fromCol: number, toRow: number, toCol: number) {
  chessService.movePiece([fromRow, fromCol], [toRow, toCol]);
});

// Rook 相關步驟
Given(/^the board is empty except for a Red Rook at \(\s*(\d+),\s*(\d+)\s*\)$/, function (row: number, col: number) {
  chessService.setBoard({
    pieces: [
      { type: 'Rook', color: 'Red', position: [row, col] }
    ]
  });
});
When(/^Red moves the Rook from \(\s*(\d+),\s*(\d+)\s*\) to \(\s*(\d+),\s*(\d+)\s*\)$/, function (fromRow: number, fromCol: number, toRow: number, toCol: number) {
  chessService.movePiece([fromRow, fromCol], [toRow, toCol]);
});

// Guard 相關步驟
Given(/^the board is empty except for a Red Guard at \(\s*(\d+),\s*(\d+)\s*\)$/, function (row: number, col: number) {
  chessService.setBoard({
    pieces: [
      { type: 'Guard', color: 'Red', position: [row, col] }
    ]
  });
});
When(/^Red moves the Guard from \(\s*(\d+),\s*(\d+)\s*\) to \(\s*(\d+),\s*(\d+)\s*\)$/, function (fromRow: number, fromCol: number, toRow: number, toCol: number) {
  chessService.movePiece([fromRow, fromCol], [toRow, toCol]);
});

// General 相關步驟
Given(/^the board is empty except for a Red General at \(\s*(\d+),\s*(\d+)\s*\)$/, function (row: number, col: number) {
  chessService.setBoard({
    pieces: [
      { type: 'General', color: 'Red', position: [row, col] }
    ]
  });
});
When(/^Red moves the General from \(\s*(\d+),\s*(\d+)\s*\) to \(\s*(\d+),\s*(\d+)\s*\)$/, function (fromRow: number, fromCol: number, toRow: number, toCol: number) {
  chessService.movePiece([fromRow, fromCol], [toRow, toCol]);
});

// 支援 table 初始化
Given('the board has:', function (dataTable) {
  const pieces = dataTable.hashes().map((row: any) => {
    const [color, ...typeArr] = row.Piece.split(' ');
    const type = typeArr.join(' ');
    const posMatch = row.Position.match(/\((\d+),\s*(\d+)\)/);
    return {
      type: type as any,
      color: color as any,
      position: [parseInt(posMatch[1], 10), parseInt(posMatch[2], 10)]
    };
  });
  chessService.setBoard({ pieces });
});

// 驗證 move 合法性

Then('Red wins immediately', function () {
  const result = chessService.getLastMoveResult();
  if (!result || !('win' in result) || !result.win || result.winner !== 'Red') {
    throw new Error('Red did not win immediately');
  }
});

Then('the game is not over just from that capture', function () {
  const result = chessService.getLastMoveResult();
  if (!result || ('win' in result && result.win)) {
    throw new Error('Game should not be over');
  }
});
Then('the move is legal', function () {
  const result = chessService.getLastMoveResult();
  if (!result || !result.legal) {
    throw new Error('Move should be legal');
  }
});

Then('the move is illegal', function () {
  const result = chessService.getLastMoveResult();
  if (!result || result.legal) {
    throw new Error('Move should be illegal');
  }
});
