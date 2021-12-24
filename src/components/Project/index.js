import { Link, useNavigate } from 'react-router-dom';
import DB from "../../utilities/db";
import useToggle from "../../hooks/useToggle";
import "./project.css";

import Tooltip from "../Tooltip";

export default function Project({ nombre, id, update }) {
  const [isTooltipActive, toggle] = useToggle();
  const navigate = useNavigate();
  const delet = () => {
    toggle()
    DB.deleteProject(id);
    update();
  }

  const clone = () => {
    const project = DB.getProject(id);
    const ind = DB.setProject(project);
    navigate(`/initialization/${ind}`)
    
  }

  const edit = () => {
    navigate(`/initialization/${id}`)
  }

  return (
    <div className="project">
      <button aria-label="opciones" className="project__trash" onClick={toggle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>
      {isTooltipActive && <Tooltip delet={delet} clone={clone} edit={edit} />}
      <Link to={`results/${id}`} className="project__link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
        <h3>{nombre.length > 13 ? `${nombre.slice(0, 12)}...` : nombre}</h3>
      </Link>
    </div>
  );
}
