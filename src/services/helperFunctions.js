import Node from "./node";

export function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateTree(bst, numberOfElements) {
  let numbers = [];
  for (let i = 0; i < numberOfElements; i++) {
    let number = randomRange(1, 100);
    if (!numbers.includes(number)) {
      numbers.push(number);
      bst.insert(number);
    }
  }
}

export function myXOR(a, b) {
  return (a || b) && !(a && b);
}

export function inorder(node) {
  // if (node !== null) {
  //   inorder(node.left);
  //   console.log(node.data);
  //   inorder(node.right);
  // }
  // if (node === null) return;
  // version above uses recursion, but in order to store all the elements in an array, the non-recursive version is used
  let queue = [];
  let order = [];
  let curr = node;

  while (curr != null || queue.length > 0) {
    while (curr != null) {
      queue.push(curr);
      curr = curr.left;
    }
    curr = queue.pop();

    if (curr != undefined) {
      order.push(curr.data);
    }

    curr = curr.right;
  }

  // delay for animation
  for (let i = 0; i < order.length; i++) {
    setTimeout(() => {
      document.querySelector(`.n${order[i]}`).classList.add("active");
    }, i * 500);
  }
}

export function postorder(node) {
  // recursive
  // if (node !== null) {
  //   postorder(node.left);
  //   postorder(node.right);
  //   console.log(node.data);
  // }
  // non-recursive
  let stack1 = [];
  let stack2 = [];
  let order = [];

  if (node == null) return order;

  stack1.push(node);
  while (stack1.length !== 0) {
    let curr = stack1.pop();
    stack2.push(curr);

    if (curr.left != null) stack1.push(curr.left);
    if (curr.right != null) stack1.push(curr.right);
  }

  while (stack2.length !== 0) {
    order.push(stack2.pop().data);
  }

  // delay for animation
  for (let i = 0; i < order.length; i++) {
    setTimeout(() => {
      console.log(order[i]);
      document.querySelector(`.n${order[i]}`).classList.add("active");
    }, i * 500);
  }
}

export function preorder(node) {
  if (node !== null) {
    console.log(node.data);
    setTimeout(() => {
      document.querySelector(`.n${node.data}`).classList.add("active");
      preorder(node.left);
      preorder(node.right);
    }, 800);
  }
}

export function breadthFirst(node) {
  if (node !== null) {
    console.log(node.data);
    setTimeout(() => {
      document.querySelector(`.n${node.data}`).classList.add("active");
      preorder(node.left);
      preorder(node.right);
    }, 800);
  }
}

function findMinNode(node) {
  if (node.left === null) return node;
  else return findMinNode(node.left);
}

export function insert(tree, data) {
  var newNode = new Node(data);
  if (tree.root === null) tree.root = newNode;
  else insertNode(tree.root, newNode);
}

function insertNode(node, newNode) {
  console.log(newNode.data, node.data, newNode.data < node.data);
  if (newNode.data < node.data) {
    console.log(node.left);
    if (node.left === null) node.left = newNode;
    else insertNode(node.left, newNode);
  } else {
    if (node.right === null) node.right = newNode;
    else insertNode(node.right, newNode);
  }
}

export function remove(tree, data) {
  tree.root = removeNode(tree.root, data);
}

function removeNode(node, key) {
  if (node === null) return null;
  else if (key < node.data) {
    node.left = removeNode(node.left, key);
    return node;
  } else if (key > node.data) {
    node.right = removeNode(node.right, key);
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

    let aux = findMinNode(node.right);
    node.data = aux.data;

    node.right = removeNode(node.right, aux.data);
    return node;
  }
}
