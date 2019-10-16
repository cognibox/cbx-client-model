export default (superclass) => class extends superclass {
  httpParse() {
    return this.value;
  }
};
