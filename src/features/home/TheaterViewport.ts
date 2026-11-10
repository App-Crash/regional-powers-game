export interface ViewportBounds {
  colStart: number;
  colEnd: number; // inclusive
  rowStart: number;
  rowEnd: number; // inclusive
}

export class TheaterViewport {
  private bounds: ViewportBounds;

  constructor(initialBounds?: ViewportBounds) {
    this.bounds = initialBounds || {
      colStart: 2,   // Full western spread
      colEnd: 9,  // Full eastern spread
      rowStart: 3,   // Trim only northern edge overflow
      rowEnd: 10,  // Full southern coverage (keeps bottom intact)
    };
  }

  public getActiveTiles(): { col: number; row: number; path: string }[] {
    const activeTiles = [];
    for (let row = this.bounds.rowStart; row <= this.bounds.rowEnd; row++) {
      for (let col = this.bounds.colStart; col <= this.bounds.colEnd; col++) {
        activeTiles.push({
          col,
          row,
          path: `/tiles/tile_${col}_${row}.png`
        });
      }
    }
    return activeTiles;
  }

  public getBounds(): ViewportBounds {
    return { ...this.bounds };
  }
}