const { getOrderStatusByOrderIds, getOrderStatusByCustomerRefIds } = require('./getorderstatus');
const { API_ENDPOINT, CLIENT_ID, CLIENT_SECRET} = require('../../config');

const axios = require('axios');
const {sign} = require("../../signature/getnonce/getnonce");

jest.mock("axios");

describe('dropshipment', function() {

  const expectedOrders = [
    {
      order_id: "orderid1",
      customer_ref_id: "customerref1",
      status: 'SHIPPED',
      products: [
        {
          ean: '3700546700000',
          quantity: 1
        }
      ]
    },
    {
      order_id: "orderid2",
      customer_ref_id: "customerref1",
      status: 'SHIPPED',
      products: [
        {
          ean: '3700546700000',
          quantity: 1
        }
      ]
    }
  ];

  it('should get status by order ids', async () => {
    jest.clearAllMocks();
    axios.post.mockResolvedValueOnce({
      data: {
        status: 0,
        body: {
          orders: expectedOrders
        }
      }
    });
    const response =  await getOrderStatusByOrderIds("nonce",["orderid1", "orderid2"]);
    expect(response).toStrictEqual(expectedOrders);
    const expectedURL = `${API_ENDPOINT}v2/dropshipment`
    const expectedParameters = {
      action: 'getorderstatus',
      client_id: CLIENT_ID,
      order_ids: JSON.stringify(['orderid1', 'orderid2']),
      nonce: 'nonce'
    };
    expectedParameters.signature = sign(expectedParameters, CLIENT_SECRET);
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParameters);
  });
  it('should get status by customer ref ids', async () => {
    jest.clearAllMocks();
    axios.post.mockResolvedValueOnce({
      data: {
        status: 0,
        body: {
          orders: expectedOrders
        }
      }
    });

    const response =  await getOrderStatusByCustomerRefIds("nonce", ["customerref1", "customerref2"]);
    expect(response).toStrictEqual(expectedOrders);
    const expectedURL = `${API_ENDPOINT}v2/dropshipment`
    const expectedParameters = {
      action: 'getorderstatus',
      client_id: CLIENT_ID,
      customer_ref_ids: JSON.stringify(['customerref1', 'customerref2']),
      nonce: 'nonce'
    };
    expectedParameters.signature = sign(expectedParameters, CLIENT_SECRET);
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParameters);
  });
});