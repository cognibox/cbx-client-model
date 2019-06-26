"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = require("lodash");

var Validator =
/*#__PURE__*/
function () {
  function Validator() {
    (0, _classCallCheck2["default"])(this, Validator);
  }

  (0, _createClass2["default"])(Validator, null, [{
    key: "required",
    value: function required(value) {
      return value !== undefined;
    }
  }]);
  return Validator;
}();

var AttributeValidationMixin = function AttributeValidationMixin(superclass) {
  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(_class, _superclass);
      (0, _createClass2["default"])(_class, null, [{
        key: "validatorClass",
        value: function validatorClass() {
          return Validator;
        }
      }]);

      function _class(properties) {
        var _this;

        (0, _classCallCheck2["default"])(this, _class);
        var validations = properties.validations,
            autoValidate = properties.autoValidate,
            model = properties.model;
        _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_class).call(this, properties));
        _this.errors = {};
        _this.isValid = true;
        _this.model = model;
        _this.validations = validations;

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
        key: "validateOneDry",
        value: function validateOneDry(validationKey) {
          var validationValue = (0, _lodash.result)(this.validations, validationKey);
          var validator = this.constructor.validatorClass();

          if (validator[validationKey]) {
            return validator[validationKey].call(this.model, this.value, validationValue);
          }

          return true;
        }
      }, {
        key: "validateAllDry",
        value: function validateAllDry() {
          var _this2 = this;

          var errors = {};
          var validationKeys = this.validations ? Object.keys(this.validations) : [];

          if (this.validations && validationKeys.length) {
            var required = this.validateOneDry('required');

            if (!required) {
              if (this.validations.required) errors.required = required;
            } else {
              var keysToValidate = validationKeys.filter(function (key) {
                return key !== 'required';
              });
              keysToValidate.forEach(function (key) {
                var validateResult = _this2.validateOneDry(key);

                if (validateResult !== true) {
                  errors[key] = validateResult;
                }
              });
            }
          }

          return errors;
        }
      }]);
      return _class;
    }(superclass)
  );
};

var _default = AttributeValidationMixin;
exports["default"] = _default;