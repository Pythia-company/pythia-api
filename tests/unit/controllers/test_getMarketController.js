import { validateFields } from "../../../src/controllers/getMarketController.js";

import chai, { expect } from "chai";

describe('testing validateFields in getMarketController', async function() {

    it('testing request validity', async function() {
        const validParams = {
            marketAddress: "0x"
        }

        expect(await validateFields(validParams)).to.eq(true);

        const invalidParamsByField = {
            "randomField": 'defi',
        }

        expect(await validateFields(invalidParamsByField)).to.eq(false);

        const invalidParamsByRequiredField = {
            "marketAddress": "hello"
        }

        expect(await validateFields(invalidParamsByRequiredField)).to.eq(false);
    })
})