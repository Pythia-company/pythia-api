import chai, { expect } from "chai";
import { dbTest as db} from "../../../src/models/mongo_setup.js";
import { 
    getMarketUsers
} from "../../../src/models/getMarketUsers.js";

describe('testing /markets model', async function() {

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
                    "encodedPrediction": "0x4",
                    "predictionDate": 1e6
                },
                {
                    "address": "0x2",
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
                    "encodedPrediction": "0x4",
                    "predictionDate": 1e6
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
        )[0];
        const fieldsToReturn = [
            'address',
            'predictionDate',
            'encodedPrediction',
            'reputationCollectionDate',
            'decodedPrediction',
            'reputation'
        ]
        expect(fieldsToReturn).to.eql(Object.keys(results));
    })
})