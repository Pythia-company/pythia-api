import chai, { expect } from "chai";
import { dbTest as db} from "../../../src/models/mongo_setup.js";
import { 
    getMarketsPredictions
} from "../../../src/models/getMarketsPredictions.js";

describe('testing /marketsPredictions model', async function() {

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
                    "address": "0x1",
                    "encodedPrediction": "0x56",
                    "predictionDate": 1e6 + 5
                },
                {
                    "address": "0x2",
                    "encodedPrediction": "0x57",
                    "predictionDate": 1e6 + 5
                }
            ]

        }

        await markets.insertOne(marketParams);
        // valid params
        const params = {
            "topic": ["defi"],
        }
        const results = (
            await getMarketsPredictions(
                db,
                params
            )
        );
        const data = results['data']
        const meta = results['meta']

        // validating fields
        const fieldToReturn = [
            "user",
            "market",
            "topic",
            "encodedPrediction",
            "predictionDate"
        ]

        expect(fieldToReturn).to.eql(
            Object.keys(data[0])
        )
        expect(meta['numObjects']).to.eql(2);
        expect(meta['offset']).to.eql(0);
        expect(meta['limit']).to.eql(10);

        // empty response
        const emptyResponseParams = {
            "topic": ["trading"]
        }
        const emptyResults = (
            await getMarketsPredictions(
                db,
                emptyResponseParams
            )
        );
        expect(emptyResults.data).to.eql([]);
    })
})