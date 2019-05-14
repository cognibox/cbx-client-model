import Attribute from './attribute';
import { forEach } from 'lodash';

class BaseModel {
  static attributeClass() { return Attribute; }

  static attributes() { return {}; }

  constructor(properties) {
    properties = this.parse(properties);

    const attributesDefinition = this.constructor.attributes();
    defineModelAttributes.call(this, { definitions: attributesDefinition, properties: properties });
    buildChanges.call(this);
  }

  parse(properties) { return properties; }

  set(properties) {
    properties = this.parse(properties);

    forEach(properties, (value, key) => {
      if (!this.attributes[key]) return;

      this.attributes[key].value = value;
    });
  }

  setPristine() {
    forEach(this.attributes, (value) => {
      value.setPristine();
    });

    this._setChanges({});
  }
}

export default BaseModel;

////////////////

function buildAttributes({ definitions = {}, properties = {} } = {}) {
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

function defineModelAttributes({ definitions = {}, properties = {} } = {}) {
  const attributes = buildAttributes.call(this, { definitions, properties });

  this.attributes = attributes;
}
