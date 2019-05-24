import Attribute from './attribute';

class Association extends Attribute {
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

    return parsedProperties;
  }

  parseBelongsTo(properties) {
    return this.parseSingle(properties);
  }

  loadClass(classToLoad) {
    return classToLoad;
  }
}

export default Association;
