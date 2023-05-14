import { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualiser.css"
import {dijkstra, getNodesInShortestPathOrder} from './Algorithm/dijkstra';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfidingVisualiser extends Component{
    constructor(props){
        super(props);
        this.state = {
            grid: [],
        };
        this.makeGrid = this.makeGrid.bind(this);
    }

    componentDidMount(){
        this.makeGrid()
    }

    makeGrid(){
        const grid = [];
        for (let row = 0; row < 20; row++) {
           const currentRow = [];
           for(let col =0; col < 50; col++){
                const node = {
                    col,
                    row,
                    isStart: row === START_NODE_ROW && col === START_NODE_COL,
                    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
                    distance: Infinity,
                    isVisited: false,
                    isWall: false,
                    previousNode: null,
                }
                currentRow.push(node);
           }

           grid.push(currentRow);
        }

        this.setState({grid: grid});
    }

    animateDijkstraSpot(visitedNodesInOrder){
        for (let i = 2; i < visitedNodesInOrder.length -1; i++) {
            setTimeout(() => {
                const node = document.getElementById(`node-${visitedNodesInOrder[i].row}-${visitedNodesInOrder[i].col}`);
                node.classList.add('node-visited-animation');
                setTimeout(() => {
                    node.classList.remove('node-visited-animation');
                    node.classList.add('node-visited');
                }, 400);
            }, 10 * i);
        }
    }

    visualizeDijkstra(){
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        this.animateDijkstraSpot(visitedNodesInOrder);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    }

    resetGrid(){
        const {grid} = this.state;

        for (const row of grid) {
            for (const node of row) {
                if(node.isStart){
                    document.getElementById(`node-${node.row}-${node.col}`).className ='node node-start';
                }
                else if(node.isFinish){
                    document.getElementById(`node-${node.row}-${node.col}`).className ='node node-finish';
                } else{
                    document.getElementById(`node-${node.row}-${node.col}`).className ='node';
                }
                node.isVisited = false;
                node.isWall = false;
                node.previousNode = null;
                node.distance = Infinity;
            }
        }
    }

    render(){
        const {grid} = this.state;
        return (
            <div>
                <div className="navBar">
                    <button className="visualize-btn"onClick={() => this.visualizeDijkstra()}>
                        Visualize Dijkstra's Algorithm
                    </button>
                    <button className="reset-btn"onClick={() => this.resetGrid()}>
                        Reset Grid
                    </button>
                </div>
                <div className="grid">
                    {grid.map((row, rowIdx) =>{
                        return <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const {col, row, isStart, isFinish} = node;
                                return(
                                    <Node key={nodeIdx} col={col} row={row} isStart={isStart} isFinish={isFinish}></Node>
                                )
                            })}
                        </div>
                    })}
                </div>
            </div>
        );
    }
}