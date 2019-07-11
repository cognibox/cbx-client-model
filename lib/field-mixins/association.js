import xor from 'lodash/xor';

function loadClass(classToLoad) {
  return classToLoad;
}

function parseSingle(properties) {
  if (properties instanceof this.modelClass()) {
    return properties;
  }

  return this.instantiate(properties);
}

const associationMixinFactory = (modelClass) => (superclass) => {
  superclass.mixins.push('association');

  return class extends superclass {
    instantiate(...args) {
      return new (this.modelClass())(...args);
    }

    modelClass() {
      this._modelClass = this._modelClass || loadClass(modelClass);

      return this._modelClass;
    }
  };
};

export const hasOne = (modelClass) => {
  const associationMixin = associationMixinFactory(modelClass);

  return (superclass) => {
    superclass.mixins.push('hasOne');

    return class extends associationMixin(superclass) {
      get type() {
        return 'hasOne';
      }

      parse(properties, ...args) {
        properties = super.parse(properties, ...args);

        return parseSingle.call(this, properties);
      }
    };
  };
};

export const belongsTo = (modelClass) => (superclass) => {
  superclass.mixins.push('belongsTo');

  return class extends hasOne(modelClass)(superclass) {
    get type() {
      return 'belongsTo';
    }
  };
};

export const hasMany = (modelClass) => {
  const associationMixin = associationMixinFactory(modelClass);

  return (superclass) => {
    superclass.mixins.push('hasMany');

    return class extends associationMixin(superclass) {
      get type() {
        return 'hasMany';
      }

      computeHasChanged() {
        super.computeHasChanged();
        this.hasChanged = this.hasChanged || !!xor(this.originalPrimaryKeys, this.getPrimaryKeys()).length;
      }

      getPrimaryKeys() {
        if (!this.value) return [];

        const primaryKey = this.modelClass().getPrimaryKey();

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

        this.originalPrimaryKeys = this.getPrimaryKeys();
      }
    };
  };
};
