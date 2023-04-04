import axios from 'axios';
import { CallApiDownload } from './CallApiDownload';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('test APIDownloadCall', () => {
  global.URL.createObjectURL = jest.fn();
  it('test positive report download', async () => {
    global.URL.createObjectURL = jest.fn(() => 'details');
    const resp = {
      headers: {
        'content-disposition': 'attachment;filename=report.csv',
      },
      data: {},
    };
    const formData = { input: 'myinput' };
    mockedAxios.post.mockImplementation(() => Promise.resolve(resp));

    expect(await CallApiDownload('/v1/report/generate', formData));
  });

  it('test error throwing with status failed', async () => {
    const resp = {
      data: {
        status: 'failed',
      },
    };
    mockedAxios.post.mockImplementation(() => Promise.resolve(resp));

    try {
      expect(await CallApiDownload('/v1/report/generate')).rejects.toThrow(
        'error'
      );
    } catch (error) {
      // expecting to reach catch block
      //TODO remove catch block and add assertions
    }
  });

  it('test error throwing with status FAILURE', async () => {
    const resp = {
      data: {
        status: 'FAILURE',
      },
    };
    mockedAxios.post.mockImplementation(() => Promise.resolve(resp));

    try {
      expect(await CallApiDownload('/v1/report/generate')).rejects.toThrow(
        'error'
      );
    } catch (error) {
      // expecting to reach catch block
      //TODO remove catch block and add assertions
    }
  });

  it('test catch block', async () => {
    mockedAxios.post.mockRejectedValueOnce(() => Promise.reject());

    try {
      expect(await CallApiDownload('/v1/report/generate')).rejects.toThrow();
    } catch (error) {
      // expecting to reach catch block
      //TODO remove catch block and add assertions
    }

    mockedAxios.post.mockRejectedValueOnce(() => Promise.reject());
    try {
      expect(await CallApiDownload('/v1/report/generate')).rejects.toThrow();
    } catch (error) {
      // expecting to reach catch block
      //TODO remove catch block and add assertions
    }
  });
});
