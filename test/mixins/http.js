import axios from 'axios';
import { expect } from 'chai';
import Model from '../../lib/model.js';
import HttpMixin from '../../lib/mixins/http.js';
import AxiosMockAdapter from 'axios-mock-adapter';

const httpMock = new AxiosMockAdapter(axios);

describe('Http', () => {
  let urlResource, urlRoot, Klass;

  beforeEach(() => {
    urlResource = Math.random().toString();
    urlRoot = Math.random().toString();

    Klass = class extends HttpMixin(Model) {
      static urlRoot() { return urlRoot; }

      static urlResource() { return urlResource; }
    };
  });

  describe('.buildUrl', () => {
    it('should format an url using urlRoot and urlResource', () => {
      expect(Klass.buildUrl()).to.equal(`${urlRoot}/${urlResource}`);
    });
  });

  describe('.fetchAll', () => {
    let KlassWithAttributes, KlassWithDecoder, KlassWithEncoder, url, data, httpOptions;

    function configureHttpMock() {
      httpMock.onGet(url, httpOptions).reply(() => {
        return [200, data];
      });
    }

    beforeEach(() => {
      url = `${urlRoot}/${urlResource}`;
      data = [];

      KlassWithAttributes = class extends Klass {
        static attributes() { return { id: {}, stuff: {} }; }
      };
    });

    context('when data is an array', () => {
      beforeEach(() => { configureHttpMock(); });

      it('should convert data to instances', async() => {
        data = [{}];
        const result = await KlassWithAttributes.fetchAll();
        expect(result.models[0]).to.be.instanceof(KlassWithAttributes);
      });

      it('should return as many instances as received', async() => {
        data = [{}, {}, {}];
        const result = await KlassWithAttributes.fetchAll();
        expect(result.models.length).to.eq(data.length);
      });
    });

    context('when data is an object', () => {
      beforeEach(() => { configureHttpMock(); });

      it('should convert data to instances', async() => {
        data = { data: [{}] };
        const result = await KlassWithAttributes.fetchAll();
        expect(result.models[0]).to.be.instanceof(KlassWithAttributes);
      });

      it('should return as many instances as received', async() => {
        data = { data: [{}, {}, {}] };
        const result = await KlassWithAttributes.fetchAll();
        expect(result.models.length).to.eq(data.data.length);
      });

      it('should keep original response information', async() => {
        data = { data: [], count: Math.random(), otherStuff: Math.random() };
        const result = await KlassWithAttributes.fetchAll();
        expect(result).to.deep.equal({
          data: data.data,
          count: data.count,
          otherStuff: data.otherStuff,
          models: [],
        });
      });
    });

    context('when given a custom decode function', () => {
      beforeEach(() => { configureHttpMock(); });

      beforeEach(() => {
        KlassWithDecoder = class extends KlassWithAttributes {
          static decode(properties) {
            return { id: properties.uid, stuff: properties.things };
          }
        };
      });

      it('should use the decode function', async() => {
        data = [{ uid: 1, things: 'foo' }];
        const result = await KlassWithDecoder.fetchAll();
        const model = result.models[0];
        expect(model.attributes.id.value).to.eq(data[0].uid);
        expect(model.attributes.stuff.value).to.eq(data[0].things);
      });
    });

    context('when passing parameters', () => {
      it('should retrieve data using params', async() => {
        httpOptions = { params: { stuff: Math.random() } };
        configureHttpMock();
        data = [{}];

        const result = await KlassWithAttributes.fetchAll(httpOptions);

        expect(result.models.length).to.eq(data.length);
      });

      context('when given a custom encode function', () => {
        beforeEach(() => {
          KlassWithEncoder = class extends KlassWithAttributes {
            static encode(properties) {
              return { params: { stuff: `${properties.params.stuff}a` } };
            }
          };
        });

        it('should use the encode function for the payload', async() => {
          const value = Math.random();
          const clientOptions = { params: { stuff: value } };
          httpOptions = { params: { stuff: `${value}a` } };
          configureHttpMock();
          data = [{}];

          const result = await KlassWithEncoder.fetchAll(clientOptions);
          expect(result).to.not.be.undefined;
        });
      });
    });
  });

  describe('.fetchOne', () => {
    let KlassWithAttributes, KlassWithDecoder, KlassWithEncoder, id, url, data, httpOptions;

    function configureHttpMock() {
      httpMock.onGet(url, httpOptions).reply(() => {
        return [200, data];
      });
    }

    beforeEach(() => {
      id = Math.random();
      url = `${urlRoot}/${urlResource}/${id}`;
      data = {
        stuff: Math.random(),
      };

      KlassWithAttributes = class extends Klass {
        static attributes() { return { id: {}, stuff: {} }; }
      };
    });

    it('should return a new instance', async() => {
      configureHttpMock();
      const result = await KlassWithAttributes.fetchOne(id);
      expect(result).to.be.instanceof(KlassWithAttributes);
    });

    it('should set model properties', async() => {
      configureHttpMock();
      const result = await KlassWithAttributes.fetchOne(id);
      expect(result.attributes.stuff.value).to.equal(data.stuff);
    });

    context('when given a custom decode function', () => {
      beforeEach(() => {
        KlassWithDecoder = class extends KlassWithAttributes {
          static decode(properties) {
            return { id: properties.uid, stuff: properties.things };
          }
        };
      });

      it('should use the decode function', async() => {
        configureHttpMock();
        data = { things: 'foo' };

        const result = await KlassWithDecoder.fetchOne(id);

        expect(result.attributes.stuff.value).to.eq(data.things);
      });
    });

    context('when passing parameters', () => {
      it('should retrieve data using params', async() => {
        httpOptions = { params: { stuff: Math.random() } };
        configureHttpMock();

        const result = await KlassWithAttributes.fetchOne(id, httpOptions);

        expect(result.attributes.stuff.value).to.equal(data.stuff);
      });

      context('when given a custom encode function', () => {
        beforeEach(() => {
          KlassWithEncoder = class extends KlassWithAttributes {
            static encode(properties) {
              return { params: { stuff: `${properties.params.stuff}a` } };
            }
          };
        });

        it('should use the encode function for the payload', async() => {
          const value = Math.random();
          const clientOptions = { params: { stuff: value } };
          httpOptions = { params: { stuff: `${value}a` } };
          configureHttpMock();

          const result = await KlassWithEncoder.fetchOne(id, clientOptions);
          expect(result).to.not.be.undefined;
        });
      });
    });
  });

  describe('#buildUrl', () => {
    describe('when id is the primary key', () => {
      let KlassWithAttributes;

      beforeEach(() => {
        KlassWithAttributes = class extends Klass {
          static attributes() { return { id: {} }; }
        };
      });

      it('should format url using urlRoot, urlResource, id', () => {
        const id = Math.random();
        const klass = new KlassWithAttributes({ id: id });

        expect(klass.buildUrl()).to.equal(`${urlRoot}/${urlResource}/${id}`);
      });
    });

    describe('when id is not the primary key', () => {
      let KlassWithAttributes;

      beforeEach(() => {
        KlassWithAttributes = class extends Klass {
          static attributes() {
            return {
              id: {},
              otherKey: { primary: true },
            };
          }
        };
      });

      it('should format url using urlRoot, urlResource, otherKey', () => {
        const otherKey = Math.random();
        const klass = new KlassWithAttributes({ id: Math.random(), otherKey: otherKey });

        expect(klass.buildUrl()).to.equal(`${urlRoot}/${urlResource}/${otherKey}`);
      });
    });
  });

  describe('#fetch', () => {
    let model, KlassWithAttributes, KlassWithDecoder, id, url, data, httpOptions;

    function configureHttpMock() {
      httpMock.onGet(url, httpOptions).reply(() => {
        return [200, data];
      });
    }

    beforeEach(() => {
      id = Math.random();
      url = `${urlRoot}/${urlResource}/${id}`;
      data = {
        stuff: Math.random(),
      };

      KlassWithAttributes = class extends Klass {
        static attributes() { return { id: {}, stuff: {} }; }
      };

      model = new KlassWithAttributes({ id: id });
    });

    it('should set model properties', async() => {
      configureHttpMock();
      await model.fetch();
      expect(model.attributes.stuff.value).to.equal(data.stuff);
    });

    context('when given a custom decode function', () => {
      beforeEach(() => {
        KlassWithDecoder = class extends KlassWithAttributes {
          static decode(properties) {
            return { id: properties.uid, stuff: properties.things };
          }
        };
      });

      it('should use the decode function', async() => {
        configureHttpMock();
        data = { things: 'foo' };

        const result = await KlassWithDecoder.fetchOne(id);

        expect(result.attributes.stuff.value).to.eq(data.things);
      });
    });

    context('when passing parameters', () => {
      it('should retrieve data using params', async() => {
        httpOptions = { params: { stuff: Math.random() } };
        configureHttpMock();

        await model.fetch(httpOptions);

        expect(model.attributes.stuff.value).to.equal(data.stuff);
      });
    });
  });

  describe('#isNew', () => {
    let model, KlassWithAttributes;

    beforeEach(() => {
      KlassWithAttributes = class extends Klass {
        static attributes() { return { uid: { primary: true }, stuff: {} }; }
      };
    });

    context('when primary is setted', () => {
      it('should return false', () => {
        model = new KlassWithAttributes({ uid: Math.random(), stuff: Math.random() });
        expect(model.isNew()).to.be.false;
      });
    });

    context('when primary is not setted', () => {
      it('should return true', () => {
        model = new KlassWithAttributes({ stuff: Math.random() });
        expect(model.isNew()).to.be.true;
      });
    });
  });

  describe('#save', () => {
    let model, KlassWithAttributes, KlassWithEncoder;

    beforeEach(() => {
      KlassWithAttributes = class extends Klass {
        static attributes() { return { uid: { primary: true }, attr1: {}, attr2: {}, attr3: {} }; }
      };
    });

    context('when passing data', () => {
      context('when passing an existing attributes', () => {
        it('should prioritize the passing value', async() => {
          const modelValue = Math.random();
          const dataValue = modelValue + 5;
          const postData = { something: Math.random() };
          const url = `${urlRoot}/${urlResource}`;
          httpMock.onPost(url, {
            attr1: dataValue,
          }).reply(() => {
            return [200, postData];
          });

          model = new KlassWithAttributes({ attr1: modelValue });
          const result = await model.save({ attr1: dataValue });

          expect(result.data).to.deep.equal(postData);
        });

        context('when given a custom encode function', () => {
          beforeEach(() => {
            KlassWithEncoder = class extends KlassWithAttributes {
              static encode(properties) {
                Object.keys(properties).forEach((key) => {
                  if (properties[key]) properties[key] = `${properties[key]}a`;
                });
                return properties;
              }
            };
          });

          it('should use the encode function', async() => {
            const modelValue = Math.random();
            const dataValue = modelValue + 5;
            const postData = { something: Math.random() };
            const url = `${urlRoot}/${urlResource}`;

            model = new KlassWithEncoder({ attr1: modelValue });
            httpMock.onPost(url, {
              attr1: dataValue + 'a',
            }).reply(() => {
              return [200, postData];
            });

            const result = await model.save({ attr1: dataValue });

            expect(result.data).to.deep.equal(postData);
          });
        });
      });

      context('when passing a non existing attributes', () => {
        it('should send the value', async() => {
          const modelValue = Math.random();
          const dataValue = modelValue + 5;
          const postData = { something: Math.random() };
          const url = `${urlRoot}/${urlResource}`;
          httpMock.onPost(url, {
            attr1: modelValue,
            mew: dataValue,
          }).reply(() => {
            return [200, postData];
          });

          model = new KlassWithAttributes({ attr1: modelValue });
          const result = await model.save({ mew: dataValue });

          expect(result.data).to.deep.equal(postData);
        });
      });
    });

    context('when instance is new', () => {
      let postData, attr1Value, attr2Value;

      beforeEach(() => {
        attr1Value = Math.random();
        attr2Value = Math.random();
        const url = `${urlRoot}/${urlResource}`;
        postData = { something: Math.random() };
        httpMock.onPost(url, {
          attr1: attr1Value,
          attr2: attr2Value,
        }).reply(() => {
          return [200, postData];
        });

        model = new KlassWithAttributes({ attr1: attr1Value });
        model.attributes.attr2.value = attr2Value;
      });

      it('should post data', async() => {
        const result = await model.save();
        expect(result.data).to.deep.equal(postData);
      });
    });

    context('when instance is not new', () => {
      let patchData;

      beforeEach(() => {
        const uidValue = Math.random();
        const url = `${urlRoot}/${urlResource}/${uidValue}`;
        patchData = { something: Math.random() };

        const attr1Value = Math.random();
        const newAttr1Value = attr1Value + 1;
        const newAttr3Value = Math.random();

        httpMock.onPatch(url, {
          attr1: newAttr1Value,
          attr3: newAttr3Value,
        }).reply(() => {
          return [200, patchData];
        });

        model = new KlassWithAttributes({
          uid: uidValue,
          attr1: attr1Value,
          attr2: Math.random(),
        });

        model.attributes.attr1.value = newAttr1Value;
        model.attributes.attr3.value = newAttr3Value;
      });

      it('should patch data', async() => {
        const result = await model.save();
        expect(result.data).to.deep.equal(patchData);
      });

      it('should set the model pristine again', async() => {
        await model.save();

        expect(model.hasChanged).to.be.false;
        expect(model.changes).to.be.empty;
      });
    });
  });

  describe('#association#fetch', () => {
    let AssociationClass, associationUrlRessource, ClassWithAssociations, data, id, model;

    beforeEach(() => {
      associationUrlRessource = Math.random().toString();
      AssociationClass = class extends Klass {
        static attributes() { return { id: {}, stuff: {} }; }

        static urlResource() { return associationUrlRessource; }
      };

      id = Math.random();
      const associationUrl = `${urlRoot}/${urlResource}/${id}/${associationUrlRessource}`;
      data = {
        stuff: Math.random(),
      };

      ClassWithAssociations = class extends Klass {
        static attributes() { return { id: {} }; }

        static associations() {
          return {
            element: { type: 'hasOne', class: AssociationClass },
          };
        }
      };

      model = new ClassWithAssociations({ id: id });

      httpMock.onGet(associationUrl).reply(200, data);
    });

    it('should set association model properties', async() => {
      await model.associations.element.fetch();
      expect(model.associations.element.value.attributes.stuff.value).to.equal(data.stuff);
    });
  });

  context('for associations', () => {
    describe('#buildUrl', () => {
      let ModelClass, AssociationUrlRessource;

      beforeEach(() => {
        AssociationUrlRessource = Math.random().toString();

        Klass = class extends HttpMixin(Model) {
          static urlRoot() { return urlRoot; }

          static urlResource() { return urlResource; }
        };

        const AssociationModelClass = class extends Klass {
          static attributes() {
            return { id: {} };
          }

          static urlResource() { return AssociationUrlRessource; }
        };

        ModelClass = class extends Klass {
          static attributes() {
            return { id: {} };
          }

          static associations() {
            return {
              element: { type: 'hasOne', class: AssociationModelClass },
            };
          }
        };
      });

      it('should use parent url as root url', () => {
        const id = Math.random().toString();
        const model = new ModelClass({ id: id });

        const association = model.associations.element.value;

        expect(association.buildUrl()).to.equal(`${model.buildUrl()}/${AssociationUrlRessource}`);
      });
    });
  });
});
