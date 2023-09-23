import chai, { expect } from "chai";
import { dbTest as db} from "../../../src/models/mongo_setup.js";
import { 
    getMarkets
} from "../../../src/models/getMarkets.js";

describe('testing /markets model', async function() {

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
        const marketParams = [
            {
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
        ]

        await markets.insertMany(marketParams);

        // valid request params
        const params = {
            "createdAfter": 1e5,
        }
        const results = (
            await getMarkets(
                db,
                params
            )
        );
        const data = results['data']
        const meta = results['meta']

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
            "payload",
            "answer",
            "numOfPredictors",
        ]
        console.log(data)

        expect(fieldToReturn).to.eql(
            Object.keys(data[0])
        )
        expect(meta['numObjects']).to.eql(1);
        expect(meta['offset']).to.eql(0);
        expect(meta['limit']).to.eql(10);


        // empty response
        const emptyResponseParams = {
            "topics": ["trading"]
        }
        const emptyResults = (
            await getMarkets(
                db,
                emptyResponseParams
            )
        );
        expect(emptyResults.data).to.eql([]);
    })
})