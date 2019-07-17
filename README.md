# Proxy-based collision-free pure-ES6 model layer for Cognibox
## Commands
### Installation
`npm i`
### Tests
`npm run test`
### Linting
`npm run lint`
### Build
`npm run build`
## Usage
### Class creation
A base model can be created to add global functionnalities:
```javascript
import { Model } from 'cbx-client-model';

class Base extends Model {
  static urlRoot() {
    return '/api';
  }
}

```
Each model can then extend the Base model:
```javascript
import Base from './base';

class MyModel extends Base {
  ...
}
```
Models require a resource URL:
```javascript
class MyModel extends Base {
  static urlResource() {
    return 'my-model';
  }
}
```
Attributes are specified by an instance method returning an object whose keys are attributes and whose values are instance of Attribute with keys
- default
- validations (required: default false)
- autoValidate (default true)
```javascript
import { Attribute, Model } from 'CbxClientModel';

class MyModel extends Model {
  buildFields() {
    return {
      id: new Attribute(),
      myName: new Attribute({
        value: 'Fred',
        autoValidate: false,
        validations: {
          required() { return this.value !== undefined; },
        },
      }),
    };
  }
}
```
Associations are specified by the same method as Attributes by passing Association instances (BelongsTo, HasOne, HasMany) instead of Attribute instances.
- model (the class of the associated model)
```javascript
import PhoneNumber from './phone-number';
import { HasOne, Model } from 'CbxClientModel';

class MyModel extends Model {
  buildFields() {
    return {
      phoneNumber: new HasOne({
        model: PhoneNumber,
        value: '',
      }),
    };
  }
}
```
### Attributes
Attributes are accessed through the `fields` property and then through `value`
```javascript
import MyModel from './my-model';

const myModel = new MyModel({ id: 1 });
myModel.fields.id.value; // 1
```
The `changes` and `hasChanged` properties track changed on attributes and on the model. Changed can be reset using the `setPristine` method
```javascript
import MyModel from './my-model';

const myModel = new MyModel({ id: 1 });
myModel.fields.id.value; // 1
myModel.fields.id.hasChanged; // false
myModel.fields.id.value = 2;
myModel.fields.id.hasChanged;// true
myModel.hasChanged; // true
myModel.fields.id.changes; // { oldValue: 1, newValue: 2 }
myModel.changes; // { id: { oldValue: 1, newValue: 2 } }
myModel.fields.id.setPristine();
myModel.fields.id.hasChanged; // false
```
### Model fetching
A single model can be fetched by instantiating it with an `id`
```javascript
import MyModel from './my-model';

const myModel = new MyModel({ id: 1 });
myModel.fetch();
```
The `fetch` method also takes an argument transferred in the payload
```javascript
myModel.fetch({ fields: ['name'] });
```
All models can be fetched using the `fetchAll` method
```javascript
const allModels = MyModel.fetchAll();
```
All element of an association can also be fetched using `fetch`
```javascript
const myModel = new MyModel({ id: 1 });
myModel.fetch();
myModel.fields.phoneNumber.fetch();
```
### Model saving
Models can then be saved to the server using the `save` method. Calls only occur if the model has changed.
The `save` method returns a promise which resolves when the save is done.
Once the model is saved, `changes` are reset.
```javascript
const myModel = new MyModel({ id: 1 });
myModel.fetch();
myModel.name = 'Fredi';
myModel.hasChanged; // true
myModel.save();
myModel.hasChanged; // false
```
