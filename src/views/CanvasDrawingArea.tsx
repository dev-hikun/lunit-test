import { getUniqueId } from 'common/util';
import { Point, Shape } from 'interface';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const CanvasDrawingArea = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [currentId, setCurrentId] = useState<string>();
  const [shapes, setShapes] = useState<Array<Shape>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (canvas && wrap) {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.strokeStyle = 'black';
        context.lineWidth = 2.5;
        setCtx(context);
      }
    }
  }, []);

  const mouseOnCanvas = useCallback(
    ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (!ctx) return;
      const { offsetX, offsetY } = nativeEvent;
      if (!currentId) {
        // select mode
        return;
      }
      const findObject = shapes.find((item) => item.id === currentId);
      const target: Array<Point> = findObject ? [...findObject.shape] : [];
      if (!findObject) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
      } else {
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
      target.push({ x: offsetX, y: offsetY });
      setShapes([...shapes.filter((shape) => shape.id !== currentId), { id: currentId, shape: target }]);
    },
    [ctx, currentId, shapes],
  );

  const startDrawing = useCallback(() => {
    setCurrentId(getUniqueId());
  }, []);

  const finishDrawing = useCallback(() => {
    // 입력이 종료될 경우
    const target = shapes.find((item) => item.id === currentId);
    if (target && ctx) {
      // 제일 첫 점과 이어 준 후 현재 도형을 끝낸다.
      const { x, y } = target.shape[0];
      ctx.lineTo(x, y);
      ctx.stroke();
      setCurrentId(undefined);
    }
  }, [currentId, shapes]);

  return (
    <div className="canvas-drawing-area" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={mouseOnCanvas}
        onMouseLeave={finishDrawing}
      />
    </div>
  );
};
export default CanvasDrawingArea;
