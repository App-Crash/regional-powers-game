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
      colStart: 4,   // Full western spread (Pacific / Colombia)
      colEnd: 15,    // Expanded eastern spread (Venezuela & NW Brazil)
      rowStart: 2,   // Includes northern Caribbean coast (Caracas / Maracaibo)
      rowEnd: 10,    // Full southern coverage (keeps bottom intact)
    };
  }

  public getActiveTiles(): { col: number; row: number; path: string }[] {
    const activeTiles = [];
    for (let row = this.bounds.rowStart; row <= this.bounds.rowEnd; row++) {
      for (let col = this.bounds.colStart; col <= this.bounds.colEnd; col++) {
        activeTiles.push({
          col,
          row,
          path: `/tiles/tile_${col}_${row}.png`,
        });
      }
    }
    return activeTiles;
  }

  public getBounds(): ViewportBounds {
    return { ...this.bounds };
  }
}