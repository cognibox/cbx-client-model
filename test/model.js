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

  describe('#set', () => {
    context('when attributes is not defined', () => {
      class CustomModel extends Model {
        static attributes() { return { name: {} }; }
      }

      it('should not compute it', () => {
        const model = new CustomModel();
        model.set({ something: Math.random() });
        expect(model.attributes.something).to.be.undefined;
      });
    });

    context('having a parser defined', () => {
      class CustomModel extends Model {
        static attributes() { return { name: {} }; }

        parse(properties) {
          if (properties && properties.toParse) {
            properties.name = properties.toParse;
          }

          return properties;
        }
      }

      it('should compute it', () => {
        const toParseValue = Math.random();
        const model = new CustomModel();

        model.set({ something: Math.random(), toParse: toParseValue });

        expect(model.attributes.name.value).to.equal(toParseValue);
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
