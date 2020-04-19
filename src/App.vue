<template>
  <div class="app">
    <div class="controls__container">
      <div class="actions__container">
        <div class="action" v-if="tree.root">
          <h2>Dodaj element</h2>
          <label for="number">Podaj numer do dodania</label>
          <input type="number" v-model="nodeToInsert" />
          <button
            type="button"
            @click="insertNode(tree, parseInt(nodeToInsert))"
          >
            Dodaj
          </button>
        </div>
        <div class="action create">
          <h2>Utwórz drzewo</h2>
          <label for="number">Podaj rozmiar</label>
          <input type="number" v-model="size" />
          <button type="button" @click="createTree">Utwórz</button>
        </div>
        <div class="action" v-if="tree.root">
          <h2>Usun element</h2>
          <label for="number">Podaj numer do usuniecia</label>
          <input type="number" v-model="nodeToRemove" />
          <button
            type="button"
            @click="removeNode(tree, parseInt(nodeToRemove))"
          >
            Usuń
          </button>
        </div>
      </div>
      <div class="actions__container">
        <div class="action" v-if="tree.root">
          <h2>Zapisz do pliku</h2>
          <button type="button" @click="saveToFile">Zapisz</button>
        </div>
        <div class="action load">
          <h2>Wczytaj z pliku</h2>
          <fileReader @load="loadedTree = $event"></fileReader>
        </div>
        <div class="action" v-if="tree.root">
          <h2>Najmniejszy element</h2>
          <button type="button" @click="handleMinNode(tree.root)">
            Szukaj
          </button>
        </div>
      </div>
      <div class="traversing__container" v-if="tree.root">
        <div class="action">
          <h2>Przejdź po drzewie</h2>
          <div class="buttons__container">
            <button type="button" @click="inorder">inorder</button>
            <button type="button" @click="breadthFirst">breadthFirst</button>
            <button type="button" @click="postorder">postorder</button>
          </div>
        </div>
      </div>
      <div class="credits">
        <h2>
          Stworzone w <img src="@/assets/vue.png" alt="vue" /> +
          <img src="@/assets/d3.png" alt="vue" />
        </h2>
        <h3>by kabugh</h3>
      </div>
    </div>
    <div id="app" class="svg-container" ref="container"></div>
  </div>
</template>

<script>
// Wczytane drzewo traci dostęp do metod wewnątrz klas
import { run } from "./services/visualisation";
import {
  generateTree,
  inorder,
  preorder,
  postorder,
  breadthFirst,
  insert,
  remove
} from "./services/helperFunctions";
import BinarySearchTree from "./services/tree";
import FileReader from "./FileReader";
import FileSaver from "file-saver";
export default {
  name: "App",
  components: {
    FileReader
  },
  data: () => ({
    tree: {},
    size: 5,
    loadedTree: "",
    nodeToInsert: 0,
    nodeToRemove: 0
  }),
  methods: {
    createTree() {
      this.$refs.container.children.forEach(child => {
        if (child.className !== this.tree.root.data) {
          this.$refs.container.removeChild(child);
        }
      });
      this.tree = new BinarySearchTree();
      console.log(this.tree);
      generateTree(this.tree, this.size);
      let clonedTree = {};
      clonedTree = Object.assign(clonedTree, this.tree);
      run(clonedTree);
    },
    saveToFile() {
      var blob = new Blob([JSON.stringify(this.tree)], {
        type: "text/plain;charset=utf-8"
      });

      FileSaver.saveAs(blob, "hello world.txt");
    },
    inorder() {
      console.clear();
      this.restartTree();
      inorder(this.tree.root);
    },
    preorder() {
      console.clear();
      this.restartTree();
      preorder(this.tree.root);
    },
    postorder() {
      console.clear();
      this.restartTree();
      postorder(this.tree.root);
    },
    breadthFirst() {
      console.clear();
      this.restartTree();
      breadthFirst(this.tree.root);
    },
    restartTree() {
      if (this.$refs.container.hasChildNodes)
        this.$refs.container.children.forEach(child => {
          if (child.className !== this.tree.root.data) {
            this.$refs.container.removeChild(child);
          }
        });
      run(this.tree);
    },
    insertNode(tree, node) {
      console.log(tree);
      insert(tree, node);
      if (this.$refs.container.hasChildNodes)
        this.$refs.container.children.forEach(child => {
          if (child.className !== this.tree.root.data) {
            this.$refs.container.removeChild(child);
          }
        });
      run(tree);
    },
    removeNode(tree, node) {
      remove(tree, node);
      if (this.$refs.container.hasChildNodes)
        this.$refs.container.children.forEach(child => {
          if (child.className !== this.tree.root.data) {
            this.$refs.container.removeChild(child);
          }
        });
      run(tree);
    },
    findMinNode(node) {
      if (node.left === null) {
        document.querySelector(`.n${node.data}`).classList.add("active");
        return node;
      } else {
        return this.findMinNode(node.left);
      }
    },
    handleMinNode(node) {
      console.log(this.findMinNode(node));
    },
    test() {
      let bst = new BinarySearchTree();
      bst.insert(50);
      bst.insert(3);
      bst.insert(31);
      bst.insert(29);
      bst.insert(22);
      bst.insert(17);

      bst.remove(3);
      console.log("min: " + bst.findMinNode);
      bst.postorder(bst.getRootNode());
    }
  },
  watch: {
    loadedTree() {
      if (this.$refs.container.hasChildNodes)
        this.$refs.container.children.forEach(child => {
          if (child.className !== this.loadedTree.root.data) {
            this.$refs.container.removeChild(child);
          }
        });
      this.tree = this.loadedTree;
      run(this.tree);
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
$primary: #db0a5b;
body {
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
}
.app {
  // width: 100%;
  height: 100vh;

  text-align: center;

  h2 {
    font-size: 1rem;
    font-weight: 400;
  }

  h3 {
    font-size: 0.75rem;
    font-weight: 400;
    margin-top: 4vh;
    margin-bottom: 0;
  }

  .credits {
    img {
      width: 16px;
      height: 16px;
    }
  }

  input {
    outline: none;
    background-color: $primary;
    color: white;
    font-size: 14px;
    max-width: 110px;
    text-align: center;
    padding: 6px 0;
    border: 2px solid black;
  }
  .controls__container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #913d88;
    padding: 4vh 0;
    color: white;
  }

  .actions__container {
    display: grid;
    padding: 0.5vh 0;
    margin: 0 auto;
    grid-template-columns: repeat(3, minmax(150px, 1fr));
    .action {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 0 2vh;
      &.create,
      &.load {
        grid-column: 2;
      }
      label {
        font-size: 1rem;
      }
      input {
        margin: 2vh 0;
      }
      .buttons__container {
        display: flex;
      }
    }
  }
  .traversing__container {
    flex-direction: row;
    h2 {
      margin-bottom: 0;
    }
    button {
      margin: 2vh;
    }
  }
  button {
    border: 2px solid black;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 15px;
    transition: all 0.5s ease-in;
    outline: none;
    color: white;
    background-color: $primary;
    &:hover {
      background-color: black;
    }
  }
}
svg {
  display: block;
  margin: auto;
}

.node {
  circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 3px;
    transition: all 0.3s cubic-bezier(0.83, 0, 0.17, 1);
    &.active {
      fill: steelblue !important;
    }
  }
  text {
    font: 12px sans-serif;
    fill: white !important;
  }
}

.link {
  fill: none;
  stroke: white !important;
  opacity: 0.4;
  stroke-width: 2px;
}

.hidden {
  stroke: rgba(0, 0, 0, 0.1);
}
.node.hidden {
  fill: rgba(0, 0, 0, 0.1) !important;
  stroke: rgba(0, 0, 0, 0.1);
}
.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  vertical-align: top;
  overflow: hidden;
  background-color: #913d88;
}
.svg-content {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
