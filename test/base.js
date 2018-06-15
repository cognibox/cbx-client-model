import { expect } from 'chai';
import Base from '../base.js';

describe('Base', () => {
  describe('#constructor', () => {
    describe('with default values', () => {
      const defaultName = 'jean';
      class Model extends Base {
        static attributes() { return { name: { default: defaultName } }; }
      }

      describe('with values in parameters', () => {
        it('should take passed values', () => {
          const customName = 'marc';
          const model = new Model({ name: 'marc' });
          expect(model.attributes.name.get()).to.equal(customName);
        });
      });

      describe('without values in parameters', () => {
        it('should take default values', () => {
          const model = new Model();
          expect(model.attributes.name.get()).to.equal(defaultName);
        });
      });
    });
  });

  describe('when overriding attributeClass', () => {
    class CustomAttribute extends Base.attributeClass() {}
    class Model extends Base {
      static attributeClass() { return CustomAttribute; }
      static attributes() { return { name: {} }; }
    }
    describe('when initializing', () => {
      it('should initialize attributes using the new class', () => {
        const model = new Model();
        expect(model.attributes.name).to.be.an.instanceof(CustomAttribute);
      });
    });
  });
});
