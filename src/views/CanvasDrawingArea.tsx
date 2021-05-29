import { getUniqueId, isHover } from 'common/util';
import usePrevious from 'hooks/usePrevious';
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
  // 현재 드로잉중인 객체
  const [drawingShape, setDrawingShape] = useState<Shape>();
  // redux에 저장하는 shape
  const { shapes: shapesStore, addShape, setOver, deleteShape } = useShape();
  // zoom
  const [zoom, setZoom] = useState(1.0);
  // factor
  const factor = 0.05;
  // center point
  const [centerPoint, setCenterPoint] = useState<Point>({ x: 0, y: 0 });

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

        // center를 원점으로 둠
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        // 최초 원점의 위치를 가운데로 설정
        context.setTransform(zoom, 0, 0, zoom, centerX, centerY);
        setCenterPoint({ x: centerX, y: centerY });
        setCtx(context);
      }
    }
  }, []);

  // zoom 변경시
  useEffect(() => {
    if (ctx) {
      const { a, d, e, f } = ctx?.getTransform();
      if (a !== zoom && d !== zoom) {
        ctx.setTransform(zoom, 0, 0, zoom, e, f);
      }
    }
  }, [ctx, zoom]);

  // 1) 마우스 클릭을 시작할 때
  const startDrawing = useCallback(() => {
    if (mode === 'drawing') setDrawingShape({ id: getUniqueId(), points: [] });
    else if (mode === 'delete') {
      const overShape = shapesStore.find((item) => item.isOver);
      if (overShape && confirm('정말로 삭제하시겠습니까?')) deleteShape(overShape.id);
    }
  }, [mode, shapesStore]);

  const clearCanvas = useCallback(() => {
    if (!ctx || !wrapRef.current) return;
    const wrap = wrapRef.current;
    ctx.beginPath();
    ctx.clearRect(-centerPoint.x, -centerPoint.y, wrap.offsetWidth, wrap.offsetHeight);
  }, [ctx, zoom]);

  // 2) canvas 위에서의 마우스 움직일 때
  const mouseOnCanvas = useCallback(
    ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (!ctx) return;
      const { offsetX, offsetY } = nativeEvent;
      let x = offsetX - centerPoint.x;
      let y = offsetY - centerPoint.y;
      x *= ctx.canvas.width / (ctx.canvas.width * zoom);
      y *= ctx.canvas.height / (ctx.canvas.height * zoom);

      // drawing 중이지 않을때
      if (!drawingShape) {
        const shape = shapesStore.filter((shape) => isHover({ x, y }, shape));
        if (shape.length === 1 && mode === 'delete') {
          setOver(shape[0].id);
        } else {
          setOver();
        }
        return;
      }

      // drawing 중일 때 shape에 계속 point를 추가해준다.
      const { points, id } = drawingShape;
      if (points.findIndex((item) => item.x === x && item.y === y) === -1) {
        const newPoints = [...points, { x, y }];
        setDrawingShape({ id, points: newPoints });
      }
    },
    [ctx, drawingShape, shapesStore, centerPoint],
  );

  // 3) 마우스를 뗐을 때 or canvas 밖으로 마우스가 나갔을 때
  const finishDrawing = useCallback(() => {
    // 제일 첫 점과 이어 준 후 현재 도형을 끝낸다.
    if (drawingShape) {
      const { points, id } = drawingShape;
      if (points.length < 2) {
        setDrawingShape(undefined);
        return;
      }
      const { x, y } = points[0];
      const newPoints = [...points, { x, y }];
      setDrawingShape({ id, points: newPoints });
    }
  }, [drawingShape]);

  // 그리기가 완료되었는지 체크한 후 다 그려진 녀석들을 store에 저장한다.
  const onChangeShape = useCallback(() => {
    if (!drawingShape) return;

    const { points, id } = drawingShape;
    const first = points[0];
    const last = points[points.length - 1];

    // 첫 점과 마지막 점이 이어졌는지 체크하여 이어졌다면
    if (points.length > 1 && first.x === last.x && first.y === last.y) {
      if (shapesStore.findIndex((shapeStore) => shapeStore.id === id) > -1) return;

      // 다 그려진 shape를 redux 변수에 저장
      addShape({
        id,
        points,
        isOver: false,
      });
      // 다 그려졌으므로 지움
      setDrawingShape(undefined);
    }
  }, [drawingShape, shapesStore]);

  // shape가 변경될 때마다 바로 위의 함수를 실행함
  useEffect(() => {
    onChangeShape();
  }, [onChangeShape]);

  // shape를 canvas에 드로잉한다.
  useEffect(() => {
    clearCanvas();
    if (ctx) {
      // drawing 중인 객체
      if (drawingShape) {
        ctx.beginPath();
        for (const { x, y } of drawingShape.points) {
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
  }, [drawingShape, shapesStore, clearCanvas]);

  return (
    <div className="canvas-drawing-area" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={mouseOnCanvas}
        onMouseLeave={finishDrawing}
      />
      <div className="canvas-zooming-button-area">
        <button type="button" className="plus" onClick={() => setZoom(zoom + factor)}>
          +
        </button>
        <button type="button" className="minus" disabled={zoom - factor < 0} onClick={() => setZoom(zoom - factor)}>
          -
        </button>
      </div>
    </div>
  );
};
export default CanvasDrawingArea;
