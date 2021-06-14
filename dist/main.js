"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = exports.HasOne = exports.HasMany = exports.BelongsTo = exports.Attribute = exports.Association = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _model = _interopRequireDefault(require("./model.js"));

var _http = _interopRequireDefault(require("./mixins/http.js"));

var _validation = _interopRequireDefault(require("./mixins/validation.js"));

var _association = require("./association.js");

var _attribute = _interopRequireDefault(require("./attribute.js"));

var _validation2 = _interopRequireDefault(require("./field-mixins/validation.js"));

var _hasmanyHttp = _interopRequireDefault(require("./field-mixins/hasmany-http.js"));

var _http2 = _interopRequireDefault(require("./field-mixins/http.js"));

var _attributeHttp = _interopRequireDefault(require("./field-mixins/attribute-http.js"));

var CbxModel =
/*#__PURE__*/
function (_ValidationMixin) {
  (0, _inherits2["default"])(CbxModel, _ValidationMixin);

  function CbxModel() {
    (0, _classCallCheck2["default"])(this, CbxModel);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CbxModel).apply(this, arguments));
  }

  return CbxModel;
}((0, _validation["default"])((0, _http["default"])(_model["default"])));

exports.Model = CbxModel;

var CbxAttribute =
/*#__PURE__*/
function (_AttributeHttpFieldMi) {
  (0, _inherits2["default"])(CbxAttribute, _AttributeHttpFieldMi);

  function CbxAttribute() {
    (0, _classCallCheck2["default"])(this, CbxAttribute);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CbxAttribute).apply(this, arguments));
  }

  return CbxAttribute;
}((0, _attributeHttp["default"])((0, _validation2["default"])(_attribute["default"])));

exports.Attribute = CbxAttribute;

var CbxAssociation =
/*#__PURE__*/
function (_HttpFieldMixin) {
  (0, _inherits2["default"])(CbxAssociation, _HttpFieldMixin);

  function CbxAssociation() {
    (0, _classCallCheck2["default"])(this, CbxAssociation);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CbxAssociation).apply(this, arguments));
  }

  return CbxAssociation;
}((0, _http2["default"])((0, _validation2["default"])(_association.Association)));

exports.Association = CbxAssociation;

var CbxBelongsTo =
/*#__PURE__*/
function (_HttpFieldMixin2) {
  (0, _inherits2["default"])(CbxBelongsTo, _HttpFieldMixin2);

  function CbxBelongsTo() {
    (0, _classCallCheck2["default"])(this, CbxBelongsTo);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CbxBelongsTo).apply(this, arguments));
  }

  return CbxBelongsTo;
}((0, _http2["default"])((0, _validation2["default"])(_association.BelongsTo)));

exports.BelongsTo = CbxBelongsTo;

var CbxHasMany =
/*#__PURE__*/
function (_HasManyHttpFieldMixi) {
  (0, _inherits2["default"])(CbxHasMany, _HasManyHttpFieldMixi);

  function CbxHasMany() {
    (0, _classCallCheck2["default"])(this, CbxHasMany);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CbxHasMany).apply(this, arguments));
  }

  return CbxHasMany;
}((0, _hasmanyHttp["default"])((0, _validation2["default"])(_association.HasMany)));

exports.HasMany = CbxHasMany;

var CbxHasOne =
/*#__PURE__*/
function (_HttpFieldMixin3) {
  (0, _inherits2["default"])(CbxHasOne, _HttpFieldMixin3);

  function CbxHasOne() {
    (0, _classCallCheck2["default"])(this, CbxHasOne);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CbxHasOne).apply(this, arguments));
  }

  return CbxHasOne;
}((0, _http2["default"])((0, _validation2["default"])(_association.HasOne)));

exports.HasOne = CbxHasOne;