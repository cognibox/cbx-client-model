import axios from 'axios';

export function nullToUndefined(obj) {
  var rtn = {};
  if (obj === null || obj === undefined) return rtn;
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null) {
      rtn[key] = undefined;
    } else if (obj[key] instanceof Array) {
      rtn[key] = obj[key].map((item) => {
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

export function parseHttpListResponse(resp, model) {
  const result = { raw: resp.data };
  const data = Array.isArray(resp.data) ? resp.data : resp.data.data;

  result.data = data.map((item) => {
    return new (model)(nullToUndefined(item));
  });

  return result;
}

export function sync({ method, url, options }) {
  return axios[method](url, options);
}
