import { fetchResponse } from "./utils.js";
import chai, { expect } from "chai";

describe('testing /market/{marketAddress}/users enpoint', async function() {

    it('correct parameters check fields', async function() {
        const url = "http://api.pythia.company:8888/markets/0x5c16acc45b8ec012ba5dd7ab03d179a8aea667fb/users";
        const responseData = await fetchResponse(url);

        const responseFields = [
            "address",
            "predictionDate",
            "encodedPrediction",
            "reputationCollectionDate",
            "decodedPrediction",
            "reputation"
        ]

        expect(Object.keys(responseData["data"][0])).to.have.members(responseFields);
    })
})
