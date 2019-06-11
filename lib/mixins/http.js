import axios from 'axios';
import AssociationHttpMixin from '../association-mixins/http.js';

const mixin = (superclass) => {
  class AssociationWithHttp extends AssociationHttpMixin(superclass.associationClass()) {}

  return class extends superclass {
    static associationClass() {
      return AssociationWithHttp;
    }

    static urlResource() {}

    static urlRoot() {}

    static buildUrl(id, baseUrl) {
      const parts = [baseUrl || this.urlRoot(), this.urlResource(), id];
      return parts.filter((part) => part).join('/');
    }

    static decode(properties) {
      return properties;
    }

    static encode(properties) {
      return properties;
    }

    static fetchAll(options) {
      const url = this.buildUrl();

      return axios.get(url, options).then((resp) => {
        const result = Array.isArray(resp.data) ? { data: resp.data } : resp.data;

        result.models = result.data.map((item) => {
          return new (this)(this.decode(item));
        });

        return result;
      });
    }

    static fetchOne(id, options) {
      const Model = this;
      const primaryKey = this.getPrimaryKey();

      const model = new Model({
        [primaryKey]: id,
      });

      return model.fetch(options).then(() => model);
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

    fetch(options) {
      const url = this.buildUrl();

      return axios.get(url, options).then((resp) => {
        this.set(this.constructor.decode(resp.data));

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
      data = this.constructor.encode(data);

      const url = this.buildUrl();
      return axios[method](url, data).then((resp) => {
        this.setPristine();

        return resp;
      });
    }
  };
};

export default mixin;
