'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onValueChange: (value: string) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  /** classes for the trigger box */
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Drop-in replacement for a native <select> using the dark themed Radix select,
 * so the dropdown list matches the site instead of the OS default.
 */
export function SelectField({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  contentClassName,
  disabled,
  ariaLabel,
}: Props) {
  const opts = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o,
  );

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {opts.map((o) => (
          <SelectItem key={o.value} value={o.value} className="capitalize">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
