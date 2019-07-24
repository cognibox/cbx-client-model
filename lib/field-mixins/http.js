import axios from 'axios';
import Attribute from '../attribute.js';
import { isInheritedFrom } from '../helper.js';

const attributeMixin = (superclass) => class extends superclass {
  httpParse() {
    return this.value;
  }
};

const associationMixin = (superclass) => class extends superclass {
  fetch({ url, config = {} } = {}) {
    url = url || this.url();
    const encodedConfig = this.ModelClass.encodeSyncConfig(config);

    return axios.get(url, encodedConfig).then((resp) => {
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
