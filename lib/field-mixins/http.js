import axios from 'axios';

export default (superclass) => class extends superclass {
  fetch(options) {
    return axios.get(this.url(), this.modelClass().encode(options)).then((resp) => {
      this.value = resp.data;

      return resp;
    });
  }

  instantiate(properties, options = {}, ...args) {
    options.baseUrl = this.constructorOptions.baseUrl;

    return new (this.modelClass())(properties, options, ...args);
  }

  url() {
    return `${this.constructorOptions.baseUrl}/${this.modelClass().urlResource()}`;
  }
};
