import { expect } from 'chai';
import HttpMixin from '../../lib/mixins/http.js';
import httpMock from '../helpers/http-mock.js';
import { Attribute, HasMany, Model } from '../../lib/main.js';

describe('Http#hasManyAssociation', () => {
  let hasManyAssociationUrl, Klass, data, httpOptions, hasManyAssociationUrlRessource, urlResource, urlRoot, HasManyAssociationKlass, id, KlassWithHasManyAssociations, model;

  function configureHttpMock(url) {
    httpMock().onGet(url || hasManyAssociationUrl, httpOptions).reply(() => {
      return [200, data];
    });
  }

  beforeEach(() => {
    urlResource = Math.random().toString();
    urlRoot = Math.random().toString();
    hasManyAssociationUrlRessource = Math.random().toString();
    id = Math.random();
    hasManyAssociationUrl = `${urlRoot}/${urlResource}/${id}/${hasManyAssociationUrlRessource}`;
    data = {
      data: [{ stuff: Math.random() }, { stuff: Math.random() }],
      meta: { count: 1}
    };

    Klass = class extends HttpMixin(Model) {
      static urlRoot() { return urlRoot; }

      static urlResource() { return urlResource; }
    };

    HasManyAssociationKlass = class extends Klass {
      buildFields() {
        return {
          id: new Attribute(),
          stuff: new Attribute(),
        };
      }

      static urlResource() { return hasManyAssociationUrlRessource; }
    };

    KlassWithHasManyAssociations = class extends Klass {
      buildFields() {
        return {
          id: new Attribute(),
          hasManyElement: new HasMany({ model: HasManyAssociationKlass }),
          hasManyCustomElement: new HasMany({ model: HasManyAssociationKlass, url: 'dracaufeu' }),
          hasManyCustomElementFn: new HasMany({ model: HasManyAssociationKlass, url: () => 'dracaufeu/5' }),
        };
      }
    };

    model = new KlassWithHasManyAssociations({ id: id });
  });

  describe('#fetch', () => {
    it('should set associations model properties', async() => {
      configureHttpMock();
      await model.fields.hasManyElement.fetch();
      expect(model.fields.hasManyElement.value[0].fields.stuff.value).to.equal(data.data[0].stuff);
      expect(model.fields.hasManyElement.value[1].fields.stuff.value).to.equal(data.data[1].stuff);
    });

    it('should clear changes on the associations', async() => {
      configureHttpMock();
      await model.fields.hasManyElement.fetch();

      expect(model.fields.hasManyElement.hasChanged).to.be.false;
    });

    context('with custom url', () => {
      it('should set associations model properties', async() => {
        configureHttpMock('dracaufeu');
        await model.fields.hasManyCustomElement.fetch();
        expect(model.fields.hasManyCustomElement.value[0].fields.stuff.value).to.equal(data.data[0].stuff);
        expect(model.fields.hasManyCustomElement.value[1].fields.stuff.value).to.equal(data.data[1].stuff);
      });

      context('when custom url is function', () => {
        it('should set associations model properties', async() => {
          configureHttpMock('dracaufeu/5');
          await model.fields.hasManyCustomElementFn.fetch();
          expect(model.fields.hasManyCustomElementFn.value[0].fields.stuff.value).to.equal(data.data[0].stuff);
          expect(model.fields.hasManyCustomElementFn.value[1].fields.stuff.value).to.equal(data.data[1].stuff);
        });
      });
    });
  });
});
