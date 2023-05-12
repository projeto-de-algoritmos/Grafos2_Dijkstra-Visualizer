export class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }

  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.heap.length;
  }

  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.heap.length;
  }

  parent(index) {
    return this.heap[this.getParentIndex(index)];
  }

  leftChild(index) {
    return this.heap[this.getLeftChildIndex(index)];
  }

  rightChild(index) {
    return this.heap[this.getRightChildIndex(index)];
  }

  swap(index1, index2) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }

  peek() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0];
  }

  pop() {
    if (this.heap.length === 0) {
      return null;
    }
    const item = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return item;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  push(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  update(obj, newDistance) {
    const index = this.heap.findIndex(item => item === obj);
    if (index < 0) {
      this.push(obj)
    }
    const oldDistance = obj.distance;
    if (newDistance < oldDistance) {
      obj.distance = newDistance;
      this.heapifyUp(index);
    } 
  }

  heapifyUp(index = this.heap.length - 1) {
    while (this.hasParent(index) && this.parent(index).distance > this.heap[index].distance) {
      const parentIndex = this.getParentIndex(index);
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  heapifyDown(index = 0) {
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (this.hasRightChild(index) && this.rightChild(index).distance < this.leftChild(index).distance) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      if (this.heap[index].distance < this.heap[smallerChildIndex].distance) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
        index = smallerChildIndex;
      }
    }
  }
}
