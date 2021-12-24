import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DB from "../../utilities/db";
import data from "../../data/compounds.json";
import {add, multiply, divide, newtonRaphson } from "../../modules/math";
import Result from "../../components/Result";

import "./results.css";

export default function Results() {

  const params = useParams();
  const navigate = useNavigate();
  const [results,setResults] = useState([])

  useEffect(() => {
    const id = params.id;
    const proyect = DB.getProject(parseInt(id));
    if(!proyect){
      navigate("/")
    } else {
      let r = [];
      let YiMi = [];
      let YiPi = [];
      let VCSiYi = [];
      let VCIiYi = [];
      let YiTsc = [];
      let YiPsc = [];
      let YiW = [];
      let TSR = 0;
      let TC = 0;
      let PC = 0;
      Object.keys(data).forEach(comp => {
        let yimi = multiply(proyect[comp],data[comp]["peso-molecular"]);
        let vciiyi = multiply(proyect[comp],data[comp]["valor-calorifico"]["neto"]);
        let vcsiyi = multiply(proyect[comp],data[comp]["valor-calorifico"]["bruto"]);
        let yitsc = multiply(proyect[comp],add(data[comp]["temperatura-critica"]["value"],459.67));
        let yipsc = multiply(proyect[comp],data[comp]["presion-critica"]["value"]);
        let yiw = multiply(proyect[comp],data[comp]["w"]);
        if(!["C1","C2","H2S","N","CO2"].some(el => el === comp)){
          let yipi = divide(multiply(proyect[comp],data[comp]["peso-molecular"],1000),multiply(data[comp]["densidad-liquida"].value,379.63));
          YiPi.push(yipi);
        }
        YiMi.push(yimi);
        VCSiYi.push(vcsiyi);
        VCIiYi.push(vciiyi);
        YiTsc.push(yitsc);
        YiPsc.push(yipsc);
        YiW.push(yiw);
      })
      r.push({ dato: "Masa molar aparente", unidad:"lb/lbmol", value: add(...YiMi) });
      r.push({ dato: "Riqueza liquida", unidad:"GPM",value: add(...YiPi) });
      r.push({ dato: "Compresibilidad del gas",unidad:"1/lpca", value: divide(1,proyect["presion"]) },);
      r.push({ dato: "Factor volumetrico del gas a condiciones de Sup.",unidad:"PCY/PCN", value: multiply(35.35,divide(proyect["presion"],multiply(proyect["z"],add(proyect["temperatura"],459.67)))) },);
      r.push({ dato: "Factor volumetrico del gas a condiciones de Yac.",unidad:"PCY/PCN", value: multiply(0.02829,divide(multiply(proyect["z"],add(proyect["temperatura"],459.67)),proyect["presion"])) },);
      r.push({ dato: "Densidad del gas.",unidad:"Lb/PCN", value:divide(multiply(proyect["presion"],add(...YiMi)),multiply(10.732,add(proyect["temperatura"],459.67),proyect["z"])) });
      r.push({ dato: "Gravedad especifica.", value:divide(add(...YiMi),28.9625)})
      r.push({ dato: "Poder calorifico Sup.", unidad:"BTU/ftc",value: add(...VCSiYi) });
      r.push({ dato: "Poder calorifico Inf.", unidad:"BTU/ftc",value: add(...VCIiYi) });
      r.push({ dato: "Psc", unidad:"lpca",value: add(...YiPsc) });
      r.push({ dato: "Tsc", unidad:"°R",value: add(...YiTsc) });
      r.push({ dato: "Psr",value: divide(proyect["presion"],add(...YiPsc)) });
      r.push({ dato: "Tsr",value: divide(add(proyect["temperatura"],459.67),add(...YiTsc)) });
      TSR = divide(add(proyect["temperatura"],459.67),add(...YiTsc));
      TC = add(...YiTsc);
      PC = add(...YiPsc);
      if(proyect["N"] < 0.05 && (proyect["H2S"] > 0 || proyect["CO2"] > 0)){
        //Correciones de condiciones
        let A = proyect["H2S"]+proyect["CO2"];
        let B = proyect["H2S"];
        let E = multiply(120,(Math.pow(A,0.9) - Math.pow(A,1.6))) + multiply(15,(Math.pow(B,0.5) - Math.pow(B,4)));
        let Tsc =  add(...YiTsc) - E;
        let Psc = divide(multiply(Tsc,add(...YiPsc)),(add(...YiTsc)+B*(1 - B)*E));
        TC = Tsc;
        PC = Psc;
        TSR = divide(add(proyect["temperatura"],459.67),Tsc);
        r.push({ dato: "Psc [CWA]", unidad:"lpca",value: Psc });
        r.push({ dato: "Tsc [CWA]", unidad:"°R",value: Tsc });
        r.push({ dato: "Psr [CWA]",value: divide(proyect["presion"],Psc) });
        r.push({ dato: "Tsr [CWA]",value: divide(add(proyect["temperatura"],459.67),Tsc) });
        
      }
      //Calculo de Z
      let T = add(proyect["temperatura"],459.67);
      let X = 2.5 + divide(986,T) + multiply(0.01,add(...YiMi));
      let Y = 2.4 - multiply(0.2,X);
      let K = divide(multiply((9.4+multiply(0.02,add(...YiMi))),Math.pow(T,1.5)),(209 + multiply(19,add(...YiMi)) + T));
      let Dg = divide(divide(multiply(proyect["presion"],add(...YiMi)),multiply(10.732,add(proyect["temperatura"],459.67),proyect["z"])),62.4);
      let Ug = divide(multiply(K,Math.exp(multiply(X,Math.pow(Dg,Y)))),Math.pow(10,4));
      r.push({ dato: "Viscosidad",unidad:"cPs",value: Ug });
      
      let W = add(...YiW);
      let m = 0.37464 + multiply(1.54226,W) - multiply(0.26992,Math.pow(W,2));
      let ang_sqrt = 1 + multiply(m,(1-Math.sqrt(TSR)))
      let a = multiply(0.45724,divide(multiply(Math.pow(10.732,2),Math.pow(TC,2)),PC),Math.pow(ang_sqrt,2));
      let b = multiply(0.0778,divide(multiply(10.732,TC),PC));
      let A = divide(multiply(a,proyect["presion"]),multiply(Math.pow(10.732,2),Math.pow(add(proyect["temperatura"],459.67),2)));
      let B = divide(multiply(b,proyect["presion"]),multiply(10.732,add(proyect["temperatura"],459.67)));
      let TermA = 1;
      let TermB = -(1-B);
      let TermC = A-multiply(3,B)-multiply(2,B);
      let TermInd = -(multiply(A,B) - Math.pow(B,2) - Math.pow(B,3));
      const fn = (x) => multiply(TermA,Math.pow(x,3)) + multiply(TermB,Math.pow(x,2)) + multiply(TermC,x) + TermInd;
      const dfn = (x) => multiply(3,TermA,Math.pow(x,2)) + multiply(2,TermB,x) + TermC;

      const z = newtonRaphson(fn,dfn,1);
      if(typeof z === 'number'){
        r.push({ dato: "Factor Z", value: z })
      }
      setResults(r);
    }
  },[navigate,params])

  return (
    <main className="results">
      <h2>Resultados</h2>
      <div className="results__values">
        {results.map((resultado, id) => (
          <Result key={id} {...resultado} />
        ))}
      </div>
    </main>
  );
}
