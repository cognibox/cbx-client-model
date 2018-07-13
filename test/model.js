import { expect } from 'chai';
import Model from '../model.js';

describe('Model', () => {
  describe('#constructor', () => {
    describe('with default values', () => {
      const defaultName = 'jean';
      class CustomModel extends Model {
        static attributes() { return { name: { default: defaultName } }; }
      }

      describe('with values in parameters', () => {
        it('should take passed values', () => {
          const customName = 'marc';
          const customModel = new CustomModel({ name: 'marc' });
          expect(customModel.attributes.name.value).to.equal(customName);
        });
      });

      describe('without values in parameters', () => {
        it('should take default values', () => {
          const customModel = new CustomModel();
          expect(customModel.attributes.name.value).to.equal(defaultName);
        });
      });
    });
  });

  describe('when overriding attributeClass', () => {
    class CustomAttribute extends Model.attributeClass() {}
    class CustomModel extends Model {
      static attributeClass() { return CustomAttribute; }
      static attributes() { return { name: {} }; }
    }

    describe('when initializing', () => {
      it('should initialize attributes using the new class', () => {
        const customModel = new CustomModel();
        expect(customModel.attributes.name).to.be.an.instanceof(CustomAttribute);
      });
    });
  });
});
