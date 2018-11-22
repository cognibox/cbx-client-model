import { expect } from 'chai';
import Model from '../../base-model.js';
import ValidationMixin from '../../mixins/validation.js';

describe('Validation', () => {
  let ModelWithValidation;

  beforeEach(() => {
    ModelWithValidation = class extends ValidationMixin(Model) {};
  });

  describe('#validate', () => {
    context('when validations is not defined', () => {
      let attribute;

      beforeEach(() => {
        const AttributeClass = ModelWithValidation.attributeClass();
        attribute = new AttributeClass({ value: 3 });
      });

      it('should return true', () => {
        const result = attribute.validate();
        expect(result).to.be.true;
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

    context('when attribute is required', () => {
      let attribute;

      beforeEach(() => {
        const AttributeClass = ModelWithValidation.attributeClass();
        attribute = new AttributeClass({ validations: { required: true } });
      });

      context.only('when value is undefined', () => {
        it('should return false', () => {
          const result = attribute.validate();
          expect(result).to.be.false;
        });

        it('should set isValid to false', () => {
          attribute.validate();
          expect(attribute.isValid).to.be.false;
        });

        it('should add required errors', () => {
          attribute.validate();
          expect(attribute.errors).to.deep.equal({ required: true });
        });
      });

      context.only('when value is defined', () => {
        beforeEach(() => {
          attribute.value = Math.random();
        });

        it('should return true', () => {
          const result = attribute.validate();
          expect(result).to.be.true;
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
  });
});
