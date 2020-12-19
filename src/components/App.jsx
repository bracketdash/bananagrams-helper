import { useState } from "react";
import Blacklist from "./components/Blacklist";
import Solver from "./classes/Solver";
import Tray from "./components/Tray";

export default () => {
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
