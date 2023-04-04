import axios from 'axios';

function CallApi(uri: string, data?: any, config: any = {}, file?: File): any {
  const formData = new FormData();
  formData.append('UTF8', 'true');
  if (data) {
    formData.append('INPUTJSON', JSON.stringify(data));
  }

  if (file instanceof File) {
    formData.append('FILE', file);
  }
  const url = process.env.REACT_APP_BASE_URL + uri;
  const { isAsync } = config;
  config = {
    withCredentials: true,
    isMainThread: !isAsync && data ? true : void 0,
    showError: true,
    ...config,
  };
  return axios
    .post(url, formData, config)
    .then((response) => {
      if (response?.data.status === 'SUCCESS') return response.data.data;
      throw response;
    })
    .catch(function (error) {
      if (!error.response) {
        if (!error.message && error.data && error.data.indexOf('login')) {
          window.location.href = '/';
          return Promise.reject({ message: 'Session Expired' });
        } else {
          return Promise.reject({ message: error.message?.toString() });
        }
      } else if (!error.response.data.error) {
        return Promise.reject({ message: error.response.data });
      } else {
        return Promise.reject(error.response.data.error);
      }
    })
    .catch(function (error) {
      return Promise.reject(error);
    });
}

export default CallApi;
