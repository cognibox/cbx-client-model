const ValidationMixin = (superclass) => class extends superclass {
  constructor(...args) {
    super(...args);
    this.isValid = true;
    this.errors = {};

    Object.keys(this.fields).forEach((key) => {
      const field = this.fields[key];
      field.on('validate', () => {
        if (field.isValid) {
          delete this.errors[key];
        } else {
          this.errors[key] = field.errors;
        }
        this.isValid = !Object.keys(this.errors).length;
      });
    });

    const [properties] = args;
    triggerInitialValidation({
      fields: this.fields,
      properties,
    });
  }

  validate() {
    Object.keys(this.fields).forEach((key) => {
      this.fields[key].validate();
    });
  }
};

////////////////

function triggerInitialValidation({ fields, properties = {} }) {
  const fieldKeys = Object.keys(fields);

  fieldKeys.forEach((key) => {
    const field = fields[key];

    if (!field.autoValidate) return;

    if (key in properties) {
      field.trigger('validate');
    } else {
      field.validate();
    }
  });
}

export default ValidationMixin;
