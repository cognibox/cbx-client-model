import AttributeValidationMixin from '../attribute-mixins/validation.js';

const ValidationMixin = (superclass) => {
  class AttributeWithValidation extends AttributeValidationMixin(superclass.attributeClass()) {}
  class AssociationWithValidation extends AttributeValidationMixin(superclass.associationClass()) {}

  return class extends superclass {
    static attributeClass() {
      return AttributeWithValidation;
    }

    static associationClass() {
      return AssociationWithValidation;
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

      Object.keys(this.associations).forEach((key) => {
        const association = this.associations[key];

        association.on('validate', () => {
          if (association.isValid) {
            delete errors[key];
          } else {
            errors[key] = association.errors;
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

      Object.keys(this.associations).forEach((key) => {
        this.associations[key].validate();
      });
    }
  };
};

export default ValidationMixin;
