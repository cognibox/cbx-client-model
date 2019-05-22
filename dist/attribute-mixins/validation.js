"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

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
            autoValidate = properties.autoValidate;
        _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_class).call(this, properties));
        buildValidation.call((0, _assertThisInitialized2["default"])(_this), validations);

        if (autoValidate !== false) {
          _this.on('change', function () {
            _this.validate();
          });

          _this.validate();
        }

        return _this;
      }

      (0, _createClass2["default"])(_class, [{
        key: "ValidateOneDry",
        value: function ValidateOneDry(validationKey) {
          var validationValue = (0, _lodash.result)(this.validations, validationKey);
          var validator = this.constructor.validatorClass();

          if (validator[validationKey]) {
            return validator[validationKey](this.value, validationValue);
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
            var required = this.ValidateOneDry('required');

            if (!required) {
              if (this.validations.required) errors.required = required;
            } else {
              var keysToValidate = validationKeys.filter(function (key) {
                return key !== 'required';
              });
              keysToValidate.forEach(function (key) {
                var validateResult = _this2.ValidateOneDry(key);

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

var _default = AttributeValidationMixin; ////////////////

exports["default"] = _default;

function buildValidation(validations) {
  var _this3 = this;

  Object.defineProperty(this, 'validations', {
    enumerable: true,
    get: function get() {
      return validations;
    },
    set: function set() {
      console.error('[vueModel][AttributeValidationMixin] validations assignation not allowed');
    }
  });
  var isValid = true;
  var errors = {};

  this.validate = function () {
    errors = _this3.validateAllDry();
    isValid = !Object.keys(errors).length;

    _this3.trigger('validate');

    return errors;
  };

  Object.defineProperty(this, 'isValid', {
    enumerable: true,
    get: function get() {
      return isValid;
    },
    set: function set() {
      console.error('[vueModel][AttributeValidationMixin] isValid assignation not allowed');
    }
  });
  Object.defineProperty(this, 'errors', {
    enumerable: true,
    get: function get() {
      return errors;
    },
    set: function set() {
      console.error('[vueModel][AttributeValidationMixin] errors assignation not allowed');
    }
  });
}