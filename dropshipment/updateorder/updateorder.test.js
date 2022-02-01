const { updateOrder } = require('./updateorder');
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
        body: {
          orders: [
            {
              order_id: "orderid1",
              customer_ref_id: "customer-ref-id",
              status: 'FAILED',
              products: [
                {
                  ean: '3700546700000',
                  quantity: 1
                }
              ]
            },
          ]
        }
      }
    })
    const address   = {
      name: 'John Doe',
      company_name: 'Company',
      email: 'john.doe@example.com',
      telephone: '+551155256325',
      address1: '767 5th Ave',
      address2: 'Apt 101',
      city: 'Issy-les-Moulineaux',
      zip: '10153',
      state: 'NY',
      country: 'FR'
    };
    const products  = [
      {
        ean: '3700546707100',
        quantity: 1
      }
    ];
    const order     = {
      customer_ref_id: 'customer-ref-id', //the id of this order on your side
      address,
      products,
      force_address: true,
    };

    const response = await updateOrder('nonce', "orderid", order);

    expect(response).toStrictEqual([
      {
        order_id: "orderid1",
        customer_ref_id: "customer-ref-id",
        status: 'FAILED',
        products: [
          {
            ean: '3700546700000',
            quantity: 1
          }
        ]
      },
    ]);
    const expectedURL = `${API_ENDPOINT}v2/dropshipment`
    const expectedParameters = {
      action: 'update',
      client_id: CLIENT_ID,
      nonce: 'nonce',
      order_id: 'orderid',
      order: JSON.stringify([order]),
    };
    expectedParameters.signature = sign(expectedParameters, CLIENT_SECRET);
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParameters);
  });
});