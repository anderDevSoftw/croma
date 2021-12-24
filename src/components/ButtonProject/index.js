import "./buttonProject.css";
import { Link } from "react-router-dom";

export default function ButtonProject() {
  return (
    <Link to="/croma/initialization">
      <button className="buttonProject">
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Nuevo Proyecto
      </button>
    </Link>
  );
}
