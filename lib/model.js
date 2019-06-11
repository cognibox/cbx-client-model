import Attribute from './attribute';
import Association from './association';
import { forEach } from 'lodash';

class Model {
  static associationClass() { return Association; }

  static associations() { return {}; }

  static attributeClass() { return Attribute; }

  static attributes() { return {}; }

  static findPrimaryKey() {
    const attributes = this.attributes();
    return Object.keys(attributes).find((key) => attributes[key].primary);
  }

  static getPrimaryKey() {
    this._primaryKey = this._primaryKey || this.findPrimaryKey() || 'id';
    return this._primaryKey;
  }

  constructor(properties) {
    properties = this.parse(properties);

    buildAttributes.call(this, { properties: properties.attributes });
    buildAssociations.call(this, { properties: properties.associations });

    buildChanges.call(this);
  }

  computeHasChanged() {
    return Object.keys(this.changes).length > 0;
  }

  asssociationArguments(...args) {
    return attributeArguments.call(this, ...args);
  }

  attributeArguments(...args) {
    return attributeArguments.call(this, ...args);
  }

  parse(properties) {
    const associationDefinitions = this.constructor.associations();
    const attributeDefinitions = this.constructor.attributes();

    const associations = {};
    const attributes = {};

    forEach(properties, (value, key) => {
      if (associationDefinitions[key]) {
        associations[key] = value;
      } else if (attributeDefinitions[key]) {
        attributes[key] = value;
      }
    });

    return {
      associations: this.parseAssociations(associations),
      attributes: this.parseAttributes(attributes),
    };
  }

  parseAssociations(properties) {
    return properties;
  }

  parseAttributes(properties) {
    return properties;
  }

  calculateChanges(attributeKeys) {
    attributeKeys = attributeKeys || Object.keys(this.attributes);

    attributeKeys.forEach((attributeKey) => {
      const attribute = this.attributes[attributeKey];

      if (attribute.hasChanged) {
        this.isDirty = true;
        this.changes[attributeKey] = { newValue: attribute.value, oldValue: attribute.originalValue };
      } else {
        delete this.changes[attributeKey];
      }

      this.hasChanged = this.computeHasChanged();
    });
  }

  set(properties) {
    properties = this.parse(properties);

    forEach(properties.attributes, (value, key) => {
      if (!this.attributes[key]) return;

      this.attributes[key].value = value;
    });

    forEach(properties.associations, (value, key) => {
      if (!this.associations[key]) return;

      this.associations[key].value = value;
    });
  }

  setChanges(value) {
    this.changes = value;
    this.hasChanged = this.computeHasChanged();
  }

  setPristine() {
    forEach(this.attributes, (value) => {
      value.setPristine();
    });

    this.setChanges({});
  }
}

export default Model;

////////////////

function attributeArguments({ value, definition = {} } = {}) {
  const args = {};
  Object.keys(definition).forEach((definitionKey) => {
    if (definitionKey !== 'default') args[definitionKey] = definition[definitionKey];
  });

  args.value = value;

  return args;
}

function buildAssociations({ properties = {} } = {}) {
  const definitions = this.constructor.associations();
  const AssociationClass = this.constructor.associationClass();
  const associations = {};

  const keys = Object.keys(definitions);
  keys.forEach((associationName) => {
    const definition = definitions[associationName];

    const associationArguments = this.asssociationArguments({
      definition: definition,
      value: associationName in properties ? properties[associationName] : definition.default,
    });
    const attribute = new AssociationClass(associationArguments);

    associations[associationName] = attribute;
  });

  this.associations = associations;
}

function buildAttributes({ properties = {} } = {}) {
  const definitions = this.constructor.attributes();
  const AttributeClass = this.constructor.attributeClass();
  const attributes = {};

  const keys = Object.keys(definitions);
  keys.forEach((attributeName) => {
    const definition = definitions[attributeName];

    const args = this.attributeArguments({
      definition: definition,
      value: attributeName in properties ? properties[attributeName] : definition.default,
    });
    const attribute = new AttributeClass(args);

    attributes[attributeName] = attribute;
  });

  this.attributes = attributes;
}

function buildChanges() {
  const attributes = this.attributes;
  this.hasChanged = false;
  this.changes = {};

  Object.keys(attributes).forEach((key) => {
    const attribute = attributes[key];

    attribute.on('change', () => {
      this.calculateChanges([key]);
    });
  });
}
