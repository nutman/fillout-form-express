require('dotenv').config()

const request = require('supertest');
const axios = require('axios');
const app = require('./app');
const {responseMock, oneQuestionMock} = require("./mocks/response.mock");
const filters = require("./mocks/filters.mock");
jest.mock('axios');

describe('GET /', () => {
  it('should respond with data from the API if no filters were provided', async () => {
    // Mock Axios response
    const responseData = responseMock;
    axios.get.mockResolvedValue({ data: responseData });

    // Make request to Express server
    const response = await request(app).get('/');

    // Assert response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(responseData);
  });

  it('should respond with data from the API if no filters were provided and some Fillout filters applied', async () => {
    const responseData = responseMock;
    const getSpy = jest.spyOn(axios, 'get').mockImplementationOnce(() => {
      return {
        data: responseData
      }
    });
    getSpy.mockClear()

    // Make request to Express server
    const response = await request(app).get('/?limit=1&filters=[]');

    // Assert response
    expect(response.status).toBe(200);
    expect(getSpy).toHaveBeenCalledWith(`https://api.fillout.com/v1/api/forms/${process.env.FORM_ID}/submissions?limit=1`,
      {headers: {Authorization: `Bearer ${process.env.API_KEY}`}});
  });

  it('should respond with filtered data from the API if filters were provided', async () => {
    // Mock Axios response
    axios.get.mockResolvedValue({ data: responseMock });

    // Make request to Express server
    const response = await request(app).get(`/?${new URLSearchParams({filters}).toString()}`);

    // Assert response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(oneQuestionMock);
  });
});
