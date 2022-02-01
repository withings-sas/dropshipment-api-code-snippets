const { sign, getNonce, CLIENT_ID, CLIENT_SECRET } = require("./getnonce");
const axios  = require('axios');
const {API_ENDPOINT} = require("../../config");

jest.mock("axios");

describe('signature', function () {
  it('should provide correct signature with timestamp', () => {
    const params = {
      action: 'getnonce',
      timestamp: 1637090717,
      client_id: 'client_id'
    };
    const signature = sign(params, "clientsecret");
    expect(signature).toBe("613fa7b29b5c3a14ca7759886e9783750e057caba3e8e601495d5b470a30d1ac");
  });

  it('should provide correct signature with nonce', () => {
    const params = {
      action: 'wsname',
      nonce: 'nonce',
      client_id: 'client_id'
    };
    const signature = sign(params, "clientsecret");
    expect(signature).toBe("ccb346f0416f06fb4b36d95ca75082098eaf2a8bc885506c689312806afa5b2b");
  });
});

describe('getnonce', function() {
  jest.clearAllMocks();
  it('should get nonce', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        status: 0,
        body: {
          nonce: 'nonce'
        }
      }
    });

    const nonce = await getNonce(1637090717);

    const expectedURL = `${API_ENDPOINT}v2/signature`;
    const expectedParameters = {
      action: "getnonce",
      client_id: CLIENT_ID,
      timestamp: 1637090717,
    };
    expectedParameters.signature = sign(expectedParameters, CLIENT_SECRET);
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParameters);
  });
});