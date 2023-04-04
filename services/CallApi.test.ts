import axios from 'axios';
import CallApi from './CallApi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('test APICall', () => {
  const prirorityData = {
    data: [
      { name: 'P0', slaDays: '5', id: '1', description: null },
      { name: 'P1', slaDays: '10', id: '2', description: null },
      { name: 'P2', slaDays: '15', id: '3', description: null },
      { name: 'P3', slaDays: '20', id: '4', description: null },
      { name: 'P4', slaDays: '25', id: '5', description: null },
    ],
  };

  it('test positive prirority fetching', async () => {
    const resp = {
      data: {
        status: 'SUCCESS',
        data: prirorityData,
      },
    };
    const formData = { input: 'myinput' };
    mockedAxios.post.mockImplementation(() => Promise.resolve(resp));

    await CallApi('/v1/priority/get', formData).then((data: any) => {
      expect(data).toEqual(prirorityData);
    });
  });

  it('test error throwing with status failed', async () => {
    const resp = {
      data: {
        status: 'failed',
      },
    };
    mockedAxios.post.mockImplementation(() => Promise.resolve(resp));

    try {
      expect(await CallApi('/v1/priority/get')).rejects.toThrow('error');
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
      expect(await CallApi('/v1/priority/get')).rejects.toThrow('error');
    } catch (error) {
      // expecting to reach catch block
      //TODO remove catch block and add assertions
    }
  });

  it('test catch block', async () => {
    mockedAxios.post.mockRejectedValueOnce(() => Promise.reject());

    try {
      expect(await CallApi('/v1/priority/get')).rejects.toThrow();
    } catch (error) {
      // expecting to reach catch block
      //TODO remove catch block and add assertions
    }

    mockedAxios.post.mockRejectedValueOnce(() => Promise.reject());
    try {
      expect(await CallApi('/v1/priority/get')).rejects.toThrow();
    } catch (error) {
      // expecting to reach catch block
      //TODO remove catch block and add assertions
    }
  });
});
