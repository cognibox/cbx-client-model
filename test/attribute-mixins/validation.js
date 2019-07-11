import { expect } from 'chai';
import Model from '../../lib/model.js';
import ValidationMixin from '../../lib/mixins/validation.js';

describe('Validation', () => {
  let FieldClass, ModelWithValidation;

  beforeEach(() => {
    ModelWithValidation = ValidationMixin(Model);
    FieldClass = ModelWithValidation.fieldClass();
  });

  context('autoValidate', () => {
    let field;

    context('when autoValidate is false', () => {
      beforeEach(() => {
        field = new FieldClass(
          {
            value: 3,
            validations: {
              isThree(value) { return value === 3; },
            },
            autoValidate: false,
          }
        );
      });

      it('should not validate automatically on changes', () => {
        field.value = 5;
        expect(field.isValid).to.be.true;
      });
    });

    context('when autoValidate is true', () => {
      beforeEach(() => {
        field = new FieldClass(
          {
            value: 3,
            validations: {
              isThree(value) { return value === 3; },
            },
            autoValidate: true,
          }
        );
      });

      it('should validate automatically on changes', () => {
        field.value = 5;
        expect(field.isValid).to.be.false;
      });
    });

    context('when autoValidate is undefined', () => {
      beforeEach(() => {
        field = new FieldClass(
          {
            value: 3,
            validations: {
              isThree(value) { return value === 3; },
            },
          }
        );
      });

      it('should validate automatically on changes', () => {
        field.value = 5;
        expect(field.isValid).to.be.false;
      });
    });
  });

  describe('#validate', () => {
    let field;

    context('when validations is not defined', () => {
      beforeEach(() => {
        field = new FieldClass({ value: 3 });
      });

      it('should return an empty object', () => {
        const result = field.validate();
        expect(result).to.be.an('object').that.is.empty;
      });

      it('should set isValid to true', () => {
        field.validate();
        expect(field.isValid).to.be.true;
      });

      it('should set errors to empty object', () => {
        field.validate();
        expect(field.errors).to.be.an('object').that.is.empty;
      });
    });

    context('when validations is defined', () => {
      beforeEach(() => {
        field = new FieldClass({
          value: 3,
          validations: {
          },
        });
      });

      context('when calling validate', () => {
        it('should bind this on the field', () => {
          field.validations.validation = function() { return this; };

          const result = field.validate();

          expect(result.validation).to.equal(field);
        });
      });

      context('when all validations pass', () => {
        beforeEach(() => {
          field.validations.validation1 = () => true;
          field.validations.validation2 = () => true;
        });

        it('should return an empty object', () => {
          const result = field.validate();
          expect(result).to.be.an('object').that.is.empty;
        });

        it('should set isValid to true', () => {
          field.validate();
          expect(field.isValid).to.be.true;
        });

        it('should set errors to empty object', () => {
          field.validate();
          expect(field.errors).to.be.an('object').that.is.empty;
        });
      });

      context('when the first validation fails', () => {
        beforeEach(() => {
          field.validations.validation1 = () => 'Failure 1';
        });

        context('when the second validation passes', () => {
          beforeEach(() => {
            field.validations.validation2 = () => true;
          });

          it('should return an object containing the first error message', () => {
            const result = field.validate();

            expect(result).to.be.an('object');
            expect(result.validation1).to.eq('Failure 1');
          });
        });

        context('when the second validation fails', () => {
          beforeEach(() => {
            field.validations.validation2 = () => 'Failure 2';
          });

          it('should return an object containing both error messages', () => {
            const result = field.validate();

            expect(result).to.be.an('object');
            expect(result.validation1).to.eq('Failure 1');
            expect(result.validation2).to.eq('Failure 2');
          });
        });
      });
    });
  });
});
