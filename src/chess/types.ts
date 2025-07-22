export type PieceType = 'General' | 'Guard' | 'Rook' | 'Horse' | 'Cannon' | 'Elephant' | 'Soldier';
export type PieceColor = 'Red' | 'Black';

export interface Piece {
    type: PieceType;
    color: PieceColor;
    position: [number, number]; // [row, col]
}

export interface MoveResult {
    legal: boolean;
    reason?: string;
    win?: boolean;
    winner?: 'Red' | 'Black';
}

export interface BoardState {
    pieces: Piece[];
}
