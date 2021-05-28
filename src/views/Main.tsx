import Switch from 'components/Switch';
import useShape from 'hooks/useShape';
import { Mode } from 'interface';
import React, { useCallback, useState } from 'react';
import CanvasDrawingArea from './CanvasDrawingArea';

const Main = () => {
  const { shapes } = useShape();
  const [mode, setMode] = useState<Mode>('drawing');

  const onChangeMode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked === true) setMode('delete');
    else setMode('drawing');
  }, []);

  return (
    <div className="drawing-wrap">
      <div className="canvas-wrap">
        <div className="canvas-button-area">
          <Switch label="Delete mode" checked={mode === 'delete'} onChange={onChangeMode} />
        </div>
        <CanvasDrawingArea mode={mode} />
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
