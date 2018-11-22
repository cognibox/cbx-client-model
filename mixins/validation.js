import AttributeValidationMixin from '../attribute-mixins/validation.js';

const ValidationMixin = (superclass) => class extends superclass {
  static attributeClass() {
    return class AttributeWithValidation extends AttributeValidationMixin(super.attributeClass()) {};
  }
};

export default ValidationMixin;
