import chai, { expect } from "chai";
import { dbTest as db} from "../../src/models/mongo_setup.mjs";
import { 
    getMarketUsers
} from "../../src/controllers/getMarketUsers.mjs";

describe('testing /markets  controller', async function() {

    beforeEach(async function () {
        const users = await db.collection("users");

        await users.deleteMany(
            {}
        );
        
    });

    afterEach(async function () {
        const users = await db.collection("users");

        await users.deleteMany(
            {}
        );
    });

  
    // test a functionality
    it('testing return fields', async function() {
        let users = db.collection("users");
        const userParams = {
            "address": '0x',
            "markets": [
                {
                    "address": "0x1",
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
                    "encodedPrediction": "0x4",
                    "predictionDatetime": 1e6
                },
                {
                    "address": "0x2",
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
                    "encodedPrediction": "0x4",
                    "predictionDatetime": 1e6
                }
            ]

        }

        await users.insertOne(userParams);
        const params = {
            "marketAddress": "0x1",
        }
        const results = (
            await getMarketUsers(
                db,
                params
            )
        );
        console.log('results');
        console.log(results);
    })
})