import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { InputIdStatus, increase } from 'store/input-id-store';

const useInputId = () => {
  const { id } = useSelector<RootState>((state) => state.inputId) as InputIdStatus;
  const dispatch = useDispatch();

  const increaseId = useCallback(() => {
    dispatch(increase());
  }, [id, dispatch]);

  return { increaseId, id };
};
export default useInputId;
