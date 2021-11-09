"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default(target) {
  var _this = this;

  var eventCallbacks = {};

  target.on = function (eventType, callback) {
    eventCallbacks[eventType] = eventCallbacks[eventType] || [];
    eventCallbacks[eventType].push(callback);
  };

  target.trigger = function (eventType) {
    for (var _len = arguments.length, options = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      options[_key - 1] = arguments[_key];
    }

    if (!eventCallbacks[eventType]) return;
    eventCallbacks[eventType].forEach(function (callback) {
      return callback.call.apply(callback, [_this].concat(options));
    });
  };
}