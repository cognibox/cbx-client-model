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

    Validator.customValidation = () => true;
    Model = class extends ModelWithValidation {
      static attributeClass() { return CustomAttributeClass; }

      static attributes() {
        return {
          name: {
            validations: { customValidation: true }
          }
        };
      }
    };
  });

  context('when an attribute is validated', () => {
    let model;

    context('when model is initially valid', () => {
      beforeEach(() => {
        Validator.customValidation = () => true;
        model = new Model({ name: Math.random() });
      });

      context('when validating attribute', () => {
        context('when validation fail', () => {
          beforeEach(() => {
            Validator.customValidation = () => false;
            model.attributes.name.validate();
          });

          it('should set isValid to false', () => {
            expect(model.isValid).to.be.false;
          });

          it('should set errors', () => {
            expect(model.errors).to.deep.equal({ name: { customValidation: false } });
          });
        });

        context('when validation succeed', () => {
          beforeEach(() => {
            Validator.customValidation = () => true;
            model.attributes.name.validate();
          });

          it('should set isValid to true', () => {
            expect(model.isValid).to.be.true;
          });

          it('should set errors to an empty object', () => {
            expect(model.errors).to.deep.equal({});
          });
        });
      });
    });

    context('when model is initially not valid', () => {
      beforeEach(() => {
        Validator.customValidation = () => false;
        model = new Model({ name: Math.random() });
      });

      context('when validating attribute', () => {
        context('when validation fail', () => {
          beforeEach(() => {
            Validator.customValidation = () => false;
            model.attributes.name.validate();
          });

          it('should set isValid to false', () => {
            expect(model.isValid).to.be.false;
          });

          it('should set errors', () => {
            expect(model.errors).to.deep.equal({ name: { customValidation: false } });
          });
        });

        context('when validation succeed', () => {
          beforeEach(() => {
            Validator.customValidation = () => true;
            model.attributes.name.validate();
          });

          it('should set isValid to true', () => {
            expect(model.isValid).to.be.true;
          });

          it('should set errors to an empty object', () => {
            expect(model.errors).to.deep.equal({});
          });
        });
      });
    });
  });
});
