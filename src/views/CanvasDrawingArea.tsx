import { getUniqueId, isHover } from 'common/util';
import useShape from 'hooks/useShape';
import { Mode, Point, Shape } from 'interface';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type CanvasDrawingArea = {
  mode: Mode;
};

const CanvasDrawingArea = ({ mode }: CanvasDrawingArea) => {
  // canvas의 wrapper
  const wrapRef = useRef<HTMLDivElement>(null);
  // canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // canvas의 context
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  // 현재 드로잉중인 객체의 아이디
  const [currentId, setCurrentId] = useState<string>();
  // 현재 드로잉중인 객체
  const [shapes, setShapes] = useState<Array<Shape>>([]);
  // redux에 저장하는 shape
  const { shapes: shapesStore, addShape, setOver } = useShape();

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
        context.fillStyle = 'blue';
        context.lineWidth = 2.5;
        setCtx(context);
      }
    }
  }, []);

  // 1) 마우스 클릭을 시작할 때
  const startDrawing = useCallback(() => {
    if (mode === 'drawing') setCurrentId(getUniqueId());
    else if (mode === 'delete') console.log('delete mode');
  }, [mode]);

  const clearCanvas = useCallback(() => {
    if (!ctx || !wrapRef.current) return;
    ctx.beginPath();
    ctx.clearRect(0, 0, wrapRef.current.offsetWidth, wrapRef.current.offsetHeight);
  }, [ctx]);

  // 2) canvas 위에서의 마우스 움직일 때
  const mouseOnCanvas = useCallback(
    ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (!ctx) return;
      const { offsetX: x, offsetY: y } = nativeEvent;

      // drawing 중이지 않을때
      if (!currentId) {
        const shape = shapesStore.filter((shape) => isHover({ x, y }, shape));
        if (shape.length === 1 && mode === 'delete') {
          setOver(shape[0].id);
        } else {
          setOver();
        }
        return;
      }

      // drawing 중일 때 shape에 계속 point를 추가해준다.
      const findObject = shapes.find((item) => item.id === currentId);
      const target: Array<Point> = findObject ? [...findObject.points] : [];
      if (target.findIndex((item) => item.x === x && item.y === y) === -1) {
        target.push({ x, y });
        setShapes([...shapes.filter((shape) => shape.id !== currentId), { id: currentId, points: target }]);
      }
    },
    [ctx, currentId, shapes, shapesStore],
  );

  // 3) 마우스를 뗐을 때 or canvas 밖으로 마우스가 나갔을 때
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

  // 그리기가 완료되었는지 체크한 후 다 그려진 녀석들을 store에 저장한다.
  const onChangeShape = useCallback(() => {
    if (shapes.length === 0) return;
    for (const shape of shapes) {
      const points = shape.points;
      const first = points[0];
      const last = points[points.length - 1];

      // 첫 점과 마지막 점이 이어졌는지 체크하여 이어졌다면
      if (points.length > 1 && first.x === last.x && first.y === last.y) {
        if (shapesStore.findIndex((shapeStore) => shapeStore.id === shape.id) > -1) continue;

        const { id, points } = shape;
        // 다 그려진 shape를 redux 변수에 저장
        addShape({
          id,
          points,
          isOver: false,
        });
        // 다 그려진 shape은 목록에서 제거
        setShapes(shapes.filter((shape) => shape.id !== id));
        break;
      }
    }
  }, [shapes, shapesStore]);

  // shape가 변경될 때마다 바로 위의 함수를 실행함
  useEffect(() => {
    onChangeShape();
  }, [onChangeShape]);

  // shape를 canvas에 드로잉한다.
  useEffect(() => {
    clearCanvas();
    if (ctx) {
      // drawing 중인 객체
      for (const shape of shapes) {
        ctx.beginPath();
        for (const { x, y } of shape.points) {
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // drawing 완료된 객체
      for (const shape of shapesStore) {
        ctx.beginPath();
        for (const { x, y } of shape.points) {
          ctx.lineTo(x, y);
        }
        if (shape.isOver) ctx.fill();
        ctx.stroke();
      }
    }
  }, [shapes, ctx, shapesStore]);

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
