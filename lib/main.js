import Model from './model.js';
import HttpMixin from './mixins/http.js';
import ValidationMixin from './mixins/validation.js';

class CbxClientModel extends ValidationMixin(HttpMixin(Model)) {
}

export default CbxClientModel;
