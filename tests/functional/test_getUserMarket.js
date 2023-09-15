import { fetchResponse } from "./utils.js";
import chai, { expect } from "chai";

describe('testing /users/{userAddress}/markets/{marketAddress} enpoint', async function() {

    it('correct parameters check fields', async function() {
        const url = "http://api.pythia.company:8888/users/0x6e8c110e361b8b5376f0bf43effcbafef22ceb64/markets/0x5c16acc45b8ec012ba5dd7ab03d179a8aea667fb"
        const responseData = await fetchResponse(url);

        const responseFields = [
            "predictionDate",
            "encodedPrediction",
            "reputationCollectionDate",
            "decodedPrediction",
            "reputation",
            "correct"
        ]

        expect(Object.keys(responseData["data"])).to.have.members(responseFields);
    })
})
