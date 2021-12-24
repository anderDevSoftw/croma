import "./button.css";

import React from "react";

export default function index({ children, onClick }) {
  return <button onClick={onClick} className="button">{children}</button>;
}
