import useShape from 'hooks/useShape';
import React, { useCallback } from 'react';

const List = () => {
  const { shapes, setOver } = useShape();

  // mouse over시
  const onMouseEnter = useCallback((id: string) => setOver(id), []);
  // mouse out시
  const onMouseLeave = useCallback(() => setOver(), []);
  return (
    <ul className="list-li-wrap">
      <li className="list-item-title">Polygon List</li>
      {shapes.map((shape, index) => {
        return (
          <li
            className={`list-item${shape.isOver ? ' list-item-active' : ''}`}
            key={shape.id}
            onMouseEnter={() => onMouseEnter(shape.id)}
            onMouseLeave={onMouseLeave}>{`polygon-${index + 1}`}</li>
        );
      })}
    </ul>
  );
};
export default List;
