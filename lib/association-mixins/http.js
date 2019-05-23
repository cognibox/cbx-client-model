import axios from 'axios';

const mixin = (superclass) => class extends superclass {
  fetch() {
    return axios.get(this.url()).then((resp) => {
      this.value = resp.data;

      return resp;
    });
  }

  instantiate(properties, options = {}, ...args) {
    options.baseUrl = this.constructorOptions.baseUrl;

    return new (this.modelClass())(properties, options, ...args);
  }

  url() {
    return `${ this.constructorOptions.baseUrl }/${ this.modelClass().urlResource() }`;
  }
};

export default mixin;
