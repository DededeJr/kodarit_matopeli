import React, {useState} from "react";
import "./SnakeBoard.css";

const SnakeBoard = () => {
  const height = 10;
  const width = 10;
  var initialRows = [];
  for (var i = 0; i < height; i++) {
    initialRows[i] = [];
    for (var j = 0; j < width; j++) {
      initialRows[i][j] = "blank";
    }
  }
  const [rows, setRows] = useState(initialRows);
  const [snake, setSnake] = useState([{x: 2, y: 5}]);
  const [direction, setDirection] = useState("right")

  const displayRows = rows.map(row => (
    <div className="Snake-row">
      {row.map(tile =>
        <div className={`tile ${tile}`} />
      )}
    </div>
  ));

  return <div className="Snake-board">{displayRows}</div>;
};

export default SnakeBoard;