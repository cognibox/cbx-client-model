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

function buildChanges() {
  const attributes = this.attributes;
  let hasChanged = false;
  const changes = {};

  Object.keys(attributes).forEach((key) => {
    const attribute = attributes[key];

    attribute.onChange(() => {
      if (attribute.hasChanged) {
        changes[key] = { newValue: attribute.value, oldValue: attribute.getOriginalValue() };
      } else {
        delete changes[key];
      }

      hasChanged = computeHasChanged.call(this, changes);
    });
  });

  Object.defineProperty(this, 'changes', {
    enumerable: true,
    get() { return changes; },
    set() { console.error('[vueModel] changes assignation not allowed'); }
  });

  Object.defineProperty(this, 'hasChanged', {
    enumerable: true,
    get() { return hasChanged; },
    set() { console.error('[vueModel] hasChanged assignation not allowed'); }
  });
}

function computeHasChanged(changes) {
  return Object.keys(changes).length > 0;
}

function defineModelAttributes({ definitions = {}, properties = {} } = {}) {
  const attributes = buildAttributes.call(this, { definitions, properties });

  Object.defineProperty(this, 'attributes', {
    enumerable: true,
    get() { return attributes; },
    set() { console.error('[vueModel] attributes assignation not allowed'); }
  });
}
