export default (superclass) => class extends superclass {
  constructor(properties) {
    const { validations, autoValidate, model } = properties;

    super(properties);

    this.errors = {};
    this.isValid = true;
    this.model = model;
    this.validations = validations;

    if (autoValidate !== false) {
      this.on('change', () => {
        this.validate();
      });
      this.validate();
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

    if (this.validations === undefined) return errors;

    Object.keys(this.validations).forEach((validationKey) => {
      const validationResult = this.validations[validationKey].call(this, this.value);

      if (validationResult !== true) {
        errors[validationKey] = validationResult;
      }
    });

    return errors;
  }
};
