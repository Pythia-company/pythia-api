import { fetchResponse } from "./utils.js";
import chai, { expect } from "chai";

describe('testing /markets enpoint', async function() {

    it('correct parameters check fields', async function() {
        const url = "http://api.pythia.company:8888/markets";
        const responseData = await fetchResponse(url);

        const responseFields = [
            "address",
            "question",
            "creationDate",
            "wageDeadline",
            "resolutionDate",
            "topic",
            "reputationTokenAddress",
            "options",
            "status",
            "answer",
            "numOfPredictors"
        ]

        expect(Object.keys(responseData["data"][0])).to.have.members(responseFields);
    })
})