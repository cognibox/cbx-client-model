import Attribute from './attribute';

class BaseModel {
  static attributeClass() { return Attribute; }

  static attributes() { return {}; }

  constructor(properties) {
    properties = this.parse(properties);

    const attributesDefinition = this.constructor.attributes();
    defineModelAttributes.call(this, { definitions: attributesDefinition, properties: properties });
  }

  parse(properties) { return properties; }
}

export default BaseModel;

////////////////

function buildAttributes({ definitions = {}, properties = {} } = {}) {
  const AttributeClass = this.constructor.attributeClass();
  const attributes = {};

  const keys = Object.keys(definitions);
  keys.forEach((key) => {
    const definition = definitions[key];
    const value = key in properties ? properties[key] : definition.default;
    const attribute = new AttributeClass({ parent: this, value: value });

    attributes[key] = attribute;
  });

  return attributes;
}

function defineModelAttributes({ definitions = {}, properties = {} } = {}) {
  const attributes = buildAttributes.call(this, { definitions, properties });

  Object.defineProperty(this, 'attributes', {
    enumerable: true,
    get() { return attributes; },
    set() { console.error('[vueModel] attributes assignation not allowed'); }
  });
}
