import React from 'react';

export interface RockerSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
  ariaLabel?: string;
}

export const RockerSwitch: React.FC<RockerSwitchProps> = ({
  checked,
  onChange,
  leftLabel = 'off',
  rightLabel = 'on',
  size = 'sm',
  className = '',
  title,
  ariaLabel,
}) => {
  const sizeClass = {
    xs: 'rocker-xs',
    sm: 'rocker-sm',
    md: 'rocker-md',
    lg: 'rocker-lg',
  }[size];

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onChange(!checked);
    }
  };

  return (
    <label
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      className={`switch rocker-switch ${sizeClass} ${checked ? 'is-checked' : ''} ${className}`}
      title={title}
      aria-label={ariaLabel || `${leftLabel}/${rightLabel} switch`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <input
        className="cb"
        type="checkbox"
        checked={checked}
        readOnly
        tabIndex={-1}
      />
      <span className="toggle">
        <span className="left">{leftLabel}</span>
        <span className="right">{rightLabel}</span>
      </span>
    </label>
  );
};
