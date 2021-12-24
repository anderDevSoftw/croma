import "./result.css";

export default function Result({ dato, value, unidad = "adm" }) {
  return (
    <div className="result">
      <h3>
        {dato} ({unidad})
      </h3>
      <p>{value.toFixed(4)}</p>
    </div>
  );
}
