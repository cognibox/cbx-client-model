"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _attribute = _interopRequireDefault(require("./attribute"));

var _association = _interopRequireDefault(require("./association"));

var _lodash = require("lodash");

var Model =
/*#__PURE__*/
function () {
  (0, _createClass2["default"])(Model, null, [{
    key: "associationClass",
    value: function associationClass() {
      return _association["default"];
    }
  }, {
    key: "associations",
    value: function associations() {
      return {};
    }
  }, {
    key: "attributeClass",
    value: function attributeClass() {
      return _attribute["default"];
    }
  }, {
    key: "attributes",
    value: function attributes() {
      return {};
    }
  }, {
    key: "findPrimaryKey",
    value: function findPrimaryKey() {
      var attributes = this.attributes();
      return Object.keys(attributes).find(function (key) {
        return attributes[key].primary;
      });
    }
  }, {
    key: "getPrimaryKey",
    value: function getPrimaryKey() {
      this._primaryKey = this._primaryKey || this.findPrimaryKey() || 'id';
      return this._primaryKey;
    }
  }]);

  function Model(properties) {
    (0, _classCallCheck2["default"])(this, Model);
    properties = this.parse(properties);
    this.attributes = attributeBuilderFactory('attribute').call(this, {
      properties: properties.attributes
    });
    this.associations = attributeBuilderFactory('association').call(this, {
      properties: properties.associations
    });
    buildChanges.call(this);
  }

  (0, _createClass2["default"])(Model, [{
    key: "associationArguments",
    value: function associationArguments() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _attributeArguments.call.apply(_attributeArguments, [this].concat(args));
    }
  }, {
    key: "attributeArguments",
    value: function attributeArguments() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _attributeArguments.call.apply(_attributeArguments, [this].concat(args));
    }
  }, {
    key: "parse",
    value: function parse(properties) {
      var associationDefinitions = this.constructor.associations();
      var attributeDefinitions = this.constructor.attributes();
      var associations = {};
      var attributes = {};
      (0, _lodash.forEach)(properties, function (value, key) {
        if (associationDefinitions[key]) {
          associations[key] = value;
        } else if (attributeDefinitions[key]) {
          attributes[key] = value;
        }
      });
      return {
        associations: this.parseAssociations(associations),
        attributes: this.parseAttributes(attributes)
      };
    }
  }, {
    key: "parseAssociations",
    value: function parseAssociations(properties) {
      return properties;
    }
  }, {
    key: "parseAttributes",
    value: function parseAttributes(properties) {
      return properties;
    }
  }, {
    key: "calculateChanges",
    value: function calculateChanges(attributeKeys) {
      var _this = this;

      attributeKeys = attributeKeys || Object.keys(this.attributes);
      attributeKeys.forEach(function (attributeKey) {
        var attribute = _this.attributes[attributeKey];

        if (attribute.hasChanged) {
          _this.isDirty = true;
          _this.changes[attributeKey] = {
            newValue: attribute.value,
            oldValue: attribute.originalValue
          };
        } else {
          delete _this.changes[attributeKey];
        }

        _this.hasChanged = _this.computeHasChanged();
      });
    }
  }, {
    key: "computeHasChanged",
    value: function computeHasChanged() {
      return Object.keys(this.changes).length > 0;
    }
  }, {
    key: "set",
    value: function set(properties) {
      var _this2 = this;

      properties = this.parse(properties);
      (0, _lodash.forEach)(properties.attributes, function (value, key) {
        if (!_this2.attributes[key]) return;
        _this2.attributes[key].value = value;
      });
      (0, _lodash.forEach)(properties.associations, function (value, key) {
        if (!_this2.associations[key]) return;
        _this2.associations[key].value = value;
      });
    }
  }, {
    key: "setChanges",
    value: function setChanges(value) {
      this.changes = value;
      this.hasChanged = this.computeHasChanged();
    }
  }, {
    key: "setPristine",
    value: function setPristine() {
      (0, _lodash.forEach)(this.attributes, function (value) {
        value.setPristine();
      });
      this.setChanges({});
    }
  }]);
  return Model;
}();

var _default = Model; ////////////////

exports["default"] = _default;

function _attributeArguments() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      value = _ref.value,
      _ref$definition = _ref.definition,
      definition = _ref$definition === void 0 ? {} : _ref$definition;

  var args = {
    model: this
  };
  Object.keys(definition).forEach(function (definitionKey) {
    if (definitionKey !== 'default') args[definitionKey] = definition[definitionKey];
  });
  args.value = value;
  return args;
}

function attributeBuilderFactory(type) {
  var pluralType = "".concat(type, "s");
  return function () {
    var _this3 = this;

    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$properties = _ref2.properties,
        properties = _ref2$properties === void 0 ? {} : _ref2$properties;

    var definitions = this.constructor[pluralType]();
    var AttributeClass = this.constructor["".concat(type, "Class")]();
    var attributes = {};
    var keys = Object.keys(definitions);
    keys.forEach(function (attributeName) {
      var definition = definitions[attributeName];

      var args = _this3["".concat(type, "Arguments")]({
        definition: definition,
        value: attributeName in properties ? properties[attributeName] : definition["default"]
      });

      definition.mixins = definition.mixins || [];
      var NewAttributeClass = definition.mixins.reduce(function (superClass, mixin) {
        return mixin(superClass);
      }, AttributeClass);
      var attribute = new NewAttributeClass(args);
      attributes[attributeName] = attribute;
    });
    return attributes;
  };
}

function buildChanges() {
  var _this4 = this;

  var attributes = this.attributes;
  this.hasChanged = false;
  this.changes = {};
  Object.keys(attributes).forEach(function (key) {
    var attribute = attributes[key];
    attribute.on('change', function () {
      _this4.calculateChanges([key]);
    });
  });
}