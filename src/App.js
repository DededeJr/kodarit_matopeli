import React, {useState} from "react";
import "./App.css";
import SnakeBoard from "./SnakeBoard";
import Points from "./Points";
import LeaderBoard from "./LeaderBoard";

function App() {
  const [points, setPoints] = useState(0);
  return (
    <div className="App">
      <header className="App-header">Matopeli</header>
      <Points points={points} />
      <SnakeBoard points={points} setPoints={setPoints} />
      <button onClick={() => window.location.reload()}>New Game</button>
      <LeaderBoard />
    </div>
  );
}

export default App;
