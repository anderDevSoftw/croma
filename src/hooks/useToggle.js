import { useState, useCallback } from "react";

export default function useToggle(initialState = false) {
  const [state, setstate] = useState(initialState);

  const toggle = useCallback(() => setstate((prev) => !prev), []);

  return [state, toggle];
}
