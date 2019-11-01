import { expect } from 'chai';
import HttpMixin from '../../lib/mixins/http.js';
import httpMock from '../helpers/http-mock.js';
import { Model, Attribute, HasOne, HasMany } from '../../lib/main.js';

describe('Http', () => {
  let urlResource, urlRoot, Klass, fields;

  beforeEach(() => {
    urlResource = Math.random().toString();
    urlRoot = Math.random().toString();

    fields = {};

    Klass = class extends HttpMixin(Model) {
      static urlRoot() { return urlRoot; }

      static urlResource() { return urlResource; }

      buildFields() {
        return fields;
      }
    };
  });

  describe('#constructor', () => {
    context('when having attribute', () => {
      it('should not add baseUrl to the field', () => {
        fields = {
          id: new Attribute(),
          attribute: new Attribute(),
        };

        const instance = new Klass({ id: Math.random() });

        expect(instance.fields.attribute.baseUrl).to.be.undefined;
      });
    });

    context('when having association', () => {
      it('should add baseUrl to the field', () => {
        fields = {
          id: new Attribute(),
          association: new HasOne({
            model: Klass,
          }),
        };

        const instance = new Klass({ id: Math.random() });

        expect(instance.fields.association.baseUrl).to.not.be.undefined;
      });
    });
  });

  describe('.buildUrl', () => {
    it('should format an url using urlRoot and urlResource', () => {
      expect(Klass.buildUrl()).to.equal(`${urlRoot}/${urlResource}`);
    });
  });

  describe('.fetchAll', () => {
    let KlassWithAttributes, url, data, httpOptions;

    function configureHttpMock() {
      httpMock().onGet(url, httpOptions).reply(() => {
        return [200, data];
      });
    }

    beforeEach(() => {
      url = `${urlRoot}/${urlResource}`;
      data = [];

      KlassWithAttributes = class extends Klass {
        buildFields() { return { id: new Attribute(), stuff: new Attribute() }; }
      };
    });

    context('when data is an array with a null value', () => {
      beforeEach(() => { configureHttpMock(); });

      it('should convert data to instances', async() => {
        data = [{}, undefined, null];
        const result = await KlassWithAttributes.fetchAll();
        expect(result.data[0]).to.be.instanceof(KlassWithAttributes);
      });
    });

    context('when data is an array', () => {
      beforeEach(() => { configureHttpMock(); });

      it('should convert data to instances', async() => {
        data = [{}];
        const result = await KlassWithAttributes.fetchAll();
        expect(result.data[0]).to.be.instanceof(KlassWithAttributes);
      });

      it('should return as many instances as received', async() => {
        data = [{}, {}, {}];
        const result = await KlassWithAttributes.fetchAll();
        expect(result.data.length).to.eq(data.length);
      });

      context('when data is empty', () => {
        it('should not crash', async() => {
          data = [];
          await KlassWithAttributes.fetchAll();
        });
      });
    });

    context('when data is an object', () => {
      beforeEach(() => { configureHttpMock(); });

      it('should convert data to instances', async() => {
        data = { data: [{}] };
        const result = await KlassWithAttributes.fetchAll();
        expect(result.data[0]).to.be.instanceof(KlassWithAttributes);
      });

      it('should return as many instances as received', async() => {
        data = { data: [{}, {}, {}] };
        const result = await KlassWithAttributes.fetchAll();
        expect(result.data.length).to.eq(data.data.length);
      });

      it('should keep original response information', async() => {
        data = { data: [], count: Math.random(), otherStuff: Math.random() };
        const result = await KlassWithAttributes.fetchAll();
        expect(result.raw).to.deep.equal({
          data: data.data,
          count: data.count,
          otherStuff: data.otherStuff,
        });
      });
    });

    context('when passing parameters', () => {
      it('should retrieve data using params', async() => {
        httpOptions = { params: { stuff: Math.random() } };
        configureHttpMock();
        data = [{}];

        const result = await KlassWithAttributes.fetchAll({ options: httpOptions });

        expect(result.data.length).to.eq(data.length);
      });

      context('when passing an url in parameters', () => {
        it('should use the given url', async() => {
          url = `${ Math.random() }/${ Math.random() }`;
          configureHttpMock();
          data = [{}];

          const result = await KlassWithAttributes.fetchAll({ url: url, options: httpOptions });

          expect(result.data.length).to.eq(data.length);
        });
      });
    });
  });

  describe('.fetchOne', () => {
    let KlassWithAttributes, id, url, data, httpOptions;

    function configureHttpMock() {
      httpMock().onGet(url, httpOptions).reply(() => {
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
        buildFields() { return { id: new Attribute(), stuff: new Attribute() }; }
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
      expect(result.fields.stuff.value).to.equal(data.stuff);
    });

    context('when data is undefined', () => {
      beforeEach(() => { configureHttpMock(); });

      it('should not crash', async() => {
        data = undefined;
        await KlassWithAttributes.fetchOne(id);
      });
    });

    context('when data is null', () => {
      beforeEach(() => { configureHttpMock(); });

      it('should not crash', async() => {
        data = null;
        await KlassWithAttributes.fetchOne(id);
      });
    });

    context('when passing parameters', () => {
      it('should retrieve data using params', async() => {
        httpOptions = { params: { stuff: Math.random() } };
        configureHttpMock();

        const result = await KlassWithAttributes.fetchOne(id, { options: httpOptions });

        expect(result.fields.stuff.value).to.equal(data.stuff);
      });
    });
  });

  describe('#buildUrl', () => {
    describe('when id is the primary key', () => {
      let KlassWithAttributes;

      beforeEach(() => {
        KlassWithAttributes = class extends Klass {
          buildFields() { return { id: new Attribute() }; }
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
          static primaryKey() { return 'otherKey'; }

          buildFields() {
            return {
              id: new Attribute(),
              otherKey: new Attribute(),
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
    let AssociationKlass, model, KlassWithAttributes, id, url, data, httpOptions;

    function configureHttpMock() {
      httpMock().onGet(url, httpOptions).reply(() => {
        return [200, data];
      });
    }

    beforeEach(() => {
      id = Math.random();
      url = `${urlRoot}/${urlResource}/${id}`;
      data = {
        stuff: Math.random(),
      };

      AssociationKlass = class extends Klass {
        buildFields() {
          return {
            id: new Attribute(),
          };
        }
      };

      KlassWithAttributes = class extends Klass {
        buildFields() {
          return {
            id: new Attribute(),
            stuff: new Attribute(),
            assoc: new HasMany({ model: AssociationKlass }),
          };
        }
      };

      model = new KlassWithAttributes({ id: id });
    });

    it('should set model properties', async() => {
      configureHttpMock();
      await model.fetch();
      expect(model.fields.stuff.value).to.equal(data.stuff);
    });

    it('should clear changes on the model', async() => {
      configureHttpMock();
      await model.fetch();

      expect(model.hasChanged).to.be.false;
    });

    context('when data is undefined', () => {
      beforeEach(() => { configureHttpMock(); });

      it('should not crash', async() => {
        data = undefined;
        await model.fetch();
      });
    });

    context('when the server returns association data', () => {
      it('should set the association', async() => {
        data = { assoc: [{ id: 1 }] };
        configureHttpMock();
        await model.fetch();

        expect(model.fields.assoc.value.length).to.equal(1);
        expect(model.fields.assoc.value[0]).to.be.an.instanceOf(AssociationKlass);
        expect(model.fields.assoc.value[0].fields.id.value).to.equal(1);
      });
    });

    context('when the attribute is falsey and not undefined', () => {
      beforeEach(() => { configureHttpMock(); });

      it('should set the attribute', async() => {
        data = { stuff: false };
        await model.fetch();
        expect(model.fields.stuff.value).to.be.false;
      });
    });

    context('when the attribute is an array', () => {
      beforeEach(() => { configureHttpMock(); });

      it('should set the attribute', async() => {
        data = { stuff: ['mew'] };
        await model.fetch();
        expect(model.fields.stuff.value).to.deep.equal(['mew']);
      });
    });

    context('when passing parameters', () => {
      it('should retrieve data using params', async() => {
        httpOptions = { params: { stuff: Math.random() } };
        configureHttpMock();

        await model.fetch({ options: httpOptions });

        expect(model.fields.stuff.value).to.equal(data.stuff);
      });
    });

    context('when passing parameters', () => {
      it('should retrieve data using params', async() => {
        httpOptions = { params: { stuff: Math.random() } };
        configureHttpMock();

        await model.fetch({ options: httpOptions });

        expect(model.fields.stuff.value).to.equal(data.stuff);
      });

      context('when passing an url in parameters', () => {
        it('should use the given url', async() => {
          url = `${ Math.random() }/${ Math.random() }`;
          configureHttpMock();

          await model.fetch({ url: url, options: httpOptions });

          expect(model.fields.stuff.value).to.equal(data.stuff);
        });
      });
    });
  });

  describe('#isNew', () => {
    let model, KlassWithAttributes;

    beforeEach(() => {
      KlassWithAttributes = class extends Klass {
        static primaryKey() { return 'uid'; }

        buildFields() { return { uid: new Attribute(), stuff: new Attribute() }; }
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
    let AssociationKlass, model, KlassWithAttributes;

    beforeEach(() => {
      AssociationKlass = class extends Klass {
        buildFields() {
          return {
            id: new Attribute(),
          };
        }
      };

      KlassWithAttributes = class extends Klass {
        static primaryKey() { return 'uid'; }

        buildFields() {
          return {
            uid: new Attribute(),
            attr1: new Attribute(),
            attr2: new Attribute(),
            attr3: new Attribute(),
            assoc: new HasOne({
              model: AssociationKlass,
            }),
          };
        }
      };
    });

    context('when the model has associations', () => {
      context('when the association hasChanged', () => {
        it('should not send the association', async() => {
          const url = `${urlRoot}/${urlResource}`;
          httpMock().onPost(url).reply(() => {
            return [200];
          });

          model = new KlassWithAttributes({ assoc: new AssociationKlass({ id: 1 }) });
          model.fields.assoc.value.fields.id.value = 1;
          const result = await model.save();

          expect(result).to.not.be.undefined;
        });
      });
    });

    context('when passing data', () => {
      context('when passing an existing attributes', () => {
        it('should prioritize the passing value', async() => {
          const modelValue = Math.random();
          const dataValue = modelValue + 5;
          const postData = { something: Math.random() };
          const url = `${urlRoot}/${urlResource}`;
          httpMock().onPost(url, {
            attr1: dataValue,
          }).reply(() => {
            return [200, postData];
          });

          model = new KlassWithAttributes({ attr1: modelValue });
          const result = await model.save({ data: { attr1: dataValue } });

          expect(result.data).to.deep.equal(postData);
        });

        context('with custom url', () => {
          it('use the custom url', async() => {
            const modelValue = Math.random();
            const postData = { something: Math.random() };
            const url = `${urlRoot}/${Math.random()}`;
            httpMock().onPost(url, {
              attr1: modelValue,
            }).reply(() => {
              return [200, postData];
            });

            model = new KlassWithAttributes({ attr1: modelValue });
            const result = await model.save({ url: url });

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
          httpMock().onPost(url, {
            attr1: modelValue,
            mew: dataValue,
          }).reply(() => {
            return [200, postData];
          });

          model = new KlassWithAttributes({ attr1: modelValue });
          const result = await model.save({ data: { mew: dataValue } });

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
        httpMock().onPost(url, {
          attr1: attr1Value,
          attr2: attr2Value,
        }).reply(() => {
          return [200, postData];
        });

        model = new KlassWithAttributes({ attr1: attr1Value });
        model.fields.attr2.value = attr2Value;
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

        httpMock().onPatch(url, {
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

        model.fields.attr1.value = newAttr1Value;
        model.fields.attr3.value = newAttr3Value;
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
});
