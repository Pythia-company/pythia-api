import { validateFields } from "../../../src/controllers/getUserController.js";

import chai, { expect } from "chai";

describe('testing validateFields in getUserController', async function() {

    it('testing request validity', async function() {
        const validParams = {
            "userAddress": '0x',
        }

        expect(await validateFields(validParams)).to.eq(true);

        const invalidParamsByField = {
            "randomField": 'defi',
        }

        expect(await validateFields(invalidParamsByField)).to.eq(false);

        const invalidParamsByRequiredField = {
            "userAddress": 123
        }

        expect(await validateFields(invalidParamsByRequiredField)).to.eq(false);
    })
})