import React, { useRef, useEffect, useState, useCallback } from 'react';

// Shared utilities & constants

const INPUT_STYLES = {
  base: 'w-full px-3 py-2 border-2 rounded-lg font-work-sans transition-all',
  enabled: 'border-bold-blue focus:outline-none focus:ring-2 focus:ring-bold-blue',
  disabled: 'bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed',
  error: 'border-red-500'
};

const getInputClassName = (disabled, error = false) => {
  const classes = [INPUT_STYLES.base];

  if (disabled) {
    classes.push(INPUT_STYLES.disabled);
  } else {
    classes.push(INPUT_STYLES.enabled);
  }

  if (error) {
    classes.push(INPUT_STYLES.error);
  }

  return classes.join(' ');
};

// Text Input
export const TextInput = React.memo(({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  maxLength = 100
}) => {
  const handleChange = useCallback((e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxLength) {
      onChange(inputValue);
    }
  }, [maxLength, onChange]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const truncated = pastedText.slice(0, maxLength);
    onChange(truncated);
  }, [maxLength, onChange]);

  return (
    <input
      type="text"
      value={value || ''}
      onChange={handleChange}
      onPaste={handlePaste}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      className={getInputClassName(disabled)}
    />
  );
});

TextInput.displayName = 'TextInput';

// Currency Input
const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('en-US').format(absValue);
  return value < 0 ? `-${formatted}` : formatted;
};

const parseNumericInput = (input, maxLength, allowNegative = true, allowDecimals = true) => {
  if (input === '' || input === '-') return input === '-' && allowNegative ? '-' : '';

  // Allow "-0" as a valid partial input
  if (input === '-0' && allowNegative) {
    return input;
  }

  // Build regex based on what's allowed
  let pattern = '[^0-9';
  if (allowNegative) pattern += '-';
  if (allowDecimals) pattern += '.';
  pattern += ']';

  let cleaned = input.replace(new RegExp(pattern, 'g'), '');

  // Ensure only one decimal point
  if (allowDecimals) {
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
  }

  // Ensure only one minus sign at the start
  if (allowNegative) {
    const minusCount = (cleaned.match(/-/g) || []).length;
    if (minusCount > 1) {
      cleaned = '-' + cleaned.replace(/-/g, '');
    } else if (cleaned.includes('-') && !cleaned.startsWith('-')) {
      cleaned = '-' + cleaned.replace(/-/g, '');
    }
  }

  // Check length (excluding minus and decimal)
  const digitsOnly = cleaned.replace(/[^0-9]/g, '');
  if (digitsOnly.length > maxLength) return null;

  // Return the string for partial inputs like "-", "-0", or "5."
  if (cleaned === '-' || cleaned === '-0' || cleaned.endsWith('.')) {
    return cleaned;
  }

  const num = parseFloat(cleaned);
  return (isNaN(num) || !isFinite(num)) ? null : num;
};

export const CurrencyInput = React.memo(({
  value,
  onChange,
  onBlur,
  placeholder = '0',
  disabled,
  maxLength = 15,
  allowNegative = true,
  allowDecimals = true
}) => {
  const [inputValue, setInputValue] = useState('');

  // Sync input value when value prop changes
  useEffect(() => {
    if (disabled) {
      setInputValue(formatCurrency(value));
    } else {
      // Only update if value is different from what we're typing
      if (value === '' || value === null || value === undefined) {
        setInputValue('');
      } else if (value === '-' || value === '-0') {
        setInputValue(value);
      } else if (typeof value === 'number') {
        setInputValue(String(value));
      } else if (typeof value === 'string') {
        setInputValue(value);
      }
    }
  }, [value, disabled]);

  const handleChange = useCallback((e) => {
    const input = e.target.value;
    setInputValue(input);

    const parsed = parseNumericInput(input, maxLength, allowNegative, allowDecimals);

    if (parsed === '' || parsed === '-' || parsed === '-0') {
      onChange(parsed);
    } else if (parsed !== null) {
      onChange(parsed);
    }
  }, [maxLength, allowNegative, allowDecimals, onChange]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const parsed = parseNumericInput(pastedText, maxLength, allowNegative, allowDecimals);

    if (parsed !== null || parsed === '' || parsed === '-' || parsed === '-0') {
      setInputValue(pastedText);
      onChange(parsed === null ? '' : parsed);
    }
  }, [maxLength, allowNegative, allowDecimals, onChange]);

  const handleBlur = useCallback((e) => {
    // Clean up trailing decimal or lone minus on blur
    if (inputValue === '-' || inputValue === '-0' || inputValue.endsWith('.')) {
      const cleaned = inputValue.replace(/[-.]$/, '').replace(/^-0$/, '0');
      const num = parseFloat(cleaned);
      if (!isNaN(num)) {
        setInputValue(String(num));
        onChange(num);
      } else {
        setInputValue('');
        onChange('');
      }
    }
    onBlur?.(e);
  }, [inputValue, onChange, onBlur]);

  const displayValue = disabled ? formatCurrency(value) : inputValue;

  return (
    <div className="relative">
      <span className={`absolute left-3 top-2.5 font-work-sans ${disabled ? 'text-gray-400' : 'text-gray-600'
        }`}>
        $
      </span>

      {disabled && (
        <LockIcon className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
      )}

      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onPaste={handlePaste}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={disabled}
        className={`${getInputClassName(disabled)} pl-8 ${disabled ? 'pr-10' : 'pr-3'
          }`}
      />
    </div>
  );
});

CurrencyInput.displayName = 'CurrencyInput';

// Lock icon component
const LockIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

// Percentage Input
const parsePercentageInput = (input, maxLength, maxDecimals, allowNegative = true) => {
  if (input === '' || (input === '-' && allowNegative)) {
    return input;
  }

  // Allow "-0" as a valid partial input
  if (input === '-0' && allowNegative) {
    return input;
  }

  // Build pattern
  let pattern = '[^0-9.';
  if (allowNegative) pattern += '-';
  pattern += ']';

  let cleaned = input.replace(new RegExp(pattern, 'g'), '');

  // Handle multiple decimals
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }

  // Handle multiple minus signs
  if (allowNegative) {
    const minusCount = (cleaned.match(/-/g) || []).length;
    if (minusCount > 1) {
      cleaned = '-' + cleaned.replace(/-/g, '');
    } else if (cleaned.includes('-') && !cleaned.startsWith('-')) {
      cleaned = '-' + cleaned.replace(/-/g, '');
    }
  }

  // Validate integer part length
  const integerPart = cleaned.split('.')[0].replace('-', '');
  if (integerPart.length > maxLength) return null;

  // Validate decimal part length
  const decimalPart = cleaned.split('.')[1] || '';
  if (decimalPart.length > maxDecimals) return null;

  // Return string for partial inputs like "-", "-0", or "5."
  if (cleaned === '-' || cleaned === '-0' || cleaned.endsWith('.')) {
    return cleaned;
  }

  const num = parseFloat(cleaned);
  return (isNaN(num) || !isFinite(num)) ? null : num;
};

export const PercentageInput = React.memo(({
  value,
  onChange,
  onBlur,
  placeholder = '0',
  disabled,
  maxLength = 6,
  maxDecimals = 2,
  allowNegative = true
}) => {
  const [inputValue, setInputValue] = useState('');

  // Sync input value when value prop changes
  useEffect(() => {
    if (value === '' || value === null || value === undefined) {
      setInputValue('');
    } else if (value === '-' || value === '-0') {
      setInputValue(value);
    } else if (typeof value === 'number') {
      setInputValue(String(value));
    } else {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = useCallback((e) => {
    const input = e.target.value;
    setInputValue(input);

    const parsed = parsePercentageInput(input, maxLength, maxDecimals, allowNegative);

    if (parsed === '' || parsed === '-' || parsed === '-0') {
      onChange(parsed);
    } else if (parsed !== null) {
      onChange(parsed);
    }
  }, [maxLength, maxDecimals, allowNegative, onChange]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const parsed = parsePercentageInput(pastedText, maxLength, maxDecimals, allowNegative);

    if (parsed !== null || parsed === '' || parsed === '-' || parsed === '-0') {
      setInputValue(pastedText);
      onChange(parsed === null ? '' : parsed);
    }
  }, [maxLength, maxDecimals, allowNegative, onChange]);

  const handleBlur = useCallback((e) => {
    // Clean up trailing decimal or lone minus on blur
    if (inputValue === '-' || inputValue === '-0' || inputValue.endsWith('.')) {
      const cleaned = inputValue.replace(/[-.]$/, '').replace(/^-0$/, '0');
      const num = parseFloat(cleaned);
      if (!isNaN(num)) {
        setInputValue(String(num));
        onChange(num);
      } else {
        setInputValue('');
        onChange('');
      }
    }
    onBlur?.(e);
  }, [inputValue, onChange, onBlur]);

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        value={inputValue}
        onChange={handleChange}
        onPaste={handlePaste}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`${getInputClassName(disabled)} pr-8`}
      />
      <span className={`absolute right-3 top-2.5 font-work-sans ${disabled ? 'text-gray-400' : 'text-gray-600'
        }`}>
        %
      </span>
    </div>
  );
});

PercentageInput.displayName = 'PercentageInput';

// Date input
const DATE_CONFIG = {
  MONTH: { maxLength: 2, placeholder: 'MM' },
  DAY: { maxLength: 2, placeholder: 'DD' },
  YEAR: { maxLength: 4, placeholder: 'YYYY' }
};

const parseDateFromDigits = (digits) => {
  if (digits.length === 8) {
    // Check if YYYY-MM-DD format (year first)
    if (parseInt(digits.slice(0, 4)) > 1900) {
      return {
        year: digits.slice(0, 4),
        month: digits.slice(4, 6),
        day: digits.slice(6, 8)
      };
    }
    // MM-DD-YYYY format
    return {
      month: digits.slice(0, 2),
      day: digits.slice(2, 4),
      year: digits.slice(4, 8)
    };
  }

  if (digits.length === 6) {
    // MM-DD-YY format
    const shortYear = digits.slice(4, 6);
    const yearPrefix = parseInt(shortYear) > 50 ? '19' : '20';

    return {
      month: digits.slice(0, 2),
      day: digits.slice(2, 4),
      year: yearPrefix + shortYear
    };
  }

  return null;
};

const validateDate = (month, day, year) => {
  if (month.length !== 2 || day.length !== 2 || year.length !== 4) {
    return false;
  }

  const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  const date = new Date(isoDate + 'T00:00:00');

  return (
    date.getMonth() + 1 === parseInt(month) &&
    date.getDate() === parseInt(day)
  );
};

export const DateInput = React.memo(({
  value,
  onChange,
  onBlur,
  disabled,
  error
}) => {
  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const yearRef = useRef(null);
  const [isInvalid, setIsInvalid] = useState(false);

  // Sync refs when value changes externally
  useEffect(() => {
    if (!value) return;

    try {
      const date = new Date(value + 'T00:00:00');
      if (monthRef.current) monthRef.current.value = String(date.getMonth() + 1).padStart(2, '0');
      if (dayRef.current) dayRef.current.value = String(date.getDate()).padStart(2, '0');
      if (yearRef.current) yearRef.current.value = String(date.getFullYear());
      setIsInvalid(false);
    } catch {
      setIsInvalid(true);
    }
  }, [value]);

  const updateDateValue = useCallback(() => {
    const month = monthRef.current?.value || '';
    const day = dayRef.current?.value || '';
    const year = yearRef.current?.value || '';

    if (validateDate(month, day, year)) {
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      setIsInvalid(false);
      onChange(isoDate);
    } else {
      setIsInvalid(true);
      onChange('');
    }
  }, [onChange]);

  const handleKeyDown = useCallback((prevRef) => (e) => {
    if (e.key === 'Backspace' && e.target.value === '' && prevRef?.current) {
      e.preventDefault();
      prevRef.current.focus();
      prevRef.current.select();
    }
  }, []);

  const handleInput = useCallback((ref, maxLength, nextRef) => (e) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    const truncated = digits.slice(0, maxLength);

    if (e.target.value !== truncated) {
      e.target.value = truncated;
    }

    if (truncated.length === maxLength && nextRef?.current) {
      nextRef.current.focus();
    }

    updateDateValue();
  }, [updateDateValue]);

  const handlePaste = useCallback((e) => {
    const pastedText = e.clipboardData.getData('text');
    const currentInput = e.target;
    const maxLength = parseInt(currentInput.getAttribute('maxLength'));
    const digits = pastedText.replace(/[^0-9]/g, '');

    if (digits.length <= maxLength) {
      setTimeout(() => {
        const val = currentInput.value.replace(/[^0-9]/g, '');
        currentInput.value = val.slice(0, maxLength);
        updateDateValue();
      }, 0);
      return;
    }

    e.preventDefault();
    const parsed = parseDateFromDigits(digits);

    if (parsed) {
      if (monthRef.current) monthRef.current.value = parsed.month;
      if (dayRef.current) dayRef.current.value = parsed.day;
      if (yearRef.current) yearRef.current.value = parsed.year;
      updateDateValue();
    }
  }, [updateDateValue]);

  const inputClassName = getInputClassName(disabled, isInvalid || error);
  const fieldClassName = `${inputClassName} text-center`;

  return (
    <div className="flex items-center gap-1">
      <input
        ref={monthRef}
        type="text"
        inputMode="numeric"
        onInput={handleInput(monthRef, DATE_CONFIG.MONTH.maxLength, dayRef)}
        onKeyDown={handleKeyDown(null)}
        onPaste={handlePaste}
        onBlur={onBlur}
        placeholder={DATE_CONFIG.MONTH.placeholder}
        disabled={disabled}
        maxLength={DATE_CONFIG.MONTH.maxLength}
        className={`${fieldClassName} w-14`}
      />
      <span className="text-gray-600">/</span>
      <input
        ref={dayRef}
        type="text"
        inputMode="numeric"
        onInput={handleInput(dayRef, DATE_CONFIG.DAY.maxLength, yearRef)}
        onKeyDown={handleKeyDown(monthRef)}
        onPaste={handlePaste}
        onBlur={onBlur}
        placeholder={DATE_CONFIG.DAY.placeholder}
        disabled={disabled}
        maxLength={DATE_CONFIG.DAY.maxLength}
        className={`${fieldClassName} w-14`}
      />
      <span className="text-gray-600">/</span>
      <input
        ref={yearRef}
        type="text"
        inputMode="numeric"
        onInput={handleInput(yearRef, DATE_CONFIG.YEAR.maxLength, null)}
        onKeyDown={handleKeyDown(dayRef)}
        onPaste={handlePaste}
        onBlur={onBlur}
        placeholder={DATE_CONFIG.YEAR.placeholder}
        disabled={disabled}
        maxLength={DATE_CONFIG.YEAR.maxLength}
        className={`${fieldClassName} w-20`}
      />
    </div>
  );
});

DateInput.displayName = 'DateInput';