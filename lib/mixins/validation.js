import AttributeValidationMixin from '../attribute-mixins/validation.js';

const ValidationMixin = (superclass) => class extends superclass {
  static attributeClass() {
    return class AttributeWithValidation extends AttributeValidationMixin(super.attributeClass()) {};
  }

  static associationClass() {
    return class AssociationWithValidation extends AttributeValidationMixin(super.associationClass()) {};
  }

  constructor(...args) {
    super(...args);

    let isValid = true;
    const errors = {};

    Object.keys(this.attributes).forEach((key) => {
      const attribute = this.attributes[key];

      attribute.on('validate', () => {
        if (attribute.isValid) {
          delete errors[key];
        } else {
          errors[key] = attribute.errors;
        }

        isValid = !Object.keys(errors).length;
      });
    });

    Object.defineProperty(this, 'isValid', {
      enumerable: true,
      get() { return isValid; },
      set() { console.error('[vueModel][ValidationMixin] isValid assignation not allowed'); },
    });

    Object.defineProperty(this, 'errors', {
      enumerable: true,
      get() { return errors; },
      set() { console.error('[vueModel][ValidationMixin] errors assignation not allowed'); },
    });
  }

  validate() {
    Object.keys(this.attributes).forEach((key) => {
      this.attributes[key].validate();
    });
  }
};

export default ValidationMixin;
