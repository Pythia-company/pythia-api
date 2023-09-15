import { fetchResponse } from "./utils.js";
import chai, { expect } from "chai";

describe('testing /users/{userAddress}/markets enpoint', async function() {

    it('correct parameters check fields', async function() {
        const url = "http://api.pythia.company:8888/users/0xf312eafdffefd0eafb3b1b8e4f71088cfe5ff8ff/markets";
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
            "reputation",
            "correct"
        ]

        expect(Object.keys(responseData["data"][0][0])).to.have.members(responseFields);
    })
})