import chai, { expect } from "chai";
import { dbTest as db} from "../../src/models/mongo_setup.js";
import { 
    getUsers
} from "../../src/models/getUsers.js";

describe('testing /users model', async function() {

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
                            30 *
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
            // "periodDays": 30
        }
        const results = (
            await getUsers(
                db,
                params
            )
        );

        // validating fields
        const fieldToReturn = [
            "address",
            "accuracy",
            "reputation"
        ]

        expect(fieldToReturn).to.eql(
            Object.keys(results[0])
        )
    })
})