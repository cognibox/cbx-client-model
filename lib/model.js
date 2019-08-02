import Field from './field';

class Model {
  static fieldClass() { return Field; }

  static primaryKey() {
    return 'id';
  }

  constructor(properties = {}) {
    properties = this.parse(properties);

    this.fields = this.buildFields();

    this.initialSet(properties);

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

  fieldMap(callback) {
    return Object.keys(this.fields).map((key) => {
      return callback.call(this, this.fields[key], key);
    });
  }

  initialSet(properties) {
    properties = this.parse(properties);

    this.fieldMap((field, key) => {
      if (!properties[key]) return;

      field.initialSet(properties[key]);
    });
  }

  parse(properties = {}) {
    return properties;
  }

  primaryField() {
    return this.fields[this.constructor.primaryKey()];
  }

  set(properties = {}) {
    properties = this.parse(properties);

    this.fieldMap((field, key) => {
      if (!properties[key]) return;

      field.value = properties[key];
    });
  }

  setChanges(value) {
    this.changes = value;
    this.hasChanged = this.computeHasChanged();
  }

  setPristine() {
    this.fieldMap((value) => value.setPristine());

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
