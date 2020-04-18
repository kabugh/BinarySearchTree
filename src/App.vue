<template>
  <div class="app">
    <div class="actions__container">
      <div class="action">
        <h2>Zapisz do pliku</h2>
        <button type="button" @click="save">Zapisz</button>
      </div>
      <div class="action">
        <h2>Wczytaj z pliku</h2>
        <fileReader @load="loadedTree = $event"></fileReader>
      </div>
    </div>

    <div id="app" class="svg-container" ref="container"></div>
  </div>
</template>

<script>
import { run } from "./services/visualisation";
import { generateTree } from "./services/helperFunctions";
import BinarySearchTree from "./services/tree";
import FileReader from "./FileReader";
import FileSaver from "file-saver";

export default {
  name: "App",
  components: {
    FileReader
  },
  mounted() {
    this.tree = new BinarySearchTree();
    generateTree(this.tree, 5);
    let clonedTree = {};
    clonedTree = Object.assign(clonedTree, this.tree);
    run(clonedTree);
  },
  data: () => ({
    tree: {},
    loadedTree: ""
  }),
  methods: {
    save() {
      var blob = new Blob([JSON.stringify(this.tree)], {
        type: "text/plain;charset=utf-8"
      });

      FileSaver.saveAs(blob, "hello world.txt");
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
      run(this.loadedTree);
    }
  }
};
</script>

<style lang="scss">
.app {
  width: 100%;
  height: 100vh;
  .actions__container {
    display: flex;
    align-items: center;
    justify-content: center;
    .action {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 0 4vh;
    }
  }
  button {
    border: 2px solid black;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 16px;
  }
}
svg {
  /*background:gray;*/
  display: block;
  margin: auto;
}

.node circle {
  fill: #fff;
  stroke: steelblue;
  stroke-width: 3px;
  &:hover {
    fill: steelblue;
  }
}

.node text {
  font: 12px sans-serif;
}

.link {
  fill: none;
  stroke: #ccc;
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
}
.svg-content {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
