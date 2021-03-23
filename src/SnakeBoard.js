import React, {useState} from "react";
import {useInterval} from "./utils";
import "./SnakeBoard.css";

const SnakeBoard = () => {
  const height = 15;
  const width = 15;
  var initialRows = [];
  for (var i = 0; i < height; i++) {
    initialRows[i] = [];
    for (var j = 0; j < width; j++) {
      initialRows[i][j] = "blank";
    }
  }

  const randomPosition = () => {
    const position = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
    return position;
  };

  const [rows, setRows] = useState(initialRows);
  const [snake, setSnake] = useState([{x: 2, y: 5}]);
  const [direction, setDirection] = useState("right");
  const [food, setFood] = useState(randomPosition);

  const changeDirectionWithKeys = e => {
    const {keyCode} = e;
    switch (keyCode) {
      case 37:
        setDirection("left");
        break;
      case 38:
        setDirection("top");
        break;
      case 39:
        setDirection("right");
        break;
      case 40:
        setDirection("bottom");
        break;
    }
  };
  document.addEventListener("keydown", changeDirectionWithKeys);
  const displayRows = rows.map((row, i) => (
    <div className="Snake-row" key={i}>
      {row.map((tile, j) => (
        <div className={`tile ${tile}`} key={j} />
      ))}
    </div>
  ));

  const displaySnake = () => {
    const newRows = initialRows;
    snake.forEach(tile => {
      newRows[tile.x][tile.y] = "snake";
    });
    newRows[food.x][food.y] = "food";
    setRows(newRows);
  };

  const moveSnake = () => {
    const newSnake = [];
    switch (direction) {
      case "right":
        newSnake.push({x: snake[0].x, y: (snake[0].y + 1) % width});
        break;
      case "left":
        newSnake.push({x: snake[0].x, y: (snake[0].y - 1 + width) % width});
        break;
      case "top":
        newSnake.push({x: (snake[0].x - 1 + height) % height, y: snake[0].y});
        break;
      case "bottom":
        newSnake.push({x: (snake[0].x + 1) % height, y: snake[0].y});
        break;
      default:
        break;
    }

    snake.forEach(tile => {
      newSnake.push(tile);
    });

    const madonPaa = snake[0];
    if (madonPaa.x === food.x && madonPaa.y === food.y) {
      setFood(randomPosition);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
    displaySnake();
  };

  useInterval(moveSnake, 250);

  return <div className="Snake-board">{displayRows}</div>;
};

export default SnakeBoard;
