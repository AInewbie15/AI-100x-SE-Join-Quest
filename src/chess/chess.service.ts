

import { Piece, BoardState, MoveResult } from './types';

export class ChessService {
  private board: BoardState = { pieces: [] };
  private lastMoveResult: MoveResult | null = null;

  setBoard(board: BoardState) {
    this.board = board;
  }

  movePiece(from: [number, number], to: [number, number]): void {
    const piece = this.getPieceAt(from);
    if (!piece) {
      this.lastMoveResult = { legal: false, reason: 'No piece at source.' };
      return;
    }

    // General
    if (piece.type === 'General') {
      if (!this.isWithinPalace(to, piece.color)) {
        this.lastMoveResult = { legal: false, reason: 'General must stay in palace.' };
        return;
      }
      if (!this.isOneStep(from, to)) {
        this.lastMoveResult = { legal: false, reason: 'General moves one step.' };
        return;
      }
      if (this.generalsFaceEachOther(from, to)) {
        this.lastMoveResult = { legal: false, reason: 'Generals cannot face each other.' };
        return;
      }
      this.lastMoveResult = { legal: true };
      return;
    }

    // Guard
    if (piece.type === 'Guard') {
      if (!this.isWithinPalace(to, piece.color)) {
        this.lastMoveResult = { legal: false, reason: 'Guard must stay in palace.' };
        return;
      }
      if (!this.isDiagonalOneStep(from, to)) {
        this.lastMoveResult = { legal: false, reason: 'Guard moves one step diagonally.' };
        return;
      }
      this.lastMoveResult = { legal: true };
      return;
    }

    // Rook
    if (piece.type === 'Rook') {
      if (!this.isStraightLine(from, to)) {
        this.lastMoveResult = { legal: false, reason: 'Rook moves in straight line.' };
        return;
      }
      if (!this.isPathClear(from, to)) {
        this.lastMoveResult = { legal: false, reason: 'Rook path is blocked.' };
        return;
      }
      // 判斷是否吃掉 General
      const target = this.getPieceAt(to);
      if (target && target.type === 'General' && target.color !== piece.color) {
        this.lastMoveResult = { legal: true, win: true, winner: piece.color === 'Red' ? 'Red' : 'Black' };
        return;
      }
      this.lastMoveResult = { legal: true };
      return;
    }

    // Horse
    if (piece.type === 'Horse') {
      if (!this.isLShape(from, to)) {
        this.lastMoveResult = { legal: false, reason: 'Horse moves in L shape.' };
        return;
      }
      if (this.isHorseLegBlocked(from, to)) {
        this.lastMoveResult = { legal: false, reason: 'Horse leg is blocked.' };
        return;
      }
      this.lastMoveResult = { legal: true };
      return;
    }

    // Cannon
    if (piece.type === 'Cannon') {
      if (!this.isStraightLine(from, to)) {
        this.lastMoveResult = { legal: false, reason: 'Cannon moves in straight line.' };
        return;
      }
      const target = this.getPieceAt(to);
      const screens = this.countScreens(from, to);
      if (!target) {
        if (screens !== 0) {
          this.lastMoveResult = { legal: false, reason: 'Cannon cannot jump without capture.' };
          return;
        }
      } else {
        if (screens !== 1) {
          this.lastMoveResult = { legal: false, reason: 'Cannon must jump exactly one screen to capture.' };
          return;
        }
      }
      this.lastMoveResult = { legal: true };
      return;
    }

    // Elephant
    if (piece.type === 'Elephant') {
      if (!this.isElephantMove(from, to)) {
        this.lastMoveResult = { legal: false, reason: 'Elephant moves two steps diagonally.' };
        return;
      }
      if (this.isElephantBlocked(from, to)) {
        this.lastMoveResult = { legal: false, reason: 'Elephant midpoint is blocked.' };
        return;
      }
      if (this.isElephantCrossRiver(to, piece.color)) {
        this.lastMoveResult = { legal: false, reason: 'Elephant cannot cross river.' };
        return;
      }
      this.lastMoveResult = { legal: true };
      return;
    }

    // Soldier
    if (piece.type === 'Soldier') {
      if (!this.isSoldierMoveLegal(from, to, piece.color)) {
        this.lastMoveResult = { legal: false, reason: 'Illegal Soldier move.' };
        return;
      }
      this.lastMoveResult = { legal: true };
      return;
    }

    this.lastMoveResult = { legal: false, reason: 'Unknown piece type.' };
  }

  getLastMoveResult(): MoveResult | null {
    return this.lastMoveResult;
  }

  // --- Helper methods ---
  private getPieceAt([row, col]: [number, number]): Piece | undefined {
    return this.board.pieces.find(p => p.position[0] === row && p.position[1] === col);
  }

  private isWithinPalace([row, col]: [number, number], color: string): boolean {
    if (color === 'Red') {
      return row >= 1 && row <= 3 && col >= 4 && col <= 6;
    } else {
      return row >= 8 && row <= 10 && col >= 4 && col <= 6;
    }
  }

  private isOneStep([r1, c1]: [number, number], [r2, c2]: [number, number]): boolean {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  }

  private generalsFaceEachOther([fromRow, fromCol]: [number, number], [toRow, toCol]: [number, number]): boolean {
    // Check if after move, Generals face each other on the same file with no pieces between
    const otherGeneral = this.board.pieces.find(p => p.type === 'General' && p.color !== this.getPieceAt([fromRow, fromCol])?.color);
    if (!otherGeneral) return false;
    if (toCol !== otherGeneral.position[1]) return false;
    const [start, end] = [toRow, otherGeneral.position[0]].sort((a, b) => a - b);
    for (let r = start + 1; r < end; r++) {
      if (this.getPieceAt([r, toCol])) return false;
    }
    return true;
  }

  private isDiagonalOneStep([r1, c1]: [number, number], [r2, c2]: [number, number]): boolean {
    return Math.abs(r1 - r2) === 1 && Math.abs(c1 - c2) === 1;
  }

  private isStraightLine([r1, c1]: [number, number], [r2, c2]: [number, number]): boolean {
    return r1 === r2 || c1 === c2;
  }

  private isPathClear([r1, c1]: [number, number], [r2, c2]: [number, number]): boolean {
    if (r1 === r2) {
      const [min, max] = [c1, c2].sort((a, b) => a - b);
      for (let c = min + 1; c < max; c++) {
        if (this.getPieceAt([r1, c])) return false;
      }
    } else if (c1 === c2) {
      const [min, max] = [r1, r2].sort((a, b) => a - b);
      for (let r = min + 1; r < max; r++) {
        if (this.getPieceAt([r, c1])) return false;
      }
    } else {
      return false;
    }
    return true;
  }

  private isLShape([r1, c1]: [number, number], [r2, c2]: [number, number]): boolean {
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
  }

  private isHorseLegBlocked([r1, c1]: [number, number], [r2, c2]: [number, number]): boolean {
    const dr = r2 - r1;
    const dc = c2 - c1;
    if (Math.abs(dr) === 2 && Math.abs(dc) === 1) {
      return !!this.getPieceAt([r1 + dr / 2, c1]);
    }
    if (Math.abs(dr) === 1 && Math.abs(dc) === 2) {
      return !!this.getPieceAt([r1, c1 + dc / 2]);
    }
    return false;
  }

  private countScreens([r1, c1]: [number, number], [r2, c2]: [number, number]): number {
    let count = 0;
    if (r1 === r2) {
      const [min, max] = [c1, c2].sort((a, b) => a - b);
      for (let c = min + 1; c < max; c++) {
        if (this.getPieceAt([r1, c])) count++;
      }
    } else if (c1 === c2) {
      const [min, max] = [r1, r2].sort((a, b) => a - b);
      for (let r = min + 1; r < max; r++) {
        if (this.getPieceAt([r, c1])) count++;
      }
    }
    return count;
  }

  private isElephantMove([r1, c1]: [number, number], [r2, c2]: [number, number]): boolean {
    return Math.abs(r1 - r2) === 2 && Math.abs(c1 - c2) === 2;
  }

  private isElephantBlocked([r1, c1]: [number, number], [r2, c2]: [number, number]): boolean {
    const mid: [number, number] = [(r1 + r2) / 2, (c1 + c2) / 2];
    return !!this.getPieceAt(mid);
  }

  private isElephantCrossRiver([row, _col]: [number, number], color: string): boolean {
    if (color === 'Red') {
      return row > 5;
    } else {
      return row < 6;
    }
  }

  private isSoldierMoveLegal([r1, c1]: [number, number], [r2, c2]: [number, number], color: string): boolean {
    const dr = r2 - r1;
    const dc = c2 - c1;
    if (color === 'Red') {
      if (r1 <= 5) {
        // Before crossing river: can only move forward
        return dr === 1 && dc === 0;
      } else {
        // After crossing river: can move forward or sideways, but not backward
        return (dr === 1 && dc === 0) || (dr === 0 && Math.abs(dc) === 1);
      }
    } else {
      if (r1 >= 6) {
        // Before crossing river: can only move forward (down)
        return dr === -1 && dc === 0;
      } else {
        // After crossing river: can move forward or sideways, but not backward
        return (dr === -1 && dc === 0) || (dr === 0 && Math.abs(dc) === 1);
      }
    }
  }
}

