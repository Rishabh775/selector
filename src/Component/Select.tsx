import React, { useState, useRef, useEffect } from "react";

type Option = {
  value: string;
  label: string;
  description?: string;
};

type SelectProps = {
  options: Option[];
  extended?: boolean;
  defaultValue?: string;
  onChange: (value: string[] | string | null) => void;
  isMultiple?: boolean;
  isOpen?: boolean;
  isClearable?: boolean;
  maxSelections?: number;
  placeholder?: string;
  disabled?: boolean;
  customStyles?: {
    container?: string;
    input?: string;
    dropdown?: string;
    option?: string;
    selectedItem?: string;
  };
};

const Select: React.FC<SelectProps> = ({
  options,
  extended = false,
  defaultValue,
  onChange,
  isMultiple = false,
  isOpen = false,
  isClearable = false,
  maxSelections,
  placeholder = "Select...",
  disabled = false,
  customStyles = {},
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(isOpen);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    defaultValue ? [defaultValue] : []
  );
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!inputRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (value: string) => {
    if (isMultiple) {
      let updated = [...selectedValues];
      if (updated.includes(value)) {
        updated = updated.filter((v) => v !== value);
      } else {
        if (!maxSelections || updated.length < maxSelections) {
          updated.push(value);
        }
      }
      setSelectedValues(updated);
      onChange(updated);
    } else {
      setSelectedValues([value]);
      onChange(value);
      setDropdownOpen(false);
    }
  };

  const removeSelected = (value: string) => {
    const updated = selectedValues.filter((v) => v !== value);
    setSelectedValues(updated);
    onChange(updated);
  };

  const clearAll = () => {
    setSelectedValues([]);
    onChange(isMultiple ? [] : null);
  };

  const selectedLabels = selectedValues.map(
    (val) => options.find((opt) => opt.value === val)?.label
  );

  return (
    <div
      className={`relative w-full ${customStyles.container ?? ""}`}
      ref={inputRef}
    >
      <div
        className={`flex flex-wrap items-center border rounded px-3 py-2 bg-white ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
        } ${customStyles.input ?? ""}`}
        onClick={() => !disabled && setDropdownOpen((prev) => !prev)}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
        tabIndex={0}
      >
        {selectedLabels.length > 0 ? (
          isMultiple ? (
            selectedLabels.map((label, idx) => (
              <span
                key={idx}
                className={`flex items-center bg-gray-200 text-sm rounded px-2 py-1 mr-2 mb-1 ${
                  customStyles.selectedItem ?? ""
                }`}
              >
                {label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelected(selectedValues[idx]);
                  }}
                  className="ml-2 text-gray-600 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-sm">{selectedLabels[0]}</span>
          )
        ) : (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        )}
        {isClearable && selectedValues.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
            className="ml-auto text-gray-500 hover:text-red-500"
          >
            ×
          </button>
        )}
      </div>

      {isDropdownOpen && !disabled && (
        <div
          className={`absolute z-50 w-full mt-1 max-h-60 overflow-y-auto border rounded bg-white shadow-md ${
            customStyles.dropdown ?? ""
          }`}
          role="listbox"
        >
          {options.map((opt) => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleOptionClick(opt.value)}
                className={`flex items-start px-4 py-2 hover:bg-blue-50 ${
                  isSelected ? "bg-blue-100" : ""
                } ${customStyles.option ?? ""}`}
              >
                {isMultiple && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="mr-2 mt-1"
                  />
                )}
                <div>
                  <div className="font-medium text-sm">{opt.label}</div>
                  {extended && opt.description && (
                    <div className="text-xs text-gray-500">
                      {opt.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
