import xor from 'lodash/xor';
import Field from './field.js';

function parseSingle(properties) {
  if (properties instanceof this.ModelClass) {
    return properties;
  }

  return this.instantiate(properties);
}

class Association extends Field {
  beforeConstructor({ model }) {
    this.ModelClass = this.ModelClass || this.loadClass(model);
  }

  constructor(...args) {
    super(...args);
  }

  instantiate(...args) {
    return new this.ModelClass(...args);
  }

  loadClass(classToLoad) {
    return classToLoad;
  }
}

class SingleAssociation extends Association {
  parse(properties, ...args) {
    properties = super.parse(properties, ...args);

    return parseSingle.call(this, properties);
  }
}

class BelongsTo extends SingleAssociation {}

class HasOne extends SingleAssociation {}

class HasMany extends Association {
  computeHasChanged() {
    super.computeHasChanged();
    this.hasChanged = this.hasChanged || !!xor(this.originalPrimaryKeys, this.primaryKeys()).length;
  }

  primaryKeys() {
    if (!this.value) return [];

    const primaryKey = this.ModelClass.primaryKey();

    return this.value.map((instance) => instance.fields[primaryKey].value);
  }

  parse(properties, ...args) {
    properties = super.parse(properties, ...args);

    if (!Array.isArray(properties)) throw TypeError('Associations of type hasMany must be arrays, consider adding a default value.');

    const parsedProperties = [];

    properties.forEach((property) => {
      parsedProperties.push(parseSingle.call(this, property));
    });

    const proxy = new Proxy(parsedProperties, {
      get: (target, property) => target[property],
      set: (target, property, newValue) => {
        target[property] = newValue;

        if (property === 'length') {
          this.trigger('change');
        }

        return true;
      },
    });

    return proxy;
  }

  setPristine() {
    super.setPristine();

    this.originalPrimaryKeys = this.primaryKeys();
  }
}

export {
  Association,
  BelongsTo,
  HasMany,
  HasOne,
};
