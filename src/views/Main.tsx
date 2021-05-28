import Switch from 'components/Switch';
import React from 'react';
import CanvasDrawingArea from './CanvasDrawingArea';

const Main = () => {
  return (
    <div className="drawing-wrap">
      <div className="canvas-wrap">
        <div className="canvas-button-area">
          <Switch label="Delete mode" />
        </div>
        <CanvasDrawingArea />
      </div>
      <div className="list-wrap">test</div>
    </div>
  );
};
export default Main;
