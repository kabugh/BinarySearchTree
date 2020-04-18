// const fs = require('fs');
import Queue from "./queue";
import Node from "./node";

export default class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  insert(data) {
    var newNode = new Node(data);
    if (this.root === null) this.root = newNode;
    else this.insertNode(this.root, newNode);
  }

  insertNode(node, newNode) {
    if (newNode.data < node.data) {
      if (node.left === null) node.left = newNode;
      else this.insertNode(node.left, newNode);
    } else {
      if (node.right === null) node.right = newNode;
      else this.insertNode(node.right, newNode);
    }
  }

  remove(data) {
    this.root = this.removeNode(this.root, data);
  }
  removeNode(node, key) {
    if (node === null) return null;
    else if (key < node.data) {
      node.left = this.removeNode(node.left, key);
      return node;
    } else if (key > node.data) {
      node.right = this.removeNode(node.right, key);
      return node;
    } else {
      if (node.left === null && node.right === null) {
        node = null;
        return node;
      }
      if (node.left === null) {
        node = node.right;
        return node;
      } else if (node.right === null) {
        node = node.left;
        return node;
      }

      let aux = this.findMinNode(node.right);
      node.data = aux.data;

      node.right = this.removeNode(node.right, aux.data);
      return node;
    }
  }

  inorder(node) {
    if (node !== null) {
      this.inorder(node.left);
      console.log(node.data);
      this.inorder(node.right);
    }
  }

  preorder(node) {
    if (node !== null) {
      console.log(node.data);
      this.preorder(node.left);
      this.preorder(node.right);
    }
  }

  postorder(node) {
    if (node !== null) {
      this.postorder(node.left);
      this.postorder(node.right);
      console.log(node.data);
    }
  }

  breadthFirst(root) {
    if (root === null) return;

    let queue = new Queue();
    queue.clear();
    queue.enqueue(root);
    // console.log(queue)
    while (!queue.isEmpty()) {
      let removedNode = queue.dequeue();
      console.log(removedNode.data);
      if (removedNode.left !== null) queue.enqueue(removedNode.left);
      if (removedNode.right !== null) queue.enqueue(removedNode.right);
    }
  }

  getRootNode() {
    return this.root;
  }

  clear() {
    this.root = null;
  }

  // saveToFile(object) {
  //   var str = JSON.stringify(object);
  //   try {
  //     const data = fs.writeFileSync("tree.txt", str);
  //     console.log('Zapisano do pliku.');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // readFromFile() {
  //   try {
  //     const data = fs.readFileSync("tree.txt", "utf8");
  //     console.log("Drzewo wczytane z pliku: " + data);
  //     return JSON.parse(data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
}
