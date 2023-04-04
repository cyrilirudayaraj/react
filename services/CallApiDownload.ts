import axios from 'axios';

export function CallApiDownload(uri: string, data?: any): any {
  const formData = new FormData();
  formData.append('UTF8', 'true');
  formData.append('operation', 'Download');
  if (data) {
    formData.append('INPUTJSON', JSON.stringify(data));
  }
  const url = process.env.REACT_APP_BASE_URL + uri;
  const config = {
    withCredentials: true,
    isMainThread: data ? true : void 0,
  };
  return axios
    .post(url, formData, config)
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename =
        response.headers['content-disposition'].split('=')[1] || 'file.csv';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    })
    .catch(function (error) {
      if (!error.response) {
        return Promise.reject({ message: error.message.toString() });
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
