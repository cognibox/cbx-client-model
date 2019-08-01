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

var _field = _interopRequireDefault(require("./field.js"));

var Attribute =
/*#__PURE__*/
function (_Field) {
  (0, _inherits2["default"])(Attribute, _Field);

  function Attribute() {
    (0, _classCallCheck2["default"])(this, Attribute);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Attribute).apply(this, arguments));
  }

  return Attribute;
}(_field["default"]);

exports["default"] = Attribute;