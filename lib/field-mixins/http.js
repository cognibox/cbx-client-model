import { sync } from '../helper';
import result from 'lodash/result';

export default (superclass) => class extends superclass {
  constructor({ url }) {
    super(...arguments);

    this.overrideUrl = url;
  }

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

  httpParse(key) {
    let value;

    if (Array.isArray(this.value)) {
      value = this.value.map((assocInstance) => assocInstance.httpParse());
    } else {
      value = this.value && this.value.httpParse();
    }

    return { [key]: value };
  }

  instantiate(properties, ...args) {
    return new (this.ModelClass)(properties, ...args);
  }

  url() {
    return result(this, 'overrideUrl') || `${ this.baseUrl }/${ this.ModelClass.urlResource() }`;
  }
};
