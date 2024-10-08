import chai, { expect } from "chai";
import { dbTest as db} from "../../../src/models/mongo_setup.js";
import { 
    getUserMarket
} from "../../../src/models/getUserMarket.js";

describe('testing /users/{userAddress}/market/{marketAddress} model', async function() {

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
            "description": "hello",
            "status": "subscribed",
            "registrationDate": 1e6,
            "markets": [
                {
                    "address": "0x1",
                    "question": "question",
                    "creationDate": 1e6,
                    "predictionDate": 1e6,
                    "wageDeadline": 1e6,
                    "resolutionDate": 1e6,
                    "topic": "topic",
                    "reputationTokenAddress": "0x3",
                    "status": "resolved",
                    "encodedPrediction": "0x34",
                    "answer": 9,
                    "decodedPrediction": 8,
                    "reputaion": 9.1,
                    "options": ["1", "2"]
                },
                {
                    "address": "0x2",
                    "question": "question",
                    "creationDate": 1e6,
                    "wageDeadline": 1e6,
                    "predictionDate": 1e6,
                    "status": "unresolved",
                    "resolutionDate": 1e6,
                    "topic": "topic",
                    "reputationTokenAddress": "0x3",
                    "answer": null,
                    "encodedPrediction": "0x34",
                    "decodedPrediction": null,
                    "reputaion": null,
                    "options": ["1", "2"]
                }
            ]

        }

        await users.insertOne(userParams);
        // valid params
        const params = {
            "userAddress": "0x",
            "marketAddress": "0x2"
        }
        const results = (
            await getUserMarket(
                db,
                params
            )
        );
        const fieldsToReturn = [
            'predictionDate',
            'predictionTransactionHash',
            'encodedPrediction',
            'reputationCollectionDate',
            'decodedPrediction',
            'reputation',
            'correct'
        ]
        console.log(`user/market: ${JSON.stringify(results, null, 4)}`)
        expect(fieldsToReturn).to.eql(Object.keys(results["data"]));
    })
})