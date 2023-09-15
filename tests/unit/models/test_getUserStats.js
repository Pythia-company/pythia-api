import chai, { expect } from "chai";
import { dbTest as db} from "../../../src/models/mongo_setup.js";
import { getUserStats } from "../../../src/models/getUserStats.js";

describe('testing /users/stats model', async function() {

    beforeEach(async function () {
        const users = await db.collection("users");
        const markets = await db.collection("markets");

        await users.deleteMany(
            {}
        );
        await markets.deleteMany(
            {}
        );
        
    });

    afterEach(async function () {
        const users = await db.collection("users");
        const markets = await db.collection("markets");

        await users.deleteMany(
            {}
        );
        await markets.deleteMany(
            {}
        );
    });

  
    // test a functionality
    it('testing return fields', async function() {
        let marketCollection = db.collection("markets");
        let userCollection = db.collection("users");

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

        const marketsParams = [
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
                "resolved": true,
                "users": [
                    {"address": '0x'}
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
                "resolved": true,
                "users": [
                    {"address": '0x'}
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
                "resolved": true,
                "users": [
                    {"address": '0x'}
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
                "resolved": true,
                "users": [
                    {"address": '0x'}
                ]
            },
        ]

        await userCollection.insertOne(userParams);
        await marketCollection.insertMany(marketsParams);

        const params = {
            "topic": "defi",
            "userAddress": "0x"
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
        expect(Object.keys(results['data'])).to.eql(fieldsToReturn)
    })
})