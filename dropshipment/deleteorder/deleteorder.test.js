const { deleteOrder } = require('./deleteorder');
const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT } = require('../../config');
const { sign } = require('../../signature/getnonce/getnonce');

const axios = require('axios');

jest.mock("axios");

describe('dropshipment', function() {
  it('should update order', async () => {
    jest.clearAllMocks();
    axios.post.mockResolvedValueOnce({
      data: {
        status: 0,
        body: {}
      }
    })

    const response = await deleteOrder('nonce', "orderid");
    expect(response).toStrictEqual(true);
    const expectedURL = `${API_ENDPOINT}v2/dropshipment`;
    const expectedParameters = {
      action: 'delete',
      client_id: CLIENT_ID,
      nonce: 'nonce',
      order_id: 'orderid',
    };
    expectedParameters.signature = sign(expectedParameters, CLIENT_SECRET);
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParameters);
  });
});