"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _attribute = _interopRequireDefault(require("./attribute"));

var _lodash = require("lodash");

var BaseModel =
/*#__PURE__*/
function () {
  (0, _createClass2["default"])(BaseModel, null, [{
    key: "attributeClass",
    value: function attributeClass() {
      return _attribute["default"];
    }
  }, {
    key: "attributes",
    value: function attributes() {
      return {};
    }
  }]);

  function BaseModel(properties) {
    (0, _classCallCheck2["default"])(this, BaseModel);
    properties = this.parse(properties);
    var attributesDefinition = this.constructor.attributes();
    defineModelAttributes.call(this, {
      definitions: attributesDefinition,
      properties: properties
    });
    buildChanges.call(this);
  }

  (0, _createClass2["default"])(BaseModel, [{
    key: "parse",
    value: function parse(properties) {
      return properties;
    }
  }, {
    key: "set",
    value: function set(properties) {
      var _this = this;

      properties = this.parse(properties);
      (0, _lodash.forEach)(properties, function (value, key) {
        if (!_this.attributes[key]) return;
        _this.attributes[key].value = value;
      });
    }
  }, {
    key: "setPristine",
    value: function setPristine() {
      (0, _lodash.forEach)(this.attributes, function (value) {
        value.setPristine();
      });

      this._setChanges({});
    }
  }]);
  return BaseModel;
}();

var _default = BaseModel; ////////////////

exports["default"] = _default;

function buildAttributes() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$definitions = _ref.definitions,
      definitions = _ref$definitions === void 0 ? {} : _ref$definitions,
      _ref$properties = _ref.properties,
      properties = _ref$properties === void 0 ? {} : _ref$properties;

  var AttributeClass = this.constructor.attributeClass();
  var attributes = {};
  var keys = Object.keys(definitions);
  keys.forEach(function (attributeName) {
    var definition = definitions[attributeName];
    var attributeArguments = {};
    Object.keys(definition).forEach(function (definitionKey) {
      if (definitionKey !== 'default') attributeArguments[definitionKey] = definition[definitionKey];
    });
    attributeArguments.value = attributeName in properties ? properties[attributeName] : definition["default"];
    var attribute = new AttributeClass(attributeArguments);
    attributes[attributeName] = attribute;
  });
  return attributes;
}

function buildChanges() {
  var _this2 = this;

  var attributes = this.attributes;
  this.hasChanged = false;
  this.changes = {};

  this._setChanges = function (value) {
    _this2.changes = value;
    _this2.hasChanged = !Object.keys(value);
  };

  Object.keys(attributes).forEach(function (key) {
    var attribute = attributes[key];
    attribute.on('change', function () {
      if (attribute.hasChanged) {
        _this2.isDirty = true;
        _this2.changes[key] = {
          newValue: attribute.value,
          oldValue: attribute.getOriginalValue()
        };
      } else {
        delete _this2.changes[key];
      }

      _this2.hasChanged = computeHasChanged.call(_this2, _this2.changes);
    });
  });
}

function computeHasChanged(changes) {
  return Object.keys(changes).length > 0;
}

function defineModelAttributes() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$definitions = _ref2.definitions,
      definitions = _ref2$definitions === void 0 ? {} : _ref2$definitions,
      _ref2$properties = _ref2.properties,
      properties = _ref2$properties === void 0 ? {} : _ref2$properties;

  var attributes = buildAttributes.call(this, {
    definitions: definitions,
    properties: properties
  });
  this.attributes = attributes;
}