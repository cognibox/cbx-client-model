export default (superclass) => class extends superclass {
  httpParse(key) {
    return { [key]: this.value };
  }
};
