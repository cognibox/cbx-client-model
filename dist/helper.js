"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nullToUndefined = nullToUndefined;
exports.parseHttpListResponse = parseHttpListResponse;
exports.sync = sync;

var _axios = _interopRequireDefault(require("axios"));

function nullToUndefined(obj) {
  var rtn = {};
  if (obj === null || obj === undefined) return rtn;
  Object.keys(obj).forEach(function (key) {
    if (obj[key] === null) {
      rtn[key] = undefined;
    } else if (obj[key] instanceof Array) {
      rtn[key] = obj[key].map(function (item) {
        return nullToUndefined(item);
      });
    } else if (obj[key] instanceof Object) {
      rtn[key] = nullToUndefined(obj[key]);
    } else {
      rtn[key] = obj[key];
    }
  });
  return rtn;
}

function parseHttpListResponse(resp, Model) {
  var result = {
    raw: resp.data
  };
  var data = Array.isArray(resp.data) ? resp.data : resp.data.data;
  result.data = data.map(function (item) {
    return new Model(nullToUndefined(item));
  });
  return result;
}

function sync(_ref) {
  var method = _ref.method,
      url = _ref.url,
      options = _ref.options;
  return _axios["default"][method](url, options);
}