"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _default = function _default(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(_class, _superclass);

      function _class() {
        var _this;

        var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck2["default"])(this, _class);
        var validations = properties.validations,
            autoValidate = properties.autoValidate;
        _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_class).call(this, properties));
        _this.errors = {};
        _this.isValid = true;
        _this.validations = validations || {};

        if (autoValidate !== false) {
          _this.on('change', function () {
            _this.validate();
          });

          _this.validate();
        }

        return _this;
      }

      (0, _createClass2["default"])(_class, [{
        key: "validate",
        value: function validate() {
          this.errors = this.validateAllDry();
          this.isValid = !Object.keys(this.errors).length;
          this.trigger('validate');
          return this.errors;
        }
      }, {
        key: "validateAllDry",
        value: function validateAllDry() {
          var _this2 = this;

          var errors = {};
          if (this.validations === undefined) return errors;
          Object.keys(this.validations).forEach(function (validationKey) {
            var validationResult = _this2.validations[validationKey].call(_this2, _this2.value);

            if (validationResult !== true) {
              errors[validationKey] = validationResult;
            }
          });
          return errors;
        }
      }]);
      return _class;
    }(superclass)
  );
};

exports["default"] = _default;