import Switch from 'components/Switch';
import React from 'react';

const Main = () => {
  return (
    <div className="drawing-wrap">
      <div className="canvas-wrap">
        <div className="canvas-button-area">
          <Switch label="Delete mode" />
        </div>
        <div className="canvas-drawing-area">
          <canvas />
        </div>
      </div>
      <div className="list-wrap">test</div>
    </div>
  );
};
export default Main;
