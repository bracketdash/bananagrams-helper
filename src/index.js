import "./assets/styles.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Solver from "./solver";

const Tray = (props) => {
  const [trayStr, setTrayStr] = useState("");
  const updateTrayStr = (event) => {
    const newTrayStr = event.target.value.replace(/[^A-Z]/gi, "").toLowerCase();
    setTrayStr(newTrayStr);
    Solver.solve({ blacklistStr, trayStr: newTrayStr });
  };
  return (
    <div className="letterbox">
      <input type="text" placeholder="yourtileshere" value={trayStr} onInput={updateTrayStr} disabled={!props.ready} />
    </div>
  );
};

const Blacklist = (props) => {
  const [blacklistStr, setBlacklistStr] = useState("");
  const updateBlacklistStr = (event) => {
    const newBlacklistStr = event.target.value.replace(/[^A-Z,]/gi, "").toLowerCase();
    setBlacklistStr(newBlacklistStr);
    Solver.solve({ blacklistStr: newBlacklistStr, trayStr });
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

const App = () => {
  const [boardArr, setBoardArr] = useState([[" "]]);
  const [message, setMessage] = useState("Loading...");
  const [ready, setReady] = useState(false);
  const [remainingTray, setRemainingTray] = useState("");
  const setters = { setBoardArr, setMessage, setReady, setRemainingTray };
  Solver.onUpdate((update) => Object.keys(update).forEach((key) => setters[`set${key.slice(0, 1).toUpperCase()}${key.slice(1)}`](update[key])));
  return (
    <div>
      <div className="header">
        <h1>Bananagrams Helper</h1>
      </div>
      <Tray ready={ready} />
      <Blacklist ready={ready} />
      <div className="boardbox">
        <div className="board">
          {boardArr.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} className={cell === " " ? "cell empty" : "cell"}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="tray">{remainingTray}</div>
      <div className="message">{message}</div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);
