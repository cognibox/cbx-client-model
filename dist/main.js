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

var _model = _interopRequireDefault(require("./model.js"));

var _http = _interopRequireDefault(require("./mixins/http.js"));

var _validation = _interopRequireDefault(require("./mixins/validation.js"));

var CbxClientModel =
/*#__PURE__*/
function (_ValidationMixin) {
  (0, _inherits2["default"])(CbxClientModel, _ValidationMixin);

  function CbxClientModel() {
    (0, _classCallCheck2["default"])(this, CbxClientModel);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CbxClientModel).apply(this, arguments));
  }

  return CbxClientModel;
}((0, _validation["default"])((0, _http["default"])(_model["default"])));

var _default = CbxClientModel;
exports["default"] = _default;