"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _validation = _interopRequireDefault(require("../attribute-mixins/validation.js"));

var ValidationMixin = function ValidationMixin(superclass) {
  var AttributeWithValidation =
  /*#__PURE__*/
  function (_AttributeValidationM) {
    (0, _inherits2["default"])(AttributeWithValidation, _AttributeValidationM);

    function AttributeWithValidation() {
      (0, _classCallCheck2["default"])(this, AttributeWithValidation);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf3["default"])(AttributeWithValidation).apply(this, arguments));
    }

    return AttributeWithValidation;
  }((0, _validation["default"])(superclass.attributeClass()));

  var AssociationWithValidation =
  /*#__PURE__*/
  function (_AttributeValidationM2) {
    (0, _inherits2["default"])(AssociationWithValidation, _AttributeValidationM2);

    function AssociationWithValidation() {
      (0, _classCallCheck2["default"])(this, AssociationWithValidation);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf3["default"])(AssociationWithValidation).apply(this, arguments));
    }

    return AssociationWithValidation;
  }((0, _validation["default"])(superclass.associationClass()));

  return (
    /*#__PURE__*/
    function (_superclass) {
      (0, _inherits2["default"])(_class, _superclass);
      (0, _createClass2["default"])(_class, null, [{
        key: "attributeClass",
        value: function attributeClass() {
          return AttributeWithValidation;
        }
      }, {
        key: "associationClass",
        value: function associationClass() {
          return AssociationWithValidation;
        }
      }]);

      function _class() {
        var _getPrototypeOf2;

        var _this;

        (0, _classCallCheck2["default"])(this, _class);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(_class)).call.apply(_getPrototypeOf2, [this].concat(args)));
        var isValid = true;
        var errors = {};
        Object.keys(_this.attributes).forEach(function (key) {
          var attribute = _this.attributes[key];
          attribute.on('validate', function () {
            if (attribute.isValid) {
              delete errors[key];
            } else {
              errors[key] = attribute.errors;
            }

            isValid = !Object.keys(errors).length;
          });
        });
        Object.defineProperty((0, _assertThisInitialized2["default"])(_this), 'isValid', {
          enumerable: true,
          get: function get() {
            return isValid;
          },
          set: function set() {
            console.error('[vueModel][ValidationMixin] isValid assignation not allowed');
          }
        });
        Object.defineProperty((0, _assertThisInitialized2["default"])(_this), 'errors', {
          enumerable: true,
          get: function get() {
            return errors;
          },
          set: function set() {
            console.error('[vueModel][ValidationMixin] errors assignation not allowed');
          }
        });
        return _this;
      }

      (0, _createClass2["default"])(_class, [{
        key: "validate",
        value: function validate() {
          var _this2 = this;

          Object.keys(this.attributes).forEach(function (key) {
            _this2.attributes[key].validate();
          });
        }
      }]);
      return _class;
    }(superclass)
  );
};

var _default = ValidationMixin;
exports["default"] = _default;