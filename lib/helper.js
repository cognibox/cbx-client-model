import axios from 'axios';

export function nullToUndefined(obj) {
  if (obj === null) return undefined;
  if (!(obj instanceof Object)) return obj;

  const rtn = {};

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

export function parseHttpListResponse(resp, Model) {
  const result = { raw: resp.data };
  const data = Array.isArray(resp.data) ? resp.data : resp.data.data;

  result.data = data.map((item) => {
    return new (Model)(nullToUndefined(item));
  });

  return result;
}

export function sync({ method, url, options }) {
  return axios[method](url, options);
}
