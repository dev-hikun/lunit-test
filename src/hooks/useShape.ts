import { ShapeStore } from 'interface';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import {
  addShape as addShapeStore,
  setOver as setOverStore,
  deleteShape as deleteShapeStore,
} from 'store/polygon-store';

const useShape = () => {
  const shapes = useSelector<RootState>((state) => state.polygon) as Array<ShapeStore>;
  const dispatch = useDispatch();

  const addShape = (shape: ShapeStore) => {
    console.log('addShape', shapes, shape);
    if (shapes.findIndex((shapeStore) => shapeStore.id === shape.id) > -1) throw new Error('Exists id');
    dispatch(addShapeStore(shape));
  };

  const deleteShape = (id: string) => {
    console.log('deleteShape', id);
    dispatch(deleteShapeStore(id));
  };

  const setOver = (id?: string) => {
    dispatch(setOverStore(id));
  };

  return { shapes, addShape, setOver, deleteShape };
};
export default useShape;
