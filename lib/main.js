import Model from './model.js';
import HttpMixin from './mixins/http.js';
import ValidationMixin from './mixins/validation.js';
import { hasOne, hasMany, belongsTo } from './field-mixins/http';

export default class CbxClientModel extends ValidationMixin(HttpMixin(Model)) {}

export { Model };
export { HttpMixin };
export { ValidationMixin };
export { hasOne, hasMany, belongsTo };
