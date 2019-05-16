import BaseModel from './base-model.js';
import HttpMixin from './mixins/http.js';
import ValidationMixin from './mixins/validation.js';

class Model extends ValidationMixin(HttpMixin(BaseModel)) {
}

export default Model;
