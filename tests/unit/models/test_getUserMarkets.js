import chai, { expect } from "chai";
import { dbTest as db} from "../../../src/models/mongo_setup.js";
import { 
    getUserMarkets
} from "../../../src/models/getUserMarkets.js";

describe('testing /users/{userAddress}/markets model', async function() {

    beforeEach(async function () {
        const users = await db.collection("markets");

        await users.deleteMany(
            {}
        );
        
    });

    afterEach(async function () {
        const users = await db.collection("markets");
        await users.deleteMany(
            {}
        );
    });

  
    // test a functionality
    it('testing return fields', async function() {
        let markets = db.collection("markets");
        const firstMarketParams = {
            "address": "0x1",
            "question": "question",
            "creationDate": 1e6,
            "wageDeadline": 1e6,
            "resolutionDate": 1e6,
            "topic": "topic",
            "reputationTokenAddress": "0x3",
            "status": "resolved",
            "answer": 9,
            "decodedPrediction": 8,
            "reputaion": 9.1,
            "options": ["1", "2"],
            "users": [{
                "address": '0x',
                "description": "hello",
                "status": "subscribed",
                "registrationDate": 1e6
            }]
        }

        const secondMarketParams = {
            "address": "0x1",
            "question": "question",
            "creationDate": 1e6,
            "wageDeadline": 1e6,
            "resolutionDate": 1e6,
            "topic": "topic",
            "reputationTokenAddress": "0x3",
            "status": "resolved",
            "answer": 9,
            "decodedPrediction": 8,
            "reputaion": 9.1,
            "options": ["1", "2"],
            "users": [{
                "address": '0x',
                "description": "hello",
                "status": "subscribed",
                "registrationDate": 1e6
            }]
        }

        await markets.insertOne(firstMarketParams);

        await markets.insertOne(secondMarketParams);
        // valid params
        const params = {
            "userAddress": "0x",
        }
        const results = (
            await getUserMarkets(
                db,
                params
            )
        );

        const data = results["data"]
        const meta = results["meta"]

        const fieldsToReturn = [
            'address',
            'question',
            'creationDate',
            'wageDeadline',
            'resolutionDate',
            'topic',
            'reputationTokenAddress',
            'options',
            'status',
            'answer',
            'reputation',
            'correct'
        ]
        expect(fieldsToReturn).to.eql(Object.keys(data[0]));
        expect(meta['numObjects']).to.eql(2);
        expect(meta['offset']).to.eql(0);
        expect(meta['limit']).to.eql(10);

        // empty response
        const emptyResponseParams = {
            "userAddress": "0xabc"
        }
        const emptyResults = (
            await getUserMarkets(
                db,
                emptyResponseParams
            )
        );
        expect(emptyResults.data).to.eql([]);
    })
})