import { validateFields } from "../../../src/controllers/getUserStatsController.js";

import chai, { expect } from "chai";

describe('testing validateFields in getUserStatsController', async function() {

    it('testing request validity', async function() {
        const validParams = {
            "userAddress": '0x1',
            "topic": "defi",
            "periodDays": 10
        }

        expect(await validateFields(validParams)).to.eq(true);

        const invalidParamsByField = {
            "topic": 'defi',
            "sf": "defi"
        }

        expect(await validateFields(invalidParamsByField)).to.eq(false);

        const invalidParamsByRequiredField = {
            "topic": "defi",
        }

        expect(await validateFields(invalidParamsByRequiredField)).to.eq(false);

        const invalidParamsByFieldVal = {
            "userAddress": 'abc',
            "topic": "defi",
        }

        expect(await validateFields(invalidParamsByFieldVal)).to.eq(false);
    })
})