import { useEffect, useState } from "react";
import DB from "../../utilities/db";
import "./projects.css";

import Project from "../Project";
import noProjects from "../../assets/noProjects.svg";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if(!("Projects" in localStorage)){
      import("../../data/demo.json").then(demo => {
        DB.setProject(demo.default);
        setProjects(DB.getProjects());
      })
    } else {
      setProjects(DB.getProjects());
    }
  }, []);

  return (
    <div className="projects">
      <h2>Proyectos</h2>
      {!projects.length ? (
        <div className="emptyProjects">
          <img src={noProjects} alt="jjj" />
          <p>No hay proyectos</p>
        </div>
      ) : (
        <div className="list">
          {projects.map((project, id) => (
            <Project {...project} key={id} id={id} update={() => setProjects(DB.getProjects())}/>
          ))}
        </div>
      )}
    </div>
  );
}
