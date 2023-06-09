import { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualiser.css";
import { dijkstra, getNodesInShortestPathOrder } from "./Algorithm/dijkstra";

import { dfs } from "./Algorithm/dfs";
import { bfs } from "./Algorithm/bfs";

export default class PathfidingVisualiser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      startNodeCol: 15,
      startNodeRow: 15,
      finishNodeCol: 40,
      finishNodeRow: 10,
      isWDown: false,
      mouseIsPressed: false,
    };
    this.makeGrid = this.makeGrid.bind(this);
    this.getRandomPosition = this.getRandomPosition.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    this.makeGrid();
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  handleKeyDown(event) {
    if (event.code === "KeyW") {
      this.setState({ isWDown: true });
    }
  }

  handleKeyUp(event) {
    if (event.code === "KeyW") {
      this.setState({ isWDown: false });
    }
  }

  handleMouse = (row, col) => {
    const { grid, isWDown } = this.state;
    if (!isWDown){
      const newGrid = setWall(grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  };
  
  handleMouseClick = (row, col) => {
    const { grid, mouseIsPressed, isWDown } = this.state;
    if (!isWDown){
      if (!mouseIsPressed) return;
      const newGrid = setWall(grid, row, col);
      this.setState({ grid: newGrid });
    }
  };
  
  handleMouseRe = () => {
    this.setState({ mouseIsPressed: false });
  };

  getRandomPosition() {
    const startCol = Math.floor(Math.random() * 49);
    const finishCol = Math.floor(Math.random() * 49);
    const startRow = Math.floor(Math.random() * 19);
    const finishRow = Math.floor(Math.random() * 19);

    this.setState({
      startNodeCol: startCol,
      startNodeRow: startRow,
      finishNodeCol: finishCol,
      finishNodeRow: finishRow,
    });
  }

  makeGrid() {
    const { startNodeCol, startNodeRow, finishNodeCol, finishNodeRow } =
      this.state;
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        const node = {
          col,
          row,
          isStart: row === startNodeRow && col === startNodeCol,
          isFinish: row === finishNodeRow && col === finishNodeCol,
          distance: Infinity,
          isVisited: false,
          isWall: false,
          previousNode: null,
          hasWeight: false,
        };
        currentRow.push(node);
      }

      grid.push(currentRow);
    }

    this.setState({ grid: grid });
  }

  animateSpot(visitedNodesInOrder) {
    const promises = [];
    for (let i = 1; i < visitedNodesInOrder.length; i++) {
      const promise = new Promise((resolve) => {
        setTimeout(() => {
          const node = document.getElementById(
            `node-${visitedNodesInOrder[i].row}-${visitedNodesInOrder[i].col}`
          );
          node.classList.add("node-visited-animation");
          setTimeout(() => {
            node.classList.remove("node-visited-animation");
            node.classList.add("node-visited");
            resolve();
          }, 400);
        }, 10 * i);
      });
      promises.push(promise);
    }
    return Promise.all(promises);
  }

  animatePath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = document.getElementById(
          `node-${nodesInShortestPathOrder[i].row}-${nodesInShortestPathOrder[i].col}`
        );
        node.classList.add("node-shortest-path-yellow");
        setTimeout(() => {
          node.classList.add("node-shortest-path");
        }, 100);
      }, 50 * i);
    }
  }

  async visualizeDijkstra() {
    const { grid, startNodeCol, startNodeRow, finishNodeCol, finishNodeRow } =
      this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    await this.animateSpot(visitedNodesInOrder);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animatePath(nodesInShortestPathOrder);
  }

  async visualizeDfs() {
    const { grid, startNodeCol, startNodeRow, finishNodeCol, finishNodeRow } =
      this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    await this.animateSpot(visitedNodesInOrder);
  }

  async visualizeBfs() {
    const { grid, startNodeCol, startNodeRow, finishNodeCol, finishNodeRow } =
      this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    await this.animateSpot(visitedNodesInOrder);
  }

  async resetGrid() {
    await this.getRandomPosition();
    const { grid, startNodeCol, startNodeRow, finishNodeCol, finishNodeRow } =
      this.state;
    for (const row of grid) {
      for (const node of row) {
        if (node.col === startNodeCol && node.row === startNodeRow) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
          node.isStart = true;
        } else if (node.col === finishNodeCol && node.row === finishNodeRow) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
          node.isFinish = true;
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
          node.isStart = false;
          node.isFinish = false;
        }
        node.isVisited = false;
        node.isWall = false;
        node.previousNode = null;
        node.distance = Infinity;
        node.hasWeight = false;
      }
    }
  }

  handleNodeClick(row, col) {
    const { isWDown } = this.state;
    if (isWDown) {
      const { grid } = this.state;
      const newGrid = grid.slice();
      const node = newGrid[row][col];

      const newNode = {
        ...node,
        hasWeight: !node.hasWeight,
      };

      if (newNode.hasWeight) {
        document
          .getElementById(`node-${row}-${col}`)
          .classList.add("node-wheight");
      } else {
        document
          .getElementById(`node-${row}-${col}`)
          .classList.remove("node-wheight");
      }

      newGrid[row][col] = newNode;

      this.setState({ grid: newGrid });
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <div>
        <div className="navBar">
          <button
            className="visualize-btn"
            onClick={() => this.visualizeDfs()}
          >
            Visualize Depth First Search
          </button>
          <button
            className="visualize-btn"
            onClick={() => this.visualizeBfs()}
          >
            Visualize Breadth First Search
          </button>
          <button
            className="visualize-btn"
            onClick={() => this.visualizeDijkstra()}
          >
            Visualize Dijkstra's Algorithm
          </button>
          <button className="reset-btn" onClick={() => this.resetGrid()}>
            Reset Grid
          </button>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { col, row, isStart, isFinish, isWall } = node;
                  return (
                    <div
                      className="node"
                      onClick={() => this.handleNodeClick(row, col)}
                    >
                      <Node
                        key={nodeIdx}
                        col={col}
                        row={row}
                        isStart={isStart}
                        isFinish={isFinish}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) => this.handleMouse(row, col)}
                        onMouseEnter={(row, col) =>
                          this.handleMouseClick(row, col)
                        }
                        onMouseUp={() => this.handleMouseRe()}
                      ></Node>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const setWall = (grid, row, col) => {
  return grid.map((rowArr, r) => {
    if (r !== row) return rowArr;
    return rowArr.map((node, c) => {
      if (c !== col) return node;
      return {
        ...node,
        isWall: !node.isWall,
      };
    });
  });
};

