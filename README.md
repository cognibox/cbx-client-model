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
import Model from 'cbx-client-model';

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
Attributes are specified by a static method returning an object whose keys are attributes and whose values are objects with keys
- default
- validations (required: default false)
- autoValidate (default true)
```javascript
class MyModel extends Base {
  static attributes() {
    return {
      id: {},
      myName: {
        default: 'Fred',
        autoValidate: false,
        validations: {
          required: true,
        },
      },
    };
  }
}
```
Associations are specified by a static method which returns an object whose keys are this name of the association and whose values are objects with the same keys as attributes, plus
- class (the class of the associated model)
- type (hasMany, hasOne)
```javascript
import PhoneNumber from './phone-number';

class MyModel extends Base {
  static associations() {
    return {
      phoneNumber: {
        class: PhoneNumber,
        default: '',
        type: 'hasOne',
      },
    };
  }
}
```
### Attributes
Attributes are accessed through the `attributes` property and then through `value`
```javascript
import MyModel from './my-model';

const myModel = new MyModel({id: 1})
myModel.attributes.id.value // 1
```
The `changes` and `hasChanged` properties track changed on attributes and on the model. Changed can be reset using the `setPristine` method
```javascript
import MyModel from './my-model';

const myModel = new MyModel({id: 1})
myModel.attributes.id.value // 1
myModel.attributes.id.hasChanged // false
myModel.attributes.id.value = 2
myModel.attributes.id.hasChanged // true
myModel.hasChanged // true
myModel.attributes.id.changes // { oldValue: 1, newValue: 2 }
myModel.changes // { id: { oldValue: 1, newValue: 2 } }
myModel.attributes.id.setPristine()
myModel.attributes.id.hasChanged // false
```
### Model fetching
A single model can be fetched by instantiating it with an `id`
```javascript
import MyModel from './my-model';

const myModel = new MyModel({id: 1})
myModel.fetch()
```
The `fetch` method also takes an argument transferred in the payload
```javascript
myModel.fetch({ fields: ['name'] })
```
All models can be fetched using the `fetchAll` method
```javascript
const allModels = MyModel.fetchAll()
```
All element of an association can also be fetched using `fetch`
```javascript
const myModel = new MyModel({id: 1})
myModel.fetch()
myModel.associations.phoneNumber.fetch()
```
### Model saving
Models can then be saved to the server using the `save` method. Calls only occur if the model has changed. 
The `save` method returns a promise which resolves when the save is done. 
Once the model is saved, `changes` are reset.
```javascript
const myModel = new MyModel({id: 1})
myModel.fetch()
myModel.name = 'Fredi'
myModel.hasChanged // true
myModel.save()
myModel.hasChanged // false
```
#### Association saving
To save associations with the model, the `save` method can be overloaded in the model.
```javascript
import Base from '../../core/models/base';
import Friend from './friend;

class MyModel extends Base {
  static associations() {
    return {
      friends: {
        class: Friends,
        type: 'hasMany',
      },
    };
  }

  save() {
    const friendIds = this.associations.friends.value.map((friend) => friend.id)
    return super.save({ friendIds }).then(() => {
      this.associations.friends.setPristine();
    });
  }
}
```
