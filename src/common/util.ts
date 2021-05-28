import { Point, Shape } from 'interface';

/**
 * @param {string} prefix - String to prefix ID with
 * @returns {string} id
 */
export const getUniqueId = (prefix = 'lunit') => {
  const uid = new Date().getTime() + Math.random().toString(36).slice(2);
  return `${prefix}-${uid}`;
};

/**
 * @summary 마우스가 내부에 존재하는지의 여부
 * @param {Point} mousePoint current point of mouse on canvas
 * @param {Array<Shape>} coordinate all of coordinate of all of polygon on canvas
 * @returns boolean
 */
export const isHover = ({ x, y }: Point, { points: p }: Shape) => {
  // 기벡 다각형 내부 외부 판별 알고리즘

  // 점 q와 오른쪽 반직선과 다각형과의 교점의 갯수
  let crosses = 0;
  // 해당 점과 완벽히 일치했을 때에는 true
  const findPoint = p.find((point) => point.x === x && point.y === y);
  if (findPoint) return true;

  for (let i = 0; i < p.length; i++) {
    const j = (i + 1) % p.length;

    if (p[i].y > y != p[j].y > y) {
      const atX = ((p[j].x - p[i].x) * (y - p[i].y)) / (p[j].y - p[i].y) + p[i].x;
      if (x < atX) crosses++;
    }
  }

  return crosses % 2 > 0;
};
