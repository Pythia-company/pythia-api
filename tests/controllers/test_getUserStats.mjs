import chai, { expect } from "chai";
import { dbTest as db} from "../../src/models/mongo_setup.mjs";
import { getUserStats } from "../../src/controllers/getUserStats.mjs";

describe('testing /users/stats controller', async function() {

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
                    "resolutionDate": (
                        Math.floor(Date.now() / 1000) - (
                            20 *
                            24 *
                            3600
                        )

                    ),
                    "topic": "defi",
                    "resolved": true
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
                    "resolved": true
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
                    "resolved": true
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
                    "resolved": true
                },
            ]

        }

        await users.insertOne(userParams);
        const params = {
            "topic": "defi",
            "userAddress": "0x"
            // "periodDays": 30
        }
        const results = (
            await getUserStats(
                db,
                params
            )
        );
        const fieldsToReturn = [
            "reputation",
            "totalPredictions",
            "address",
            "percentile",
            "accuracy",
            "chart"
        ]
        expect(Object.keys(results)).to.eql(fieldsToReturn)
    })
})