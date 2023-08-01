import chai, { expect } from "chai";
import { dbTest as db} from "../../src/models/mongo_setup.mjs";
import { 
    getUsers
} from "../../src/controllers/getUsers.mjs";

describe('testing /users controller', async function() {

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
                    "topic": "defi"
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
                    "topic": "defi"
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
                    "topic": "nft"
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
                    "topic": "defi"
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
        console.log("results");
        console.log(JSON.stringify(results, null, 5));

        // // validating fields
        // const fieldToReturn = [
        //     "address",
        //     "creationDatetime",
        //     "wageDeadline",
        //     "resolutionDate",
        //     "status",
        //     "topic",
        //     "reputationTokenAddress",
        //     "options",
        //     "question",
        //     "answer",
        //     "numOfPredictors"
        // ]

        // expect(fieldToReturn).to.eql(
        //     Object.keys(results)
        // )
    })
})