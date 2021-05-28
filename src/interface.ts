export interface Shape {
  id: string;
  points: Array<Point>;
}

export interface ShapeStore extends Shape {
  id: string;
  points: Array<Point>;
  isOver: boolean;
}

export interface Point {
  x: number;
  y: number;
}

interface ModeKey {
  drawing: undefined;
  delete: undefined;
}

export type Mode = keyof ModeKey;
