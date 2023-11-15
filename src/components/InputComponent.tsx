import React, { ChangeEvent } from "react";

interface InputComponentProps {
  type?: string;
  setInputinfo: React.Dispatch<React.SetStateAction<any>>;
  inputInfo: Record<string, any>;
  field: string;
  options?: string[]; // Dynamic options for radio
}

const InputComponent: React.FC<InputComponentProps> = ({
  type = "text",
  setInputinfo,
  inputInfo,
  field,
  options = [],
}: InputComponentProps) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInputinfo({ ...inputInfo, [field]: e.target.value });
  };

  return type === "select" ? (
    <select
      className="border-1 border-black w-full p-2 md:p-2 lg:p-2 rounded-lg"
      onChange={handleChange}
      value={inputInfo[field]}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  ) : type === "date" ? (
    <input
      type="date"
      className="border-1 border-black w-full p-2 md:p-2 lg:p-2 rounded-lg"
      onChange={(e) => setInputinfo({ date: e.target.value })}
      value={inputInfo[field]}
    />
  ) : type === "radio" ? (
    <div className="flex gap-2 flex-col ml-4">
      {options.map((option) => (
        <label key={option} className=" flex gap-2 text-lg">
          <input
            type="radio"
            name={field}
            value={option}
            checked={inputInfo[field] === option}
            onChange={handleChange}
            className="h-6 w-6 rounded-full"
          />
          {option}
        </label>
      ))}
    </div>
  ) : (
    <input
      type="text"
      className="border-1 border-black w-full p-2 md:p-2 lg:p-2 rounded-lg"
      onChange={handleChange}
      value={inputInfo[field]}
    />
  );
};

export default InputComponent;
