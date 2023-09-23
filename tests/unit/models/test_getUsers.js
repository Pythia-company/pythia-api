import chai, { expect } from "chai";
import { dbTest as db} from "../../../src/models/mongo_setup.js";
import { 
    getUsers
} from "../../../src/models/getUsers.js";

describe('testing /users model', async function() {

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
        let marketsCollection = db.collection("markets");
        const marketsParams = [
            {
                "address": "0x1",
                "resolutionDate": (
                    Math.floor(Date.now() / 1000) - (
                        30 *
                        24 *
                        3600
                    )

                ),
                "topic": "defi",
                "status": "resolved",
                "answer": 1,
                "users": [
                    {
                        "address": "0x",
                        "encodedPrediction": "0x6",
                        "decodedPrediction": 0
                    }
                ]
            },
            {
                "address": "0x2",
                "resolutionDate": (
                    Math.floor(Date.now() / 1000) - (
                        60 *
                        24 *
                        3600
                    )

                ),
                "reputation": 10.0,
                "topic": "defi",
                "status": "resolved",
                "answer": 0,
                "users": [
                    {
                        "address": "0x",
                        "encodedPrediction": "0x6",
                        "decodedPrediction": 0
                    }
                ]
            },
            {
                "address": "0x3",
                "resolutionDate": (
                    Math.floor(Date.now() / 1000) - (
                        30 *
                        24 *
                        3600
                    )

                ),
                "reputation": 10.0,
                "topic": "nft",
                "status": "resolved",
                "answer": 0,
                "users": [
                    {
                        "address": "0x",
                        "encodedPrediction": "0x6",
                        "decodedPrediction": 0
                    }
                ]
            },
            {
                "address": "0x4",
                "resolutionDate": (
                    Math.floor(Date.now() / 1000) - (
                        30 *
                        24 *
                        3600
                    )

                ),
                "reputation": 10.0,
                "topic": "defi",
                "status": "resolved",
                "answer": 2,
                "users": [
                    {
                        "address": "0x",
                        "encodedPrediction": "0x6",
                        "decodedPrediction": 0
                    }
                ]
            }
        ]
        await marketsCollection.insertMany(marketsParams);

        // valid params
        const params = {
            "topic": "defi",
        }
        const results = (
            await getUsers(
                db,
                params
            )
        );

        const data = results["data"]
        const meta = results["meta"]

        // validating fields
        const fieldToReturn = [
            "address",
            "accuracy",
            "reputation"
        ]

        expect(fieldToReturn).to.eql(
            Object.keys(data[0])
        )
        expect(meta['numObjects']).to.eql(1);
        expect(meta['offset']).to.eql(0);
        expect(meta['limit']).to.eql(10);

        // empty response
        const emptyResponseParams = {
            "topic": "trading"
        }
        const emptyResults = (
            await getUsers(
                db,
                emptyResponseParams
            )
        );
        expect(emptyResults.data).to.eql([]);
    })
})