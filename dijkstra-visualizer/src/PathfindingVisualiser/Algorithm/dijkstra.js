import { MinHeap } from "./heap";

export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const heap = new MinHeap();
    heap.push(startNode);

    while (!heap.isEmpty()) {
      const closestNode = heap.pop();
      if (closestNode.isWall) continue;
  
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      if (closestNode === finishNode) return visitedNodesInOrder;

      const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
      for (const neighbor of unvisitedNeighbors) {
        if(!neighbor.hasWeight){
          heap.update(neighbor, closestNode.distance + 1);
        } else{
          heap.update(neighbor, closestNode.distance + 10);
        }
        
        neighbor.previousNode = closestNode;
      }

    }
  }
  
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }