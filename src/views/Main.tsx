import Switch from 'components/Switch';
import useShape from 'hooks/useShape';
import React from 'react';
import CanvasDrawingArea from './CanvasDrawingArea';

const Main = () => {
  const { shapes } = useShape();
  return (
    <div className="drawing-wrap">
      <div className="canvas-wrap">
        <div className="canvas-button-area">
          <Switch label="Delete mode" />
        </div>
        <CanvasDrawingArea />
      </div>
      <div className="list-wrap">
        <ul>
          {shapes.map((shape, index) => {
            return <li key={shape.id}>{`polygon-${index + 1}`}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};
export default Main;
