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
            nodes: [],
        };
    }

    componentDidMount(){
        const nodes = [];
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

           nodes.push(currentRow);
        }

        this.setState({nodes});
    }

    visualizeDijkstra(){
        const {nodes} = this.state;
        const startNode = nodes[START_NODE_ROW][START_NODE_COL];
        const finishNode = nodes[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(nodes, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    }

    render(){
        const {nodes} = this.state;
        return (
            <>
                <button onClick={() => this.visualizeDijkstra()}>
                Visualize Dijkstra's Algorithm
                </button>
                <div className="grid">
                    {nodes.map((node, rowIdx) =>{
                        return <div key={rowIdx}>
                            {node.map((node, nodeIdx) => <Node></Node>)}
                        </div>
                    })}
                </div>
            </>
        );
    }
}