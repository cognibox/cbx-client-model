import { expect } from 'chai';
import Model from '../lib/model.js';
import Attribute from '../lib/attribute.js';
import { HasOne } from '../lib/association.js';

describe('Model', () => {
  describe('#constructor', () => {
    describe('with default values', () => {
      const defaultName = 'jean';
      let CustomModel;

      beforeEach(() => {
        CustomModel = class extends Model {
          buildFields() { return { name: new Attribute({ value: defaultName }) }; }
        };
      });

      describe('with values in parameters', () => {
        it('should take passed values', () => {
          const customName = 'marc';
          const customModel = new CustomModel({ name: 'marc' });
          expect(customModel.fields.name.value).to.equal(customName);
        });
      });

      describe('without values in parameters', () => {
        it('should take default values', () => {
          const customModel = new CustomModel();
          expect(customModel.fields.name.value).to.equal(defaultName);
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
            buildFields() { return { element: new Attribute({ value: defaultValue }) }; }
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
              buildFields() { return { element: new Attribute({ value: defaultValue }) }; }
            }

            const customInstance = new CustomModel();

            expect(customInstance.hasChanged).to.be.false;
          });
        });

        context('when attribute does not have a default value', () => {
          it('should be false', () => {
            class CustomModel extends Model {
              buildFields() { return { element: new Attribute() }; }
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
          buildFields() { return { element: new Attribute({ value: defaultValue }) }; }
        }

        const customInstance = new CustomModel();

        customInstance.fields.element.value = defaultValue + 1;

        expect(customInstance.hasChanged).to.be.true;
      });
    });

    context('model having multiple fields', () => {
      let customInstance;
      const firstAttributeValue = Math.random();
      const secondAttributeValue = Math.random();
      class CustomModel extends Model {
        buildFields() {
          return {
            firstAttribute: new Attribute({ value: firstAttributeValue }),
            secondAttribute: new Attribute({ value: secondAttributeValue }),
          };
        }
      }

      beforeEach(() => { customInstance = new CustomModel(); });

      context('when some fields have changed', () => {
        beforeEach(() => { customInstance.fields.firstAttribute.value = firstAttributeValue + 1; });

        it('should be true', () => { expect(customInstance.hasChanged).to.be.true; });

        context('when those fields return to their original value', () => {
          beforeEach(() => { customInstance.fields.firstAttribute.value = firstAttributeValue; });

          it('should be false', () => { expect(customInstance.hasChanged).to.be.false; });
        });
      });
    });

    context('model having association', () => {
      class OtherModel extends Model {
        buildFields() {
          return {
            id: new Attribute(),
          };
        }
      }

      class CustomModel extends Model {
        buildFields() {
          return {
            association: new HasOne({ value: {}, model: OtherModel }),
            otherAssociation: new HasOne({ model: OtherModel }),
          };
        }
      }

      context('when given a default value', () => {
        let model;

        beforeEach(() => {
          model = new CustomModel({ association: { id: Math.random() } });
        });

        it('should be false', () => {
          expect(model.hasChanged).to.be.false;
        });

        context('when accessing association', () => {
          it('should not change hasChanged value', () => {
            model.fields.otherAssociation.value;
            expect(model.hasChanged).to.be.false;
          });
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
            buildFields() { return { element: new Attribute({ value: defaultValue }) }; }
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
              buildFields() { return { element: new Attribute({ value: defaultValue }) }; }
            }

            const customInstance = new CustomModel();

            expect(customInstance.changes).to.deep.equal({});
          });
        });

        context('when attribute does not have a default value', () => {
          it('should be empty', () => {
            class CustomModel extends Model {
              buildFields() { return { element: new Attribute() }; }
            }

            const customInstance = new CustomModel();

            expect(customInstance.changes).to.deep.equal({});
          });
        });
      });
    });

    context('model having multiple fields', () => {
      let customInstance;
      const firstAttributeValue = Math.random();
      const secondAttributeValue = Math.random();
      class CustomModel extends Model {
        buildFields() {
          return {
            firstAttribute: new Attribute({ value: firstAttributeValue }),
            secondAttribute: new Attribute({ value: secondAttributeValue }),
          };
        }
      }

      beforeEach(() => { customInstance = new CustomModel(); });

      context('when some fields have changed', () => {
        const newValue = firstAttributeValue + 1;

        beforeEach(() => { customInstance.fields.firstAttribute.value = newValue; });

        it('should list the attribute with his new and old value', () => {
          expect(customInstance.changes).to.deep.equal({
            firstAttribute: {
              newValue: newValue,
              oldValue: firstAttributeValue,
            },
          });
        });

        context('when those fields return to their original value', () => {
          beforeEach(() => { customInstance.fields.firstAttribute.value = firstAttributeValue; });

          it('should be empty', () => { expect(customInstance.changes).to.deep.equal({}); });
        });
      });
    });
  });

  describe('#set', () => {
    context('when passing nothing', () => {
      it('should not crash', () => {
        class CustomModel extends Model {
          buildFields() { return { name: new Attribute() }; }
        }

        const model = new CustomModel();

        model.set();
      });
    });

    context('when fields is not defined', () => {
      it('should not compute it', () => {
        class CustomModel extends Model {
          buildFields() { return { name: new Attribute() }; }
        }
        const model = new CustomModel();

        model.set({ something: Math.random() });

        expect(model.fields.something).to.be.undefined;
      });
    });

    context('having an attribute parser defined', () => {
      class CustomModel extends Model {
        buildFields() { return { name: new Attribute() }; }

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

        expect(model.fields.name.value).to.equal(toParseValue);
      });
    });
  });

  describe('#setPristine', () => {
    let model;

    beforeEach(() => {
      class CustomModel extends Model {
        buildFields() { return { name: new Attribute() }; }
      }

      model = new CustomModel({ name: Math.random() });
      model.fields.name.value += 5;

      model.setPristine();
    });

    it('should set every fields pristine', () => {
      expect(model.fields.name.hasChanged).to.be.false;
    });

    it('should set changes to an empty object', () => {
      expect(model.changes).to.deep.equal({});
    });

    it('should set hasChanged to false', () => {
      expect(model.hasChanged).to.be.false;
    });
  });

  describe('#reset', () => {
    let model, oldValue, newValue;

    beforeEach(() => {
      class CustomModel extends Model {
        buildFields() { return { name: new Attribute() }; }
      }

      oldValue = Math.random();
      newValue = Math.random();
      model = new CustomModel({ name: oldValue });
      model.setPristine();
      model.fields.name.value = newValue;
    });

    context('when model has changed', () => {
      beforeEach(() => {
        model.fields.name.value = newValue;
      });

      it('should clear changed', () => {
        expect(model.hasChanged).to.be.true;
        model.reset();
        expect(model.hasChanged).to.be.false;
      });

      it('should reset to old values', () => {
        model.reset();
        expect(model.fields.name.value).to.equal(oldValue);
      });
    });
  });
});
