import { getUniqueId } from 'common/util';
import React from 'react';
interface SwitchProps {
  id?: string;
  label?: string;
  className?: string;
  isDisabled?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Switch = ({ id, label, checked, onChange }: SwitchProps) => {
  const switchId = id || getUniqueId();

  const checkboxElement = <input id={switchId} type="checkbox" checked={checked} onChange={onChange} />;
  const labelElement = (
    <label htmlFor={switchId} className="switch">
      {checkboxElement}
      <span />
      {label}
    </label>
  );

  return labelElement;
};
export default Switch;
