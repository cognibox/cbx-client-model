import { expect } from 'chai';
import BaseModel from '../../lib/model.js';
import ValidationMixin from '../../lib/mixins/validation.js';

describe('Validation', () => {
  let ModelWithValidation;

  beforeEach(() => {
    ModelWithValidation = class extends ValidationMixin(BaseModel) {
      static attributes() {
        return {
          name: {
            validations: {
              isLongEnough(value) {
                return value.length > 10;
              },
            },
          },
        };
      }
    };
  });

  context('when an attribute is validated', () => {
    let model;

    context('when model is initially valid', () => {
      beforeEach(() => {
        model = new ModelWithValidation({ name: 'a very long name' });
      });

      context('when validating attribute', () => {
        context('when validation fail', () => {
          beforeEach(() => {
            model.attributes.name.value = 'shortname';
            model.attributes.name.validate();
          });

          it('should set isValid to false', () => {
            expect(model.isValid).to.be.false;
          });

          it('should set errors', () => {
            expect(model.errors).to.deep.equal({ name: { isLongEnough: false } });
          });
        });

        context('when validation succeed', () => {
          beforeEach(() => {
            model.attributes.name.value = 'a very long name';
            model.attributes.name.validate();
          });

          it('should set isValid to true', () => {
            expect(model.isValid).to.be.true;
          });

          it('should set errors to an empty object', () => {
            expect(model.errors).to.be.an('object').that.is.empty;
          });
        });
      });
    });

    context('when model is initially not valid', () => {
      beforeEach(() => {
        model = new ModelWithValidation({ name: 'shortname' });
      });

      context('when validating attribute', () => {
        context('when validation fail', () => {
          beforeEach(() => {
            model.attributes.name.value = 'shortname';
            model.attributes.name.validate();
          });

          it('should set isValid to false', () => {
            expect(model.isValid).to.be.false;
          });

          it('should set errors', () => {
            expect(model.errors).to.deep.equal({ name: { isLongEnough: false } });
          });
        });

        context('when validation succeed', () => {
          beforeEach(() => {
            model.attributes.name.value = 'a very long name';
            model.attributes.name.validate();
          });

          it('should set isValid to true', () => {
            expect(model.isValid).to.be.true;
          });

          it('should set errors to an empty object', () => {
            expect(model.errors).to.be.an('object').that.is.empty;
          });
        });
      });
    });
  });
});
