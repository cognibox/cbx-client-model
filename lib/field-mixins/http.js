import Attribute from '../attribute.js';
import { isInheritedFrom } from '../helper.js';
import { sync } from '../helper';

const attributeMixin = (superclass) => class extends superclass {
  httpParse() {
    return this.value;
  }
};

const associationMixin = (superclass) => class extends superclass {
  sync({ method, url, options }) {
    return sync({ method, url, options });
  }

  fetch({ url, options = {} } = {}) {
    url = url || this.url();

    return sync({ method: 'get', url, options }).then((resp) => {
      this.value = resp.data;

      this.setPristine();

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
