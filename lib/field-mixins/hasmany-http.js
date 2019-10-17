import { sync, parseHttpListResponse } from '../helper';
import http from './http';

export default (superclass) => class extends http(superclass) {
  fetch({ url, options = {} } = {}) {
    url = url || this.url();

    return sync({ method: 'get', url, options }).then((resp) => {
      const result = parseHttpListResponse(resp, this.ModelClass);

      this.value = result.data

      this.setPristine();

      return result;
    });
  }
};
