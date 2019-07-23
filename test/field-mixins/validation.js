import { expect } from 'chai';
import { Attribute } from '../../lib/main.js';

describe('Validation', () => {
  context('autoValidate', () => {
    let attribute;

    context('when autoValidate is false', () => {
      beforeEach(() => {
        attribute = new Attribute(
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
        attribute.value = 5;
        expect(attribute.isValid).to.be.true;
      });
    });

    context('when autoValidate is true', () => {
      context('when default value fail validation', () => {
        beforeEach(() => {
          attribute = new Attribute(
            {
              value: 5,
              validations: {
                isThree(value) { return value === 3; },
              },
              autoValidate: true,
            }
          );
        });

        it('should not trigger validation on instantiation', () => {
          expect(attribute.isValid).to.be.true;
        });

        context('when value is changed to a valid one', () => {
          it('should trigger the validation', () => {
            attribute.value = 3;

            expect(attribute.isValid).to.be.true;
          });
        });
      });
    });

    context('when autoValidate is undefined', () => {
      beforeEach(() => {
        attribute = new Attribute(
          {
            value: 3,
            validations: {
              isThree(value) { return value === 3; },
            },
          }
        );
      });

      it('should validate automatically on changes', () => {
        attribute.value = 5;
        expect(attribute.isValid).to.be.false;
      });
    });
  });

  describe('#validate', () => {
    let attribute;

    context('when validations is not defined', () => {
      beforeEach(() => {
        attribute = new Attribute({ value: 3 });
      });

      it('should return an empty object', () => {
        const result = attribute.validate();
        expect(result).to.be.an('object').that.is.empty;
      });

      it('should set isValid to true', () => {
        attribute.validate();
        expect(attribute.isValid).to.be.true;
      });

      it('should set errors to empty object', () => {
        attribute.validate();
        expect(attribute.errors).to.be.an('object').that.is.empty;
      });
    });

    context('when validations is defined', () => {
      beforeEach(() => {
        attribute = new Attribute({
          value: 3,
          validations: {
          },
        });
      });

      context('when calling validate', () => {
        it('should bind this on the attribute', () => {
          attribute.validations.validation = function() { return this; };

          const result = attribute.validate();

          expect(result.validation).to.equal(attribute);
        });
      });

      context('when all validations pass', () => {
        beforeEach(() => {
          attribute.validations.validation1 = () => true;
          attribute.validations.validation2 = () => true;
        });

        it('should return an empty object', () => {
          const result = attribute.validate();
          expect(result).to.be.an('object').that.is.empty;
        });

        it('should set isValid to true', () => {
          attribute.validate();
          expect(attribute.isValid).to.be.true;
        });

        it('should set errors to empty object', () => {
          attribute.validate();
          expect(attribute.errors).to.be.an('object').that.is.empty;
        });
      });

      context('when the first validation fails', () => {
        beforeEach(() => {
          attribute.validations.validation1 = () => 'Failure 1';
        });

        context('when the second validation passes', () => {
          beforeEach(() => {
            attribute.validations.validation2 = () => true;
          });

          it('should return an object containing the first error message', () => {
            const result = attribute.validate();

            expect(result).to.be.an('object');
            expect(result.validation1).to.eq('Failure 1');
          });
        });

        context('when the second validation fails', () => {
          beforeEach(() => {
            attribute.validations.validation2 = () => 'Failure 2';
          });

          it('should return an object containing both error messages', () => {
            const result = attribute.validate();

            expect(result).to.be.an('object');
            expect(result.validation1).to.eq('Failure 1');
            expect(result.validation2).to.eq('Failure 2');
          });
        });
      });
    });
  });

  describe('#validateAllDry', () => {
    let attribute;

    context('without validations', () => {
      beforeEach(() => {
        attribute = new Attribute({ value: 3 });
      });

      it('should return an empty object', () => {
        expect(attribute.validateAllDry()).to.be.an('object').that.is.empty;
      });
    });

    context('with validations', () => {
      beforeEach(() => {
        attribute = new Attribute({
          validations: {
            isThree(value) {
              return value === 3 ? true : 'not three';
            },
          },
        });
      });

      context('when the value is valid', () => {
        it('should return an empty object', () => {
          attribute.value = 3;

          expect(attribute.validateAllDry()).to.be.an('object').that.is.empty;
        });
      });

      context('when the value is invalid', () => {
        it('should return an object with the validation message', () => {
          attribute.value = 0;

          expect(attribute.validateAllDry()).to.deep.equal({ isThree: 'not three' });
        });
      });
    });
  });

  describe('#validateOneDry', () => {
    let attribute;

    context('with an existing validation', () => {
      beforeEach(() => {
        attribute = new Attribute({
          validations: {
            isThree(value) {
              return value === 3 ? true : 'not three';
            },
          },
        });
      });

      context('when the value is valid', () => {
        it('should return true', () => {
          attribute.value = 3;

          expect(attribute.validateOneDry('isThree')).to.be.true;
        });
      });

      context('when the value is invalid', () => {
        it('should return the validation message', () => {
          attribute.value = 0;

          expect(attribute.validateOneDry('isThree')).to.equal('not three');
        });
      });
    });
  });
});
