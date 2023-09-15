import { fetchResponse } from "./utils.js";
import chai, { expect } from "chai";

describe('testing /markets/{marketAddress} endpoint', async function() {

    it('correct parameters check fields', async function() {
        const url = "http://api.pythia.company:8888/markets/0xe3dc6deb7cb7d5417bc90ba36223ceada114cf27";
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

        expect(Object.keys(responseData['data'])).to.have.members(responseFields);
    })
})