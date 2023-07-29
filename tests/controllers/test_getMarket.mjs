import chai, { expect } from "chai";
import { dbTest as db} from "../../src/models/mongo_setup.mjs";
import { 
    getMarket
} from "../../src/controllers/getMarket.mjs";

describe('testing /markets  controller', async function() {

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
            "creationDatetime": 1e6,
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
            "address": "0x",
        }
        const results = (
            await getMarket(
                db,
                params
            )
        )[0];

        // validating fields
        const fieldToReturn = [
            "address",
            "creationDatetime",
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
            Object.keys(results)
        )
    })
})