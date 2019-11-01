import Field from './field';

class Model {
  static fieldClass() { return Field; }

  static primaryKey() {
    return 'id';
  }

  constructor(properties = {}) {
    this.fields = this.buildFields();

    this.set(properties);
    this.setPristine();

    buildChanges.call(this);
  }

  buildFields() { return {}; }

  calculateChanges(fieldKeys) {
    fieldKeys = fieldKeys || Object.keys(this.fields);

    fieldKeys.forEach((fieldKey) => {
      const field = this.fields[fieldKey];

      if (field.hasChanged) {
        this.isDirty = true;
        this.changes[fieldKey] = { newValue: field.value, oldValue: field.originalValue };
      } else {
        delete this.changes[fieldKey];
      }

      this.hasChanged = this.computeHasChanged();
    });
  }

  computeHasChanged() {
    return Object.keys(this.changes).length > 0;
  }

  mapOnFields(callback) {
    return Object.keys(this.fields).map((key) => {
      return callback.call(this, this.fields[key], key);
    });
  }

  parse(properties = {}) {
    return properties;
  }

  primaryField() {
    return this.fields[this.constructor.primaryKey()];
  }

  reset() {
    this.mapOnFields((field) => field.reset());
  }

  set(properties = {}) {
    properties = this.parse(properties);

    this.mapOnFields((field, key) => {
      if (properties[key] === undefined) return;

      field.value = properties[key];
    });
  }

  setChanges(value) {
    this.changes = value;
    this.hasChanged = this.computeHasChanged();
  }

  setPristine() {
    this.mapOnFields((value) => {
      if (value.isDirty) value.setPristine();
    });

    this.setChanges({});
  }
}

export default Model;

////////////////

function buildChanges() {
  const fields = this.fields;
  this.hasChanged = false;
  this.changes = {};

  Object.keys(fields).forEach((key) => {
    const field = fields[key];

    field.on('change', () => {
      this.calculateChanges([key]);
    });
  });
}
