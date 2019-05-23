import { expect } from 'chai';
import Model from '../lib/model.js';

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

  describe('#hasChanged', () => {
    context('initially', () => {
      context('when attribute is initialized with a value', () => {
        it('should be false', () => {
          const defaultValue = Math.random();
          class CustomModel extends Model {
            static attributes() { return { element: { default: defaultValue } }; }
          }

          const customInstance = new CustomModel({ element: defaultValue + 1 });

          expect(customInstance.hasChanged).to.be.false;
        });
      });

      context('when attribute is not initialized with a value', () => {
        context('when attribute has a default value', () => {
          it('should be false', () => {
            const defaultValue = Math.random();
            class CustomModel extends Model {
              static attributes() { return { element: { default: defaultValue } }; }
            }

            const customInstance = new CustomModel();

            expect(customInstance.hasChanged).to.be.false;
          });
        });

        context('when attribute does not have a default value', () => {
          it('should be false', () => {
            class CustomModel extends Model {
              static attributes() { return { element: {} }; }
            }

            const customInstance = new CustomModel();

            expect(customInstance.hasChanged).to.be.false;
          });
        });
      });
    });

    context('when changed', () => {
      it('should return true', () => {
        const defaultValue = Math.random();
        class CustomModel extends Model {
          static attributes() { return { element: { default: defaultValue } }; }
        }

        const customInstance = new CustomModel();

        customInstance.attributes.element.value = defaultValue + 1;

        expect(customInstance.hasChanged).to.be.true;
      });
    });

    context('model having multiple attributes', () => {
      let customInstance;
      const firstAttributeValue = Math.random();
      const secondAttributeValue = Math.random();
      class CustomModel extends Model {
        static attributes() {
          return { firstAttribute: { default: firstAttributeValue }, secondAttribute: { default: secondAttributeValue } };
        }
      }

      beforeEach(() => { customInstance = new CustomModel(); });

      context('when some attributes have changed', () => {
        beforeEach(() => { customInstance.attributes.firstAttribute.value = firstAttributeValue + 1; });

        it('should be true', () => { expect(customInstance.hasChanged).to.be.true; });

        context('when those attributes return to their original value', () => {
          beforeEach(() => { customInstance.attributes.firstAttribute.value = firstAttributeValue; });

          it('should be false', () => { expect(customInstance.hasChanged).to.be.false; });
        });
      });
    });
  });

  describe('#changes', () => {
    context('initially', () => {
      context('when attribute is initialized with a value', () => {
        it('should be empty', () => {
          const defaultValue = Math.random();
          class CustomModel extends Model {
            static attributes() { return { element: { default: defaultValue } }; }
          }

          const customInstance = new CustomModel({ element: defaultValue + 1 });

          expect(customInstance.changes).to.deep.equal({});
        });
      });

      context('when attribute is not initialized with a value', () => {
        context('when attribute has a default value', () => {
          it('should be empty', () => {
            const defaultValue = Math.random();
            class CustomModel extends Model {
              static attributes() { return { element: { default: defaultValue } }; }
            }

            const customInstance = new CustomModel();

            expect(customInstance.changes).to.deep.equal({});
          });
        });

        context('when attribute does not have a default value', () => {
          it('should be empty', () => {
            class CustomModel extends Model {
              static attributes() { return { element: {} }; }
            }

            const customInstance = new CustomModel();

            expect(customInstance.changes).to.deep.equal({});
          });
        });
      });
    });

    context('model having multiple attributes', () => {
      let customInstance;
      const firstAttributeValue = Math.random();
      const secondAttributeValue = Math.random();
      class CustomModel extends Model {
        static attributes() {
          return { firstAttribute: { default: firstAttributeValue }, secondAttribute: { default: secondAttributeValue } };
        }
      }

      beforeEach(() => { customInstance = new CustomModel(); });

      context('when some attributes have changed', () => {
        const newValue = firstAttributeValue + 1;

        beforeEach(() => { customInstance.attributes.firstAttribute.value = newValue; });

        it('should list the attribute with his new and old value', () => {
          expect(customInstance.changes).to.deep.equal({
            firstAttribute: {
              newValue: newValue,
              oldValue: firstAttributeValue
            }
          });
        });

        context('when those attributes return to their original value', () => {
          beforeEach(() => { customInstance.attributes.firstAttribute.value = firstAttributeValue; });

          it('should be empty', () => { expect(customInstance.changes).to.deep.equal({}); });
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

    context('having an attribute parser defined', () => {
      class CustomModel extends Model {
        static attributes() { return { name: {} }; }

        parse(properties) {
          if (properties && properties.toParse) {
            properties.name = properties.toParse;
          }

          return super.parse(properties);
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

  describe('#setPristine', () => {
    let model;

    beforeEach(() => {
      class CustomModel extends Model {
        static attributes() { return { name: {} }; }
      }

      model = new CustomModel({ name: Math.random });
      model.attributes.name.value += 5;

      model.setPristine();
    });

    it('should set every attributes pristine', () => {
      expect(model.attributes.name.hasChanged).to.be.false;
    });

    it('should set changes to an empty object', () => {
      expect(model.changes).to.deep.equal({});
    });

    it('should set hasChanged to false', () => {
      expect(model.hasChanged).to.be.false;
    });
  });

  context('when overriding attributeClass', () => {
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

  context('when overriding associationClass', () => {
    class CustomAssociationClass extends Model.associationClass() {}
    class AssociationModelClass {}
    class CustomModel extends Model {
      static associationClass() { return CustomAssociationClass; }
      static associations() { return { something: { type: 'belongsTo', class: AssociationModelClass } }; }
    }

    describe('when initializing', () => {
      it('should initialize associations using the new class', () => {
        const customModel = new CustomModel();
        expect(customModel.associations.something).to.be.an.instanceof(CustomAssociationClass);
      });
    });
  });
});
