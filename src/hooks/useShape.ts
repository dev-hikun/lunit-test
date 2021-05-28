import { Shape } from 'interface';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { addShape as addShapeStore } from 'store/polygon-store';

const useShape = () => {
  const shapes = useSelector<RootState>((state) => state.polygon) as Array<Shape>;
  const dispatch = useDispatch();

  const addShape = (shape: Shape) => {
    console.log('addShape', shapes, shape);
    if (shapes.findIndex((shapeStore) => shapeStore.id === shape.id) > -1) throw new Error('Exists id');
    dispatch(addShapeStore(shape));
  };

  return { shapes, addShape };
};
export default useShape;
