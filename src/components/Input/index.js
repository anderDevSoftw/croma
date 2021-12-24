import "./input.css";

export default function Input({ label, value, setValue, clave, type="number", placeholder="0,00" }) {
  const onChange = e => {
    setValue({...value,[clave]:e.target.value})
  };

  return (
    <label htmlFor={label} className="input__label">
      {label}
      <input type={type} value={value[clave]} onChange={onChange} required id={label} min={0} step={0.01} placeholder={placeholder} className="input" />
    </label>
  );
}
