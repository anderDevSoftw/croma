import { useState, useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DB from '../../utilities/db'
import Input from "../../components/Input";
import Button from "../../components/Button";

import "./initialization.css";

import data from "../../data/compounds.json";

const datos = Object.keys(data);
const initialState = {
  'presion':"",
  'temperatura':"",
  'z':"",
  'nombre':''
};
datos.forEach(value => {
  initialState[value] = "";
})

export default function Initialization() {
  const [value,setValue] = useState(initialState);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const id = params.id;
    if(id){
      const project = DB.getProject(parseInt(id));
      if(!project){
        navigate("/croma/initialization")
      } else {
        setValue(project)
      }
    }
  },[params,navigate])

  const onClick = () => {
    const ind = params.id;
    let results = {};
    const keys = {...data,'presion':'','temperatura':'','z':''};
    let normalize = 0;
    Object.keys(keys).forEach(key => {
      results[key] = value[key] === ''?0:parseFloat(value[key]);
      if(!["presion","temperatura","z"].some(el => el === key)){
        normalize += results[key];
      }
    });
    if(normalize !== 1){
      alert("Por favor, normaliza las fracciones molares, la suma de estas deben dar 1");
      return ;
    }
    results['nombre'] = value['nombre'] === ''?'DINAV-CROMA':value['nombre'];
    let id;
    if(ind){
      id = DB.setProject(results,parseInt(ind));
    }else {
      id = DB.setProject(results)
    }
    navigate(`/croma/results/${id}`);
  }

  return (
    <main className="initialization">
      <form className="form">
        <h2>Ingrese los datos</h2>
        <div className="form__group">
          <h3>Nombre del Proyecto</h3>
          <div className="grid">
            <Input value={value} clave={'nombre'} setValue={setValue} label="Nombre" type="string" placeholder="" />
          </div>
        </div>
        <div className="form__group">
          <h3>Fracciones molares</h3>
          <div className="grid">
            {datos.map((dato) => (
              <Input value={value} key={dato} setValue={setValue} clave={dato} label={dato} />
            ))}
          </div>
        </div>
        <div className="form__group">
          <h3>Condiciones del gas</h3>
          <div className="grid">
            <Input value={value} clave={'presion'} setValue={setValue} label="Presión (lpca)" />
            <Input value={value} clave={'temperatura'} setValue={setValue} label="Temperatura (°F)" />
            <Input value={value} clave={'z'} setValue={setValue} label="Factor Z" />
          </div>
        </div>

        <Button onClick={onClick}>Siguente</Button>
      </form>
    </main>
  );
}
