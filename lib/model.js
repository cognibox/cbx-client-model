import Field from './field';

class Model {
  static fieldClass() { return Field; }

  static fields() { return {}; }

  static findPrimaryKey() {
    const fields = this.fields();
    return Object.keys(fields).find((key) => fields[key].primary);
  }

  static getPrimaryKey() {
    this._primaryKey = this._primaryKey || this.findPrimaryKey() || 'id';
    return this._primaryKey;
  }

  constructor(properties = {}) {
    properties = this.parse(properties);

    buildFields.call(this, properties);

    buildChanges.call(this);
  }

  fieldArguments(...args) {
    return fieldArguments.call(this, ...args);
  }

  parse(properties) {
    return properties;
  }

  buildFieldClass(mixins = []) {
    return mixins.reduce(
      (superClass, mixin) => mixin(superClass),
      this.constructor.fieldClass()
    );
  }

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

  set(properties) {
    properties = this.parse(properties);

    Object.keys(properties).forEach((key) => {
      if (!this.fields[key]) return;

      this.fields[key].value = properties[key];
    });
  }

  setChanges(value) {
    this.changes = value;
    this.hasChanged = this.computeHasChanged();
  }

  setPristine() {
    Object.values(this.fields).forEach((value) => {
      value.setPristine();
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
    if (field.type !== 'attribute') return;

    field.on('change', () => {
      this.calculateChanges([key]);
    });
  });
}

function buildFields(properties) {
  const definitions = this.constructor.fields();
  this.fields = {};

  Object.keys(definitions).forEach((fieldName) => {
    const definition = definitions[fieldName];

    const args = {
      ...definition,
      value: fieldName in properties ? properties[fieldName] : definition.default,
    };
    delete args.default;

    const NewFieldClass = this.buildFieldClass(definition.mixins);

    const field = new NewFieldClass(args);

    const methods = definitions.methods || {};
    Object.keys(methods).forEach((methodName) => {
      if (methodName in Field.prototype) throw Error('Cannot override existing method on field, consider using a mixin');

      field[methodName] = methods[methodName];
    });

    this.fields[fieldName] = field;
  });
}


