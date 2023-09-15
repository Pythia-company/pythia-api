import chai, { expect } from "chai";
import { dbTest as db} from "../../../src/models/mongo_setup.js";
import { 
    getMarket
} from "../../../src/models/getMarket.js";

describe('testing /markets/{marketAddress} model', async function() {

    beforeEach(async function () {
        const markets = await db.collection("markets");

        await markets.deleteMany(
            {}
        );
        
    });

    afterEach(async function () {
        const markets = await db.collection("markets");

        await markets.deleteMany(
            {}
        );
    });

  
    // test a functionality
    it('testing return fields', async function() {
        let markets = db.collection("markets");
        const marketParams = {
            "address": '0x',
            "creationDate": 1e6,
            "wageDeadline": 1e6 + 10,
            "resolutionDate": 1e6 + 20,
            "status": "inprogress",
            "topic": "defi",
            "reputationTokenAddress": "0x",
            "options": [
                "option1",
                "option2",
                "option3"
            ],
            "question": "question",
            "users": [
                {
                    "address": "0x1"
                },
                {
                    "address": "0x2"
                }
            ]

        }

        await markets.insertOne(marketParams);
        const params = {
            "marketAddress": "0x",
        }
        const output = (
            await getMarket(
                db,
                params
            )
        );

        const data = output['data']

        // validating fields
        const fieldToReturn = [
            "address",
            "creationDate",
            "wageDeadline",
            "resolutionDate",
            "status",
            "topic",
            "reputationTokenAddress",
            "options",
            "question",
            "answer",
            "numOfPredictors"
        ]

        expect(fieldToReturn).to.eql(
            Object.keys(data)
        )
    })
})