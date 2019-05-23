import axios from 'axios';

const mixin = (superclass) => class extends superclass {
  constructor(...args) {
    super(...args);

    this.baseUrl = this.constructorOptions.baseUrl;
  }

  fetch() {
    return axios.get(this.url()).then((resp) => {
      this.value = resp.data;

      return resp;
    });
  }

  url() {
    return `${ this.baseUrl }/${ this.modelClass().urlResource() }`;
  }
};

export default mixin;
