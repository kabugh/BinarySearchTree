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
