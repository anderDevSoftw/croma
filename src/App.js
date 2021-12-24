import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./views/Home";
import Initialization from "./views/Initialization";
import Results from "./views/Results";

function App() {
  return (
    <div className="app">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="initialization" element={<Initialization />} />
        <Route path="initialization/:id" element={<Initialization />} >
        </Route>
        <Route path="results/:id" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;
