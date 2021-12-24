import { Link } from "react-router-dom";

import ToggleButton from "../ToggleButton";

import "./navbar.css";

export default function NavBar() {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <Link to="/croma">
          <h3 className="navbar__title">CROMA</h3>
        </Link>
        <ToggleButton />
      </nav>
    </div>
  );
}
