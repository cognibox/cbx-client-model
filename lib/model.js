import Attribute from './attribute';
import Association from './association';
import { forEach } from 'lodash';

class Model {
  static associationClass() { return Association; }

  static associations() { return {}; }

  static attributeClass() { return Attribute; }

  static attributes() { return {}; }

  constructor(properties) {
    properties = this.parse(properties);

    defineModelAttributes.call(this, { properties: properties.attributes });
    buildChanges.call(this);
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
      attributes: this.parseAttributes(attributes)
    };
  }

  parseAssociations(properties) {
    return properties;
  }

  parseAttributes(properties) {
    return properties;
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

  setPristine() {
    forEach(this.attributes, (value) => {
      value.setPristine();
    });

    this._setChanges({});
  }
}

export default Model;

////////////////

function buildAttributes({ properties = {} } = {}) {
  const definitions = this.constructor.attributes();
  const AttributeClass = this.constructor.attributeClass();
  const attributes = {};

  const keys = Object.keys(definitions);
  keys.forEach((attributeName) => {
    const definition = definitions[attributeName];
    const attributeArguments = {};
    Object.keys(definition).forEach((definitionKey) => {
      if (definitionKey !== 'default') attributeArguments[definitionKey] = definition[definitionKey];
    });
    attributeArguments.value = attributeName in properties ? properties[attributeName] : definition.default;
    const attribute = new AttributeClass(attributeArguments);

    attributes[attributeName] = attribute;
  });

  return attributes;
}

function buildChanges() {
  const attributes = this.attributes;
  this.hasChanged = false;
  this.changes = {};

  this._setChanges = (value) => {
    this.changes = value;
    this.hasChanged = !Object.keys(value);
  };

  Object.keys(attributes).forEach((key) => {
    const attribute = attributes[key];

    attribute.on('change', () => {
      if (attribute.hasChanged) {
        this.isDirty = true;
        this.changes[key] = { newValue: attribute.value, oldValue: attribute.getOriginalValue() };
      } else {
        delete this.changes[key];
      }

      this.hasChanged = computeHasChanged.call(this, this.changes);
    });
  });
}

function computeHasChanged(changes) {
  return Object.keys(changes).length > 0;
}

function defineModelAttributes({ properties = {} } = {}) {
  const attributes = buildAttributes.call(this, { properties });

  this.attributes = attributes;
}
