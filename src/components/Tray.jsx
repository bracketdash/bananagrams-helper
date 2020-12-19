import { useState } from "react";
import Solver from "./classes/Solver";

export default (props) => {
  const [trayStr, setTrayStr] = useState("");
  const updateTrayStr = (event) => {
    const newTrayStr = event.target.value.replace(/[^A-Z]/gi, "").toLowerCase();
    setTrayStr(newTrayStr);
    Solver.solve({ trayStr: newTrayStr });
  };
  return (
    <div className="letterbox">
      <input type="text" placeholder="yourtileshere" value={trayStr} onInput={updateTrayStr} disabled={!props.ready} />
    </div>
  );
};
