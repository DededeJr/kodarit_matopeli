import React, {useState} from "react";
import {useInterval, range} from "./utils";
import "./SnakeBoard.css";

const SnakeBoard = ({points, setPoints}) => {
  const [height, setHeight] = useState(
    localStorage.getItem("snake-board-size") || 15
  );
  const [width, setWidth] = useState(
    localStorage.getItem("snake-board-size") || 15
  );
  const getInitialRows = () => {
    var initialRows = [];
    for (var i = 0; i < height; i++) {
      initialRows[i] = [];
      for (var j = 0; j < width; j++) {
        initialRows[i][j] = "blank";
      }
    }
    return initialRows;
  };

  const getObstacles = () => [
    {name: "tyhjä", location: []},
    {
      name: "keski",
      location: range(width * 0.6).map(y => ({
        x: Math.round(height / 2),
        y: y + Math.ceil(width * 0.2)
      }))
    },
    {
      name: "reunat",
      location: [
        ...range(width).map(x => ({x, y: 0})),
        ...range(width).map(x => ({x, y: width - 1})),
        ...range(height).map(y => ({x: 0, y})),
        ...range(height).map(y => ({x: height - 1, y}))
      ]
    },
    {
      name: "oma",
      location: [
        {x: 2, y: 5},
        {x: 2, y: 4},
        {x: 2, y: 3},
        {x: 3, y: 3},
        {x: 4, y: 3}
      ]
    }
  ];

  const randomObstacle = () =>
    getObstacles()[Math.floor(Math.random() * getObstacles().length)];

  const randomPosition = () => {
    const position = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
    if (
      obstacle.location.some(({x, y}) => position.x === x && position.y === y)
    ) {
      return randomPosition();
    }
    return position;
  };

  const [obstacle, setObstacle] = useState(randomObstacle);
  const [rows, setRows] = useState(getInitialRows);
  const [snake, setSnake] = useState([{x: 1, y: 1}]);
  const [direction, setDirection] = useState("right");
  const [food, setFood] = useState(randomPosition);
  const [intervalId, setIntervalId] = useState();
  const [isGameOver, setIsGameOver] = useState(false);
  const [startGame, setStartGame] = useState(null);

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
    const newRows = getInitialRows();
    snake.forEach(tile => {
      newRows[tile.x][tile.y] = "snake";
    });
    newRows[food.x][food.y] = "food";
    obstacle.location.forEach(tile => {
      newRows[tile.x][tile.y] = "obstacle";
    });
    setRows(newRows);
  };

  const checkGameOver = () => {
    const head = snake[0];
    const body = snake.slice(1, -1);
    const hitSnake = body.find(b => b.x === head.x && b.y === head.y);
    const hitWall = obstacle.location.some(
      ({x, y}) => head.x === x && head.y === y
    );
    return hitSnake || hitWall;
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

    if (checkGameOver()) {
      setIsGameOver(true);
      clearInterval(intervalId);
      const pointsList = JSON.parse(localStorage.getItem("snake-points")) || [];
      const name = prompt("Game ended. What's your name:");
      pointsList.push({name, points});
      localStorage.setItem("snake-points", JSON.stringify(pointsList));
      window.dispatchEvent(new Event("storage"));
    }

    if (checkGameOver()) {
      setIsGameOver(true);
    }

    snake.forEach(tile => {
      newSnake.push(tile);
    });

    const madonPaa = snake[0];
    if (madonPaa.x === food.x && madonPaa.y === food.y) {
      setFood(randomPosition);
      setPoints(points + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
    displaySnake();
  };

  useInterval(moveSnake, 150, setIntervalId);

  return (
    <div className="Snake-board">
      {!startGame && (
        <>
          <div>The map is {width} tiles big</div>
          <div>You can change map size here:</div>
          <input
            className="Board-size"
            placeholder="Size from 10-100"
            type="number"
            onChange={e => {
              const size = e.target.value;
              if (size <= 100 && size >= 10) {
                console.log("OK", size);
                setWidth(size);
                setHeight(size);
                localStorage.setItem("snake-board-size", size);
              } else {
                console.error("bad", size);
              }
            }}
          />
          <button className="Start-game" onClick={setStartGame}>
            Start
          </button>
        </>
      )}
      {displayRows}
      {isGameOver && <div className="Game-over">Game over!</div>}
    </div>
  );
};

export default SnakeBoard;
