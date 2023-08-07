import { validateFields } from "../../../src/controllers/getMarketsController.js";

import chai, { expect } from "chai";

describe('testing validateFields in getMarketsController', async function() {

    it('testing request validity', async function() {
        const validParams = {
            questionPattern: "what will be the price of usd/btc"
        }

        expect(await validateFields(validParams)).to.eq(true);

        const invalidParamsByField = {
            "randomField": 'defi',
        }

        expect(await validateFields(invalidParamsByField)).to.eq(false);

        const invalidParamsByRequiredField = {
            "status": "hello"
        }

        expect(await validateFields(invalidParamsByRequiredField)).to.eq(false);
    })
})