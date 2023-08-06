import { validateFields } from "../../src/controllers/getUserMarketController.js";

import chai, { expect } from "chai";

describe('testing validateFields in getUserMarketController', async function() {

    it('testing request validity', async function() {
        const validParams = {
            "userAddress": '0x1',
            "marketAddress": '0x2',
        }

        expect(await validateFields(validParams)).to.eq(true);

        const invalidParamsByField = {
            "userAddress": '0x1',
            "marketAddress": '0x2',
            "sf": "defi"
        }

        expect(await validateFields(invalidParamsByField)).to.eq(false);

        const invalidParamsByRequiredField = {
            "userAddress": '0x1'
        }

        expect(await validateFields(invalidParamsByRequiredField)).to.eq(false);

        const invalidParamsByFieldVal = {
            "userAddress": 'abc',
            "marketAddress": '0x2',
        }

        expect(await validateFields(invalidParamsByFieldVal)).to.eq(false);
    })
})