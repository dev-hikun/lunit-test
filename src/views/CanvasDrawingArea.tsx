import { getUniqueId, isHover } from 'common/util';
import useShape from 'hooks/useShape';
import { Point, Shape } from 'interface';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const CanvasDrawingArea = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [currentId, setCurrentId] = useState<string>();
  const [shapes, setShapes] = useState<Array<Shape>>([]);

  // redux에 저장하는 shape
  const { shapes: shapesStore, addShape } = useShape();

  // mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (canvas && wrap) {
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.strokeStyle = 'black';
        context.fillStyle = 'transparent';
        context.lineWidth = 2.5;
        setCtx(context);
      }
    }
  }, []);

  // shape를 그려준다.
  useEffect(() => {
    if (ctx) {
      for (const shape of shapes) {
        ctx.beginPath();
        for (const { x, y } of shape.points) {
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  }, [shapes, ctx]);

  // shape가 변경될 때마다 다 그려진 녀석들을 store에 저장한다.
  const onChangeShape = useCallback(() => {
    if (shapes.length === 0) return;
    for (const shape of shapes) {
      const points = shape.points;
      const first = points[0];
      const last = points[points.length - 1];
      if (points.length > 1 && first.x === last.x && first.y === last.y) {
        if (shapesStore.findIndex((shapeStore) => shapeStore.id === shape.id) > -1) continue;
        addShape(shape);
      }
    }
  }, [shapes]);

  // shape이 바뀌었을 때
  useEffect(() => {
    onChangeShape();
  }, [onChangeShape]);

  // canvas 위에서의 마우스
  const mouseOnCanvas = useCallback(
    ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (!ctx) return;
      const { offsetX: x, offsetY: y } = nativeEvent;

      // drawing mode가 아닐 때
      if (!currentId) {
        for (const shape of shapesStore) {
          const hover = isHover({ x, y }, shape);
          console.log(shape.id, hover);
          if (hover) return shape.id;
        }
        return;
      }

      // drawing 모드일 때
      const findObject = shapes.find((item) => item.id === currentId);
      const target: Array<Point> = findObject ? [...findObject.points] : [];
      target.push({ x, y });
      setShapes([...shapes.filter((shape) => shape.id !== currentId), { id: currentId, points: target }]);
    },
    [ctx, currentId, shapes],
  );

  // 마우스 클릭을 시작할 때
  const startDrawing = useCallback(() => {
    setCurrentId(getUniqueId());
  }, []);

  // 마우스를 뗐을 때 or canvas 밖으로 마우스가 나갔을 때
  const finishDrawing = useCallback(() => {
    const target = shapes.find((item) => item.id === currentId);
    if (target) {
      // 제일 첫 점과 이어 준 후 현재 도형을 끝낸다.
      const { x, y } = target.points[0];
      target.points.push({ x, y });
      setShapes([...shapes.filter((shape) => shape.id !== target.id), target]);
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
