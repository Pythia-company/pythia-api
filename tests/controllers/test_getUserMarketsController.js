import { validateFields } from "../../src/controllers/getUserMarketsController.js";

import chai, { expect } from "chai";

describe('testing validateFields in getUserMarketsController', async function() {

    it('testing request validity', async function() {
        const validParams = {
            "userAddress": '0x1'
        }

        expect(await validateFields(validParams)).to.eq(true);

        const invalidParamsByField = {
            "topic": 'defi',
            "order": -1
        }

        expect(await validateFields(invalidParamsByField)).to.eq(false);

        const invalidParamsByRequiredField = {
            "topic": "defi",
        }

        expect(await validateFields(invalidParamsByRequiredField)).to.eq(false);

        const invalidParamsByFieldVal = {
            "userAddress": 'abc'
        }

        expect(await validateFields(invalidParamsByFieldVal)).to.eq(false);
    })
})