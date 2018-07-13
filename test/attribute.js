import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Attribute from '../attribute.js';

const expect = chai.expect;
chai.use(sinonChai);

describe('Attribute', () => {
  describe('constructor', () => {
    let model, parent;
    const originalValue = Math.random();

    beforeEach(() => {
      parent = {};
      model = new Attribute({ parent: parent, value: originalValue });
    });

    it('should set hasChanged to false', () => { expect(model.hasChanged).to.be.false; });

    it('should set isDirty to false', () => { expect(model.isDirty).to.be.false; });
  });

  describe('set', () => {
    let model, parent;
    const originalValue = Math.random();

    beforeEach(() => {
      parent = {};
      model = new Attribute({ parent: parent, value: originalValue });
    });

    describe('when new value is different from old value', () => {
      let newValue;

      beforeEach(() => {
        newValue = originalValue + 1;
        model.value = newValue;
      });

      it('should store the new value', () => { expect(model.value).to.equal(newValue); });
      it('should set hasChanged to true', () => { expect(model.hasChanged).to.be.true; });
      it('should set isDirty to true', () => { expect(model.isDirty).to.be.true; });

      describe('when value is set back to the original value', () => {
        beforeEach(() => { model.value = originalValue; });

        it('should set hasChanged to false', () => { expect(model.hasChanged).to.be.false; });
        it('should keep isDirty to true', () => { expect(model.isDirty).to.be.true; });
      });
    });

    describe('when new value is not different from old value', () => {
      beforeEach(() => { model.value = originalValue; });

      it('should keep hasChanged to false', () => { expect(model.hasChanged).to.be.false; });
      it('should keep isDirty to false', () => { expect(model.isDirty).to.be.false; });
    });

    describe('when listening for changes', () => {
      it('should call listener', () => {
        const callback = sinon.stub();
        model.onChange(callback);

        model.value = originalValue + 1;

        expect(callback).to.have.been.called;
      });
    });
  });

  describe('reset', () => {
    let model, parent;
    const originalValue = Math.random();

    beforeEach(() => {
      parent = {};
      model = new Attribute({ parent: parent, value: originalValue });
      model.value = originalValue + 1;
      model.reset();
    });

    it('should set value to originalValue', () => { expect(model.value).to.equal(originalValue); });
    it('should set hasChanged to false', () => { expect(model.hasChanged).to.be.false; });
    it('should set isDirty to false', () => { expect(model.isDirty).to.be.false; });
  });
});
