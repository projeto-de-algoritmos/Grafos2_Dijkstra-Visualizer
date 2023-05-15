export function dfs(grid, startNode, finishNode) {
    const visitedNodes = [];
    const stack = [];
    stack.push(startNode);
    
    while(stack.length > 0){
        const node = stack.shift();
        
        if(!node.isWall && !node.isVisited){
            node.isVisited = true;
            visitedNodes.push(node);
            if(node === finishNode){
                return visitedNodes;
            }
            const neighbors = getNeighbors(node, grid)
            for(const neighbor of neighbors){
                stack.unshift(neighbor);
            }
        }
    }

    return visitedNodes;
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
}