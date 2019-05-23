"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _axios = _interopRequireDefault(require("axios"));

var mixin = function mixin(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(_class, _superclass);

      function _class() {
        var _getPrototypeOf2;

        var _this;

        (0, _classCallCheck2["default"])(this, _class);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(_class)).call.apply(_getPrototypeOf2, [this].concat(args)));
        _this.baseUrl = _this.constructorOptions.baseUrl;
        return _this;
      }

      (0, _createClass2["default"])(_class, [{
        key: "fetch",
        value: function fetch() {
          var _this2 = this;

          return _axios["default"].get(this.url()).then(function (resp) {
            _this2.value = resp.data;
            return resp;
          });
        }
      }, {
        key: "url",
        value: function url() {
          return "".concat(this.baseUrl, "/").concat(this.modelClass().urlResource());
        }
      }]);
      return _class;
    }(superclass)
  );
};

var _default = mixin;
exports["default"] = _default;