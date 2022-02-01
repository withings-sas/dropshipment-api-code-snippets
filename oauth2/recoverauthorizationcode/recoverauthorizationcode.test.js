const { recoverAuthorizationCode } = require('./recoverauthorizationcode');
const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT } = require('../../config');
const { sign } = require('../../signature/getnonce/getnonce');
const axios = require('axios');


jest.mock("axios");

describe('oauth2', function() {
  it('should recover authorization code', async () => {
    jest.clearAllMocks();
    axios.post.mockResolvedValueOnce({
      data: {
        status: 0,
        body: {
          user: {
            code: 'new_authorization_code'
          }
        }
      }
    });

    const response = await recoverAuthorizationCode("nonce", "john.doe@example.com");

    expect(response).toBe("new_authorization_code");
    const expectedURL = `${API_ENDPOINT}v2/oauth2`;
    const expectedParams = {
      action: 'recoverauthorizationcode',
      client_id: CLIENT_ID,
      email: 'john.doe@example.com',
      nonce: 'nonce',
    };
    expectedParams.signature = sign(expectedParams, CLIENT_SECRET);
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParams);
  });
});