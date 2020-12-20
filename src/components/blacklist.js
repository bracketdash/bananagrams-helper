import { useState } from "react";

import { solve } from "../models/solver";

export default (props) => {
  const [blacklistStr, setBlacklistStr] = useState("");

  const updateBlacklistStr = (event) => {
    const newBlacklistStr = event.target.value.replace(/[^A-Z,]/gi, "").toLowerCase();
    setBlacklistStr(newBlacklistStr);
    solve(false, newBlacklistStr);
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
