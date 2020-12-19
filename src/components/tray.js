import { useState } from "react";

import solver from "../worker-chain/step-1-solver";

export default (props) => {
  const [trayStr, setTrayStr] = useState("");

  const updateTrayStr = (event) => {
    const newTrayStr = event.target.value.replace(/[^A-Z]/gi, "").toLowerCase();
    setTrayStr(newTrayStr);
    solver.solve(newTrayStr);
  };

  return (
    <div className="letterbox">
      <input type="text" placeholder="yourtileshere" value={trayStr} onInput={updateTrayStr} disabled={!props.ready} />
    </div>
  );
};
