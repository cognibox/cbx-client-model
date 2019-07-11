import axios from 'axios';
import httpFieldMixin from '../field-mixins/http';
import xor from 'lodash/xor';

const mixin = (superclass) => {
  return class extends superclass {
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

      return axios.get(url, this.encode(options)).then((resp) => {
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

    buildFieldClass(...args) {
      let NewFieldClass = super.buildFieldClass(...args);
      if (xor(NewFieldClass.mixins, ['hasOne', 'hasMany', 'belongsTo']).length) {
        NewFieldClass = httpFieldMixin(NewFieldClass);
      }

      return NewFieldClass;
    }

    buildUrl() { return this.constructor.buildUrl(this.getPrimaryField().value, this.baseUrl); }

    fetch(options) {
      const url = this.buildUrl();

      return axios.get(url, this.constructor.encode(options)).then((resp) => {
        this.set(this.constructor.decode(resp.data));

        return resp;
      });
    }

    fieldArguments(...args) {
      const fieldArguments = super.fieldArguments(...args);
      fieldArguments.baseUrl = this.buildUrl();

      return fieldArguments;
    }

    getPrimaryField() {
      return this.fields[this.constructor.getPrimaryKey()];
    }

    isNew() {
      const primaryValue = this.fields[this.constructor.getPrimaryKey()].value;
      return primaryValue === undefined || primaryValue === null;
    }

    save(data = {}) {
      let method;

      const modelData = {};
      const attributeKeys = Object.keys(this.fields).filter((field) => this.fields[field].type === 'attribute');

      if (this.isNew()) {
        method = 'post';
        attributeKeys.forEach((key) => {
          modelData[key] = this.fields[key].value;
        });
      } else {
        method = 'patch';
        attributeKeys.forEach((key) => {
          if (!this.fields[key].hasChanged) return;

          modelData[key] = this.fields[key].value;
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
