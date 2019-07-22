import axios from 'axios';
import Association from '../attribute.js';
import { isInheritedFrom } from '../helper.js';

const mixin = (superclass) => class extends superclass {
  static urlResource() {}

  static urlRoot() {}

  static buildUrl(id) {
    const parts = [this.urlRoot(), this.urlResource(), id];
    return parts.filter((part) => part).join('/');
  }

  static decode(properties) {
    return properties;
  }

  static encode(properties) {
    return properties;
  }

  static fetchAll({ url, config = {} } = {}) {
    url = url || this.buildUrl();
    const clonedConfig = { ...config };
    clonedConfig.params = this.encode(clonedConfig.params);

    return axios.get(url, clonedConfig).then((resp) => {
      const result = { raw: resp.data };
      const data = Array.isArray(resp.data) ? resp.data : resp.data.data;

      result.data = data.map((item) => {
        return new (this)(this.decode(item));
      });

      return result;
    });
  }

  static fetchOne(id, options) {
    const Model = this;
    const primaryKey = this.primaryKey();

    const model = new Model({
      [primaryKey]: id,
    });

    return model.fetch(options).then(() => model);
  }

  constructor(...args) {
    super(...args);

    Object.keys(this.fields).forEach((fieldKey) => {
      const field = this.fields[fieldKey];

      if (!isInheritedFrom(field, Association)) return;

      field.baseUrl = this.buildUrl();
    });
  }

  buildUrl() { return this.constructor.buildUrl(this.primaryField().value); }

  fetch({ url, config = {} } = {}) {
    url = url || this.buildUrl();
    const clonedConfig = { ...config };
    clonedConfig.params = this.constructor.encode(clonedConfig.params);

    return axios.get(url, clonedConfig).then((resp) => {
      this.set(this.constructor.decode(resp.data));

      return resp;
    });
  }

  isNew() {
    const primaryValue = this.fields[this.constructor.primaryKey()].value;
    return primaryValue === undefined || primaryValue === null;
  }

  httpParse() {
    const values = {};

    let fieldValues = Object.keys(this.fields);

    if (!this.isNew()) {
      fieldValues = fieldValues.filter((key) => {
        return this.fields[key].hasChanged;
      });
    }

    fieldValues.forEach((key) => {
      values[key] = this.fields[key].httpParse();
    });

    return values;
  }

  save(data = {}) {
    const modelData = this.httpParse();
    const method = this.isNew() ? 'post' : 'patch';

    data = Object.assign(modelData, data);
    data = this.constructor.encode(data);

    const url = this.buildUrl();
    return axios[method](url, data).then((resp) => {
      this.setPristine();

      return resp;
    });
  }
};

export default mixin;
