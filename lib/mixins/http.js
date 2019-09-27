import { Association } from '../association.js';
import Attribute from '../attribute.js';
import { sync } from '../helper';

const mixin = (superclass) => class extends superclass {
  static urlResource() {}

  static urlRoot() {}

  static buildUrl(id) {
    const parts = [this.urlRoot(), this.urlResource(), id];
    return parts.filter((part) => part).join('/');
  }

  static fetchAll({ url, options = {} } = {}) {
    url = url || this.buildUrl();

    return this.sync({ method: 'get', url, options }).then((resp) => {
      const result = { raw: resp.data };
      const data = Array.isArray(resp.data) ? resp.data : resp.data.data;

      result.data = data.map((item) => {
        return new (this)(nullToUndefined(item));
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

  static sync({ method, url, options }) {
    return sync({ method, url, options });
  }

  constructor(...args) {
    super(...args);

    Object.keys(this.fields).forEach((fieldKey) => {
      const field = this.fields[fieldKey];

      if (!(field instanceof Association)) return;

      field.baseUrl = this.buildUrl();
    });
  }

  buildUrl() { return this.constructor.buildUrl(this.primaryField().value); }

  fetch({ url, options = {} } = {}) {
    url = url || this.buildUrl();

    return this.sync({ method: 'get', url, options }).then((resp) => {
      this.set(nullToUndefined(resp.data));

      this.setPristine();

      return resp;
    });
  }

  isNew() {
    const primaryValue = this.fields[this.constructor.primaryKey()].value;
    return primaryValue === undefined || primaryValue === null;
  }

  httpParse() {
    let fieldKeys = Object.keys(this.fields).filter((key) => this.fields[key] instanceof Attribute
    );

    if (!this.isNew()) {
      fieldKeys = fieldKeys.filter((key) => {
        return this.fields[key] instanceof Attribute && this.fields[key].hasChanged;
      });
    }

    const values = {};

    fieldKeys.forEach((key) => {
      values[key] = this.fields[key].httpParse();
    });

    return values;
  }

  save({ url, data = {} } = {}) {
    const modelData = this.httpParse();
    const method = this.isNew() ? 'post' : 'patch';

    data = Object.assign(modelData, data);

    url = url || this.buildUrl();
    return this.sync({ method, url, options: data }).then((resp) => {
      this.setPristine();

      return resp;
    });
  }

  sync({ method, url, options }) {
    return this.constructor.sync({ method, url, options });
  }
};

export default mixin;

////////////////

function nullToUndefined(obj) {
  const rtn = {};
  if (obj === null || obj === undefined) return rtn;

  Object.keys(obj).forEach((key) => {
    if (obj[key] === null) {
      rtn[key] = undefined;
    } else if (obj[key] instanceof Array) {
      rtn[key] = obj[key].map((item) => nullToUndefined(item));
    } else if (obj[key] instanceof Object) {
      rtn[key] = nullToUndefined(obj[key]);
    } else {
      rtn[key] = obj[key];
    }
  });
  return rtn;
}
