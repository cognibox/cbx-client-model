import Attribute from './attribute';

class Association extends Attribute {
  instantiate(value) {
    return new (this.modelClass())(value);
  }

  modelClass() {
    this._modelClass = this._modelClass || this.loadClass(this.constructorOptions.class);

    return this._modelClass;
  }

  parse(value) {
    if (this.constructorOptions.type === 'hasOne') {
      return this.parseHasOne(value);
    } else if (this.constructorOptions.type === 'hasMany') {
      return this.parseHasMany(value);
    } else if (this.constructorOptions.type === 'belongsTo') {
      return this.parseBelongsTo(value);
    }

    return value;
  }

  parseSingle(value) {
    if (value instanceof this.modelClass()) {
      return value;
    }

    return this.instantiate(value);
  }

  parseHasOne(value) {
    return this.parseSingle(value);
  }

  parseHasMany(value) {
    return value;
  }

  parseBelongsTo(value) {
    return this.parseSingle(value);
  }

  loadClass(classToLoad) {
    return classToLoad;
  }
}

export default Association;
