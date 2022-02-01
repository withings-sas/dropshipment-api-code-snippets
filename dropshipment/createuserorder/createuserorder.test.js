const { createUserOrder } = require('./createuserorder');
const { CLIENT_ID, CLIENT_SECRET, API_ENDPOINT } = require('../../config');
const { sign } = require('../../signature/getnonce/getnonce');

const axios = require('axios');

jest.mock("axios");

const MEASURE_TYPE_HEIGHT = 4;
const MEASURE_TYPE_WEIGHT = 1;
const UNIT_HEIGHT_M  = 6;
const UNIT_HEIGHT_IN = 7;
const UNIT_WEIGHT_KG = 1;
const UNIT_WEIGHT_LB = 2;
const UNIT_WEIGHT_STLB = 14;
const UNIT_DISTANCE_KM = 6;
const UNIT_DISTANCE_YD = 8;
const UNIT_TEMPERATURE_C = 11;
const UNIT_TEMPERATURE_F = 13;
const TESTMODE_SHIPPED  = 1;
const TESTMODE_TRASHED  = 2;
const TESTMODE_FAILED   = 3;
const TESTMODE_BACKHOLD = 4;

describe('dropshipment', function() {
  it('should createuser/order', async () => {
    jest.clearAllMocks();
    axios.post.mockResolvedValueOnce({
      data: {
        status: 0,
        body: {
          user: {
            code: 'authorization_code',
            external_id: 'my-external-id'
          },
          order: [
            {
              order_id: "orderid1",
              customer_ref_id: "customer-ref-id",
              status: 'SHIPPED',
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
    });

    const address   = {
      name: 'Hugo NICOLAS',
      company_name: 'Company',
      email: 'hugoncls@gmail.com',
      telephone: '+551155256325',
      address1: '2 rue maurice hartmann',
      address2: 'Apt 101',
      city: 'Issy-les-Moulineaux',
      zip: '92130',
      state: 'Hauts-de-Seine',
      country: 'FR'
    };
    const products  = [
      {
        ean: '3700546707100',
        quantity: 1
      }
    ];
    const measures  = [
      { value: 190, unit: -2, type: MEASURE_TYPE_HEIGHT }, //1m90
      { value: 90, unit: 0, type:  MEASURE_TYPE_WEIGHT} //90kg
    ];
    const order     = {
      customer_ref_id: 'customer-ref-id', //the id of this order on your side
      address,
      products,
      force_address: true,
    };
    const unit_pref = { weight: UNIT_WEIGHT_KG, height: UNIT_HEIGHT_M, distance: UNIT_DISTANCE_KM, temperature: UNIT_TEMPERATURE_C };
    const mandatory_params_user = {
      mailingpref: 0,
      birthdate: 848166152,
      measures, // measurements should always be passed in kg/m
      gender: 0,
      preflang: 'en_US',
      unit_pref,
      email: 'john.doe@example.com',
      timezone: 'America/New_York',
      shortname: 'JDO',
      external_id: 'my-external-id' //id of this user on your side
    }
    const optional_params_user      = {
      firstname: 'John', //if not set, will take the same value as shortname
      lastname: 'Doe', //if not set, will take the same value as shortname
      phonenumber: '+551155256325', //Phone number in E.164 format.
      recovery_code: 'abcde12345',
      goals: {
         steps: 10000,
         sleep: 28800,
         weight: {
          value: 70500,
          unit: -3
        }
      }
    }
    const user = {...mandatory_params_user, ...optional_params_user};

    const response = await createUserOrder('nonce', order, user, 0);
    expect(response).toStrictEqual({
      status: 0,
      body: {
        user: {
          code: 'authorization_code',
          external_id: 'my-external-id'
        },
        order: [
          {
            order_id: "orderid1",
            customer_ref_id: "customer-ref-id",
            status: 'SHIPPED',
            products: [
              {
                ean: '3700546700000',
                quantity: 1
              }
            ]
          },
        ]
      }
    })

    const expectedURL = `${API_ENDPOINT}v2/dropshipment`
    const expectedParameters = {
      action: 'createuserorder',
      client_id: CLIENT_ID,
      nonce: 'nonce',
      testmode: 0,
      order: JSON.stringify([order]),
      email: 'john.doe@example.com',
      shortname: 'JDO',
      gender: 0,
      birthdate: 848166152,
      measures: JSON.stringify(measures),
      external_id: 'my-external-id',
      mailingpref: 0,
      unit_pref: JSON.stringify(unit_pref),
      preflang: 'en_US',
      timezone: 'America/New_York',
      firstname: 'John',
      lastname: 'Doe',
      phonenumber: '+551155256325',
      recovery_code:'abcde12345',
      goals: {
        "steps": 10000,
        "sleep": 28800,
        "weight": {
          "value": 70500,
          "unit": -3
        }
      }
    };
    expectedParameters.signature = sign(expectedParameters, CLIENT_SECRET);
    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedParameters);
  });
});