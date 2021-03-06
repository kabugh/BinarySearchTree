export default class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) return "Underflow";
    return this.items.shift();
  }

  first() {
    if (this.isEmpty()) return "No elements in Queue";
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  clear() {
    if (!this.items.length === 0) this.items = [];
  }

  displayItems() {
    let str = "";
    for (let item in this.items) {
      str += `${item.data}, `;
    }
    return str;
  }
}
