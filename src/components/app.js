import { useState } from "react";

import { BOARD_ARRAY, MESSAGE, READY, TRAY } from "../util/symbols";

import { onUpdate, solve } from "../services/solver";

import Blacklist from "./blacklist";
import Tray from "./tray";

export default () => {
  const [boardArr, setBoardArr] = useState([[" "]]);
  const [message, setMessage] = useState("Loading...");
  const [ready, setReady] = useState(false);
  const [remainingTray, setRemainingTray] = useState("");

  const setters = new Map();
  setters.set(BOARD_ARRAY, setBoardArr);
  setters.set(MESSAGE, setMessage);
  setters.set(READY, setReady);
  setters.set(TRAY, setRemainingTray);

  onUpdate((update) => {
    [...update.keys()].forEach((key) => {
      setters.get(key)(update.get(key));
    });
    if (update.has(READY)) {
      solve();
    }
  });

  return (
    <div>
      <div className="header">
        <h1>Bananagrams Helper</h1>
      </div>
      <Tray />
      <Blacklist />
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
