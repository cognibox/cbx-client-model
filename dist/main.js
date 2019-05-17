"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _baseModel = _interopRequireDefault(require("./base-model.js"));

var _http = _interopRequireDefault(require("./mixins/http.js"));

var _validation = _interopRequireDefault(require("./mixins/validation.js"));

var Model =
/*#__PURE__*/
function (_ValidationMixin) {
  (0, _inherits2["default"])(Model, _ValidationMixin);

  function Model() {
    (0, _classCallCheck2["default"])(this, Model);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Model).apply(this, arguments));
  }

  return Model;
}((0, _validation["default"])((0, _http["default"])(_baseModel["default"])));

var _default = Model;
exports["default"] = _default;