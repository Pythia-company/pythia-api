import { fetchResponse } from "./utils.js";
import chai, { expect } from "chai";


describe('testing /users/{userAddress} enpoint', async function() {

    it('correct parameters check fields', async function() {
        const url = "http://api.pythia.company:8888/users/0x6e8c110e361b8b5376f0bf43effcbafef22ceb64";
        const responseData = await fetchResponse(url);

        const responseFields = [
            "address",
            "description",
            "status",
            "registrationDate",
            "nextSubscriptionPayDate",
            "subscriptionAmountDue"
        ]

        expect(Object.keys(responseData["data"])).to.have.members(responseFields);
    })
})