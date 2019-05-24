import Attribute from './attribute';
import { xor } from 'lodash';

class Association extends Attribute {
  computeHasChanged() {
    super.computeHasChanged();
    this.hasChanged = this.hasChanged || !!xor(this.originalPrimaryKeys, this.getPrimaryKeys()).length;
  }

  getPrimaryKeys() {
    if (!this.value || this.constructorOptions.type !== 'hasMany') return;

    const primaryKey = this.modelClass().getPrimaryKey();

    return this.value.map((instance) => {
      return instance.attributes[primaryKey].value;
    });
  }

  instantiate(...args) {
    return new (this.modelClass())(...args);
  }

  modelClass() {
    this._modelClass = this._modelClass || this.loadClass(this.constructorOptions.class);

    return this._modelClass;
  }

  parse(properties) {
    if (this.constructorOptions.type === 'hasOne') {
      return this.parseHasOne(properties);
    } else if (this.constructorOptions.type === 'hasMany') {
      return this.parseHasMany(properties);
    } else if (this.constructorOptions.type === 'belongsTo') {
      return this.parseBelongsTo(properties);
    }

    return properties;
  }

  parseSingle(properties) {
    if (properties instanceof this.modelClass()) {
      return properties;
    }

    return this.instantiate(properties);
  }

  parseHasOne(properties) {
    return this.parseSingle(properties);
  }

  parseHasMany(properties) {
    if (!Array.isArray(properties)) return;

    const parsedProperties = [];

    properties.forEach((property) => {
      parsedProperties.push(this.parseSingle(property));
    });

    const proxy = new Proxy(parsedProperties, {
      get: (target, property) => {
        return target[property];
      },
      set: (target, property, newValue) => {
        target[property] = newValue;

        if (property === 'length') {
          this.trigger('change');
        }

        return true;
      }
    });

    return proxy;
  }

  parseBelongsTo(properties) {
    return this.parseSingle(properties);
  }

  loadClass(classToLoad) {
    return classToLoad;
  }

  setPristine() {
    super.setPristine();

    this.originalPrimaryKeys = this.getPrimaryKeys();
  }
}

export default Association;
