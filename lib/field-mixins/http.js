import axios from 'axios';
import Attribute from '../attribute.js';
import { isInheritedFrom } from '../helper.js';

const attributeMixin = (superclass) => class extends superclass {
  httpParse() {
    return this.value;
  }
};

const associationMixin = (superclass) => class extends superclass {
  fetch(options) {
    return axios.get(this.url(), this.ModelClass.encode(options)).then((resp) => {
      this.value = resp.data;

      return resp;
    });
  }

  httpParse() {
    if (Array.isArray(this.value)) {
      return this.value.map((assocInstance) => assocInstance.httpParse());
    }

    return this.value && this.value.httpParse();
  }

  instantiate(properties, ...args) {
    return new (this.ModelClass)(properties, ...args);
  }

  url() {
    return `${ this.baseUrl }/${ this.ModelClass.urlResource() }`;
  }
};

export default (superclass) => {
  return (isInheritedFrom(superclass, Attribute)) ? attributeMixin(superclass) : associationMixin(superclass);
};
