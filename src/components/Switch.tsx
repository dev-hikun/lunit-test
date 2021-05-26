import useInputId from 'hooks/useInputId';
import React, { useEffect, useMemo } from 'react';
interface SwitchProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  label?: string;
}
const Switch = ({ label, checked, onChange }: SwitchProps) => {
  const { id, increaseId } = useInputId();
  useEffect(() => {
    increaseId();
  }, []);

  const inputId = useMemo(() => {
    return `input-${id}`;
  }, [id]);

  return (
    <label htmlFor={inputId} className="switch">
      <span />
      <input id={inputId} type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};
export default Switch;
