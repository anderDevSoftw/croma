import { useEffect } from "react";
import useToggle from "../../hooks/useToggle";

import "./toggleButton.css";

export default function ToggleButton() {
  const [isDarkModeActive, toggle] = useToggle();

  useEffect(() => {
    if (isDarkModeActive) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkModeActive]);

  return <input onClick={toggle} type="checkbox" name="modo oscuro" />;
}
