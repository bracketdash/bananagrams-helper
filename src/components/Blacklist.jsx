import { useState } from "react";
import Solver from "./classes/Solver";

export default (props) => {
  const [blacklistStr, setBlacklistStr] = useState("");
  const updateBlacklistStr = (event) => {
    const newBlacklistStr = event.target.value.replace(/[^A-Z,]/gi, "").toLowerCase();
    setBlacklistStr(newBlacklistStr);
    Solver.solve({ blacklistStr: newBlacklistStr });
  };
  return (
    <div className="controls">
      <div>
        <label>Word Blacklist</label>
        <small>(Comma-separated)</small>
      </div>
      <div>
        <input type="text" value={blacklistStr} onInput={updateBlacklistStr} disabled={!props.ready} />
      </div>
    </div>
  );
};
