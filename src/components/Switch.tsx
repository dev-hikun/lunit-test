import React from 'react';
interface SwitchProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  label?: string;
}
const Switch = ({ id, label, checked, onChange }: SwitchProps) => {
  return (
    <label htmlFor={id} className="switch">
      <span />
      <input id={id} type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};
export default Switch;
