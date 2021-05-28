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
  // console.log(id, p);

  // 해당 점과 완벽히 일치했을 때에는 true
  const findPoint = p.find((point) => point.x === x && point.y === y);
  if (findPoint) return true;

  // 임의의 점 q와 오른쪽 반직선과 다각형과의 교점의 갯수
  let crosses = 0;
  for (let i = 0; i < p.length; i = i + 2) {
    // 너무 점이 많으므로 +2
    const j = (i + 2) % p.length;

    // 마우스 포인트의 y좌표가 p[i], p[j] 직선의 사이에 있다면
    if (p[i].y > y != p[j].y > y) {
      // atx = 마우스 포인터를 지나는 수평선과 (p[i], p[j])의 교점
      const atX = ((p[j].x - p[i].x) * (y - p[i].y)) / (p[j].y - p[i].y) + p[i].x;
      // atX가 오른쪽으로 뻗은 반직선과의 교점이 맞을 경우 교점의 갯수 증가
      if (x < atX) crosses++;
    }
  }
  // 반 직선을 그었을 경우에 라인과 만나는 교점이 홀수라면 다각형 내부, 짝수라면 다각형 외부이다.
  return crosses % 2 > 0;
};
