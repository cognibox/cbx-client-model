import axios from 'axios';
import AssociationHttpMixin from '../association-mixins/http.js';

const mixin = (superclass) => class extends superclass {
  static associationClass() {
    return class AssociationWithHttp extends AssociationHttpMixin(super.associationClass()) {};
  }

  static urlResource() {}

  static urlRoot() {}

  static buildUrl(id, baseUrl) {
    const parts = [baseUrl || this.urlRoot(), this.urlResource(), id];
    return parts.filter((part) => part).join('/');
  }

  static fetchAll() {
    const url = this.buildUrl();

    return axios.get(url).then((resp) => {
      const result = Array.isArray(resp.data) ? { data: resp.data } : resp.data;

      result.models = result.data.map((item) => {
        return new (this)(item);
      });

      return result;
    });
  }

  static fetchOne(id) {
    const Model = this;
    const primaryKey = this.getPrimaryKey();

    const model = new Model({
      [primaryKey]: id
    });

    return model.fetch().then(() => model);
  }

  static findPrimaryKey() {
    const attributes = this.attributes();
    return Object.keys(attributes).find((key) => attributes[key].primary);
  }

  static getPrimaryKey() {
    this._primaryKey = this._primaryKey || this.findPrimaryKey() || 'id';
    return this._primaryKey;
  }

  constructor(...args) {
    super(...args);

    let [, options] = args;
    options = options || {};
    this.baseUrl = options.baseUrl;
  }

  asssociationArguments(...args) {
    const associationArguments = super.asssociationArguments(...args);
    associationArguments.baseUrl = this.buildUrl();

    return associationArguments;
  }

  buildUrl() { return this.constructor.buildUrl(this.getPrimaryAttribute().value, this.baseUrl); }

  fetch() {
    const url = this.buildUrl();

    return axios.get(url).then((resp) => {
      this.set(resp.data);

      return resp;
    });
  }

  getPrimaryAttribute() {
    return this.attributes[this.constructor.getPrimaryKey()];
  }

  isNew() {
    const primaryValue = this.attributes[this.constructor.getPrimaryKey()].value;
    return primaryValue === undefined || primaryValue === null;
  }

  save(data = {}) {
    let method;

    const modelData = {},
          attributeKeys = Object.keys(this.attributes);

    if (this.isNew()) {
      method = 'post';
      attributeKeys.forEach((key) => {
        modelData[key] = this.attributes[key].value;
      });
    } else {
      method = 'patch';
      attributeKeys.forEach((key) => {
        if (!this.attributes[key].hasChanged) return;

        modelData[key] = this.attributes[key].value;
      });
    }

    data = Object.assign(modelData, data);

    const url = this.buildUrl();
    return axios[method](url, data).then((resp) => {
      this.setPristine();

      return resp;
    });
  }
};

export default mixin;
