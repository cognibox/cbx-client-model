import Model from './model.js';
import HttpMixin from './mixins/http.js';
import ValidationMixin from './mixins/validation.js';
import { Association, BelongsTo, HasMany, HasOne } from './association.js';
import Attribute from './attribute.js';
import ValidationFieldMixin from './field-mixins/validation.js';
import HttpFieldMixin from './field-mixins/http.js';

class CbxModel extends ValidationMixin(HttpMixin(Model)) {}
class CbxAttribute extends HttpFieldMixin(ValidationFieldMixin(Attribute)) {}
class CbxAssociation extends HttpFieldMixin(ValidationFieldMixin(Association)) {}
class CbxBelongsTo extends HttpFieldMixin(ValidationFieldMixin(BelongsTo)) {}
class CbxHasMany extends HttpFieldMixin(ValidationFieldMixin(HasMany)) {}
class CbxHasOne extends HttpFieldMixin(ValidationFieldMixin(HasOne)) {}

export {
  CbxAssociation as Association,
  CbxAttribute as Attribute,
  CbxBelongsTo as BelongsTo,
  CbxHasMany as HasMany,
  CbxHasOne as HasOne,
  CbxModel as Model,
};
