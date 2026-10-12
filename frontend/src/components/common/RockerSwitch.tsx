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

  return (
    <label
      className={`switch rocker-switch ${sizeClass} ${className}`}
      title={title}
      aria-label={ariaLabel || `${leftLabel}/${rightLabel} switch`}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        className="cb"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle">
        <span className="left">{leftLabel}</span>
        <span className="right">{rightLabel}</span>
      </span>
    </label>
  );
};
