import { expect } from 'chai';
import HttpMixin from '../../lib/mixins/http.js';
import httpMock from '../helpers/http-mock.js';
import { Attribute, HasOne, Model } from '../../lib/main.js';

describe('Http#association', () => {
  let associationUrl, Klass, data, httpOptions, associationUrlRessource, urlResource, urlRoot, AssociationKlass, id, KlassWithAssociations, model;

  function configureHttpMock() {
    httpMock().onGet(associationUrl, httpOptions).reply(() => {
      return [200, data];
    });
  }

  beforeEach(() => {
    urlResource = Math.random().toString();
    urlRoot = Math.random().toString();
    associationUrlRessource = Math.random().toString();
    id = Math.random();
    associationUrl = `${urlRoot}/${urlResource}/${id}/${associationUrlRessource}`;
    data = {
      stuff: Math.random(),
    };

    Klass = class extends HttpMixin(Model) {
      static urlRoot() { return urlRoot; }

      static urlResource() { return urlResource; }
    };

    AssociationKlass = class extends Klass {
      buildFields() {
        return {
          id: new Attribute(),
          stuff: new Attribute(),
        };
      }

      static urlResource() { return associationUrlRessource; }
    };

    KlassWithAssociations = class extends Klass {
      buildFields() {
        return {
          id: new Attribute(),
          element: new HasOne({ model: AssociationKlass }),
        };
      }
    };

    model = new KlassWithAssociations({ id: id });
  });

  describe('#fetch', () => {
    it('should set association model properties', async() => {
      configureHttpMock();
      await model.fields.element.fetch();
      expect(model.fields.element.value.fields.stuff.value).to.equal(data.stuff);
    });

    it('should clear changes on the association', async() => {
      configureHttpMock();
      await model.fields.element.fetch();

      expect(model.fields.element.hasChanged).to.be.false;
    });
  });
});
