const { requestTokenWithClientSecret, refreshTokenWithSignature, requestTokenWithSignature, refreshTokenWithClientSecret } = require('./requesttoken');
const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT, REDIRECT_URI } = require('../../config');
const { sign } = require('../../signature/getnonce/getnonce');

const axios = require('axios');

jest.mock("axios");

describe('oauth2', function() {

  it('should get access token with signature', async () => {
    jest.clearAllMocks();
    axios.post.mockResolvedValueOnce({
      data: {
        status: 0,
        body: {
          userid: 1,
          access_token: 'access_token',
          refresh_token: 'refresh_token',
          scope: 'user.info',
          expires_in: 10800,
          csrf_token: 'gnJhZT5TvjieqyJx4uMHIDJV5dkoRRaw',
          token_type: 'Bearer'
        }
      }
    });

    const response = await requestTokenWithSignature("nonce", "authorization_code");

    expect(response).toStrictEqual({
      userid: 1,
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      scope: 'user.info',
      expires_in: 10800,
      csrf_token: 'gnJhZT5TvjieqyJx4uMHIDJV5dkoRRaw',
      token_type: 'Bearer'
    });
    const expectedURL = `${API_ENDPOINT}v2/oauth2`;
    const expectedParameters = {
      action: 'requesttoken',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code: 'authorization_code',
      grant_type: 'authorization_code',
      nonce: 'nonce',
    };
    expectedParameters.signature = sign(expectedParameters, CLIENT_SECRET);
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParameters);
  });

  it('should get access token with client secret', async () => {
    jest.clearAllMocks();
    axios.post.mockResolvedValueOnce({
      data: {
        status: 0,
        body: {
          userid: 1,
          access_token: 'access_token',
          refresh_token: 'refresh_token',
          scope: 'user.info',
          expires_in: 10800,
          csrf_token: 'gnJhZT5TvjieqyJx4uMHIDJV5dkoRRaw',
          token_type: 'Bearer'
        }
      }
    });

    const response = await requestTokenWithClientSecret("authorization_code");

    expect(response).toStrictEqual({
      userid: 1,
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      scope: 'user.info',
      expires_in: 10800,
      csrf_token: 'gnJhZT5TvjieqyJx4uMHIDJV5dkoRRaw',
      token_type: 'Bearer'
    });
    const expectedURL = `${API_ENDPOINT}v2/oauth2`
    const expectedParameters = {
      action: 'requesttoken',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: 'authorization_code',
      grant_type: 'authorization_code',
    };
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParameters);

  });

  it('should refresh access token with client secret', async () => {
    jest.clearAllMocks();
    axios.post.mockResolvedValueOnce({
      data: {
        status: 0,
        body: {
          userid: 1,
          access_token: 'access_token',
          refresh_token: 'refresh_token',
          scope: 'user.info',
          expires_in: 10800,
          csrf_token: 'gnJhZT5TvjieqyJx4uMHIDJV5dkoRRaw',
          token_type: 'Bearer'
        }
      }
    });

    const response = await refreshTokenWithClientSecret("refresh_token");

    expect(response).toStrictEqual({
      userid: 1,
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      scope: 'user.info',
      expires_in: 10800,
      csrf_token: 'gnJhZT5TvjieqyJx4uMHIDJV5dkoRRaw',
      token_type: 'Bearer'
    });
    const expectedURL = `${API_ENDPOINT}v2/oauth2`
    const expectedParameters = {
      action: 'requesttoken',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: 'refresh_token',
      grant_type: 'refresh_token',
    };
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParameters);
  });

  it('should refresh access token with signature', async () => {
    jest.clearAllMocks();
    axios.post.mockResolvedValueOnce({
      data: {
        status: 0,
        body: {
          userid: 1,
          access_token: 'access_token',
          refresh_token: 'refresh_token',
          scope: 'user.info',
          expires_in: 10800,
          csrf_token: 'gnJhZT5TvjieqyJx4uMHIDJV5dkoRRaw',
          token_type: 'Bearer'
        }
      }
    });

    const response = await refreshTokenWithSignature("nonce", "refresh_token");

    expect(response).toStrictEqual({
      userid: 1,
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      scope: 'user.info',
      expires_in: 10800,
      csrf_token: 'gnJhZT5TvjieqyJx4uMHIDJV5dkoRRaw',
      token_type: 'Bearer'
    });
    const expectedURL = `${API_ENDPOINT}v2/oauth2`
    const expectedParameters = {
      action: 'requesttoken',
      client_id: CLIENT_ID,
      refresh_token: 'refresh_token',
      grant_type: 'refresh_token',
      nonce: 'nonce',
    };
    expectedParameters.signature = sign(expectedParameters, CLIENT_SECRET);
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParameters);

  });

  it('should refresh access token with signature', async () => {
    jest.clearAllMocks();
    axios.post.mockResolvedValueOnce({
      data: {
        status: 0,
        body: {
          userid: 1,
          access_token: 'access_token',
          refresh_token: 'refresh_token',
          scope: 'user.info',
          expires_in: 10800,
          csrf_token: 'gnJhZT5TvjieqyJx4uMHIDJV5dkoRRaw',
          token_type: 'Bearer'
        }
      }
    });

    const response = await refreshTokenWithSignature("nonce", "refresh_token");

    expect(response).toStrictEqual({
      userid: 1,
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      scope: 'user.info',
      expires_in: 10800,
      csrf_token: 'gnJhZT5TvjieqyJx4uMHIDJV5dkoRRaw',
      token_type: 'Bearer'
    });
    const expectedURL = `${API_ENDPOINT}v2/oauth2`
    const expectedParameters = {
      action: 'requesttoken',
      client_id: CLIENT_ID,
      refresh_token: 'refresh_token',
      grant_type: 'refresh_token',
      nonce: 'nonce',
    };
    expectedParameters.signature = sign(expectedParameters, CLIENT_SECRET);
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParameters);
  });
});