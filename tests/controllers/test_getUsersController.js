import { validateFields } from "../../src/controllers/getUsersController.js";

import chai, { expect } from "chai";

describe('testing validateFields in getUsersController', async function() {

    it('testing request validity', async function() {
        const validParams = {
            "topic": 'defi',
            "offset": 0,
            "limit": 10
        }

        expect(await validateFields(validParams)).to.eq(true);

        const invalidParamsByField = {
            "topic": 'defi',
            "offeset": 0,
            "limit": 10
        }

        expect(await validateFields(invalidParamsByField)).to.eq(false);

        const invalidParamsByRequiredField = {
            "offeset": 0,
            "limit": 10
        }

        expect(await validateFields(invalidParamsByRequiredField)).to.eq(false);

        const invalidParamsByFieldVal = {
            "topic": "defi",
            "offeset": -1,
            "limit": 10
        }

        expect(await validateFields(invalidParamsByFieldVal)).to.eq(false);
    })
})