import "./home.css";

import Projects from "../../components/Projects";
import ButtonProject from "../../components/ButtonProject";

export default function Home() {
  return (
    <main className="home">
      <Projects />
      <ButtonProject />
    </main>
  );
}
