export default (superclass) => class extends superclass {
  constructor(properties = {}) {
    const { validations, autoValidate } = properties;

    super(properties);

    this.errors = {};
    this.isValid = true;
    this.validations = validations || {};
    this.autoValidate = autoValidate !== false;

    if (this.autoValidate) {
      this.on('change', () => {
        this.validate();
      });
    }
  }

  validate() {
    this.errors = this.validateAllDry();

    this.isValid = !Object.keys(this.errors).length;

    this.trigger('validate');

    return this.errors;
  }

  validateAllDry() {
    const errors = {};

    Object.keys(this.validations).forEach((validationKey) => {
      const validationResult = this.validateOneDry(validationKey);

      if (validationResult !== true) {
        errors[validationKey] = validationResult;
      }
    });

    return errors;
  }

  validateOneDry(validationKey) {
    return this.validations[validationKey].call(this, this.value);
  }
};
