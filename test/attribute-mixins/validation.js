import { expect } from 'chai';
import BaseModel from '../../base-model.js';
import ValidationMixin from '../../mixins/validation.js';

describe('Validation', () => {
  let Model, Validator;

  beforeEach(() => {
    const ModelWithValidation = ValidationMixin(BaseModel);
    const AttributeClass = ModelWithValidation.attributeClass();
    Validator = class extends AttributeClass.validatorClass() {};

    const CustomAttributeClass = class extends AttributeClass {
      static validatorClass() { return Validator; }
    };

    Model = class extends ModelWithValidation {
      static attributeClass() { return CustomAttributeClass; }
    };
  });

  context('autoValidate', () => {
    let attribute;

    context('when autoValidate is false', () => {
      beforeEach(() => {
        Validator.customValidation = () => true;
        const AttributeClass = Model.attributeClass();
        attribute = new AttributeClass({ value: 3, validations: { customValidation: true }, autoValidate: false });
      });

      it('should not validate automatically on changes', () => {
        Validator.customValidation = () => false;
        attribute.value = 5;
        expect(attribute.isValid).to.be.true;
      });
    });

    context('when autoValidate is true', () => {
      beforeEach(() => {
        Validator.customValidation = () => true;
        const AttributeClass = Model.attributeClass();
        attribute = new AttributeClass({ value: 3, validations: { customValidation: true }, autoValidate: true });
      });

      it('should validate automatically on changes', () => {
        Validator.customValidation = () => false;
        attribute.value = 5;
        expect(attribute.isValid).to.be.false;
      });
    });

    context('when autoValidate is undefined', () => {
      beforeEach(() => {
        Validator.customValidation = () => true;
        const AttributeClass = Model.attributeClass();
        attribute = new AttributeClass({ value: 3, validations: { customValidation: true } });
      });

      it('should validate automatically on changes', () => {
        Validator.customValidation = () => false;
        attribute.value = 5;
        expect(attribute.isValid).to.be.false;
      });
    });
  });

  describe('#validate', () => {
    let attribute;

    context('when validations is not defined', () => {
      beforeEach(() => {
        const AttributeClass = Model.attributeClass();
        attribute = new AttributeClass({ value: 3 });
      });

      it('should return an empty object', () => {
        const result = attribute.validate();
        expect(result).to.deep.equal({});
      });

      it('should set isValid to true', () => {
        attribute.validate();
        expect(attribute.isValid).to.be.true;
      });

      it('should set errors to empty object', () => {
        attribute.validate();
        expect(attribute.errors).to.deep.equal({});
      });
    });

    context('when value is not defined', () => {
      context('when attribute is required', () => {
        beforeEach(() => {
          const AttributeClass = Model.attributeClass();
          attribute = new AttributeClass({ validations: { required: true } });
        });

        it('should return false', () => {
          const result = attribute.validate();
          expect(result).to.deep.equal({ required: false });
        });

        it('should set isValid to false', () => {
          attribute.validate();
          expect(attribute.isValid).to.be.false;
        });

        it('should add required errors', () => {
          attribute.validate();
          expect(attribute.errors).to.deep.equal({ required: false });
        });
      });

      context('with custom validations', () => {
        beforeEach(() => {
          Validator.failingValidation = () => false;
          const AttributeClass = Model.attributeClass();
          attribute = new AttributeClass({ validations: { failingValidation: true } });
        });

        it('should return an empty object', () => {
          const result = attribute.validate();
          expect(result).to.deep.equal({});
        });

        it('should set isValid to true', () => {
          attribute.validate();
          expect(attribute.isValid).to.be.true;
        });

        it('should set errors to empty object', () => {
          attribute.validate();
          expect(attribute.errors).to.deep.equal({});
        });
      });
    });

    context('when value is defined', () => {
      context('when attribute is required', () => {
        beforeEach(() => {
          const AttributeClass = Model.attributeClass();
          attribute = new AttributeClass({ value: Math.random(), validations: { required: true } });
        });

        it('should return an empty object', () => {
          const result = attribute.validate();
          expect(result).to.deep.equal({});
        });

        it('should set isValid to true', () => {
          attribute.validate();
          expect(attribute.isValid).to.be.true;
        });

        it('should set errors to empty object', () => {
          attribute.validate();
          expect(attribute.errors).to.deep.equal({});
        });
      });

      context('with custom validations', () => {
        context('when validation is succeeding', () => {
          beforeEach(() => {
            Validator.succeedingValidation = () => true;
            const AttributeClass = Model.attributeClass();
            attribute = new AttributeClass({ value: true, validations: { succeedingValidation: true } });
          });

          it('should return an empty object', () => {
            const result = attribute.validate();
            expect(result).to.deep.equal({});
          });

          it('should set isValid to true', () => {
            attribute.validate();
            expect(attribute.isValid).to.be.true;
          });

          it('should set errors to empty object', () => {
            attribute.validate();
            expect(attribute.errors).to.deep.equal({});
          });
        });

        context('when validation is failing', () => {
          beforeEach(() => {
            Validator.failinggValidation = () => false;
            const AttributeClass = Model.attributeClass();
            attribute = new AttributeClass({ value: true, validations: { failinggValidation: true } });
          });

          it('should return object with error', () => {
            const result = attribute.validate();
            expect(result).to.deep.equal({ failinggValidation: false });
          });

          it('should set isValid to false', () => {
            attribute.validate();
            expect(attribute.isValid).to.be.false;
          });

          it('should set errors to empty object', () => {
            attribute.validate();
            expect(attribute.errors).to.deep.equal({ failinggValidation: false });
          });
        });
      });
    });
  });
});
