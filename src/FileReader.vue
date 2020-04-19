<template>
  <label class="text-reader">
    Wczytaj
    <input type="file" @change="loadTextFromFile" />
  </label>
</template>

<script>
export default {
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => this.$emit("load", JSON.parse(e.target.result));
      reader.readAsText(file);
    }
  }
};
</script>

<style lang="scss">
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;
  border: 2px solid black;
  background-color: #db0a5b;
  padding: 4px 12px;
  font-size: 14px !important;
  cursor: pointer;
  transition: all 0.5s ease-in;
  &:hover {
    background-color: black;
    color: white;
  }
  input {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    opacity: 0;
  }
}
</style>
