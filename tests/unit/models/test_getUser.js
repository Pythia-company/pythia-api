import chai, { expect } from "chai";
import { dbTest as db} from "../../../src/models/mongo_setup.js";
import { 
    getUser
} from "../../../src/models/getUser.js";

describe('testing /users/{userAddress} model', async function() {

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
            "nextSubcriptionPayDate": 1e6 + 10000,
            "nextSubcriptionAmountDue": 1e10

        }

        await users.insertOne(userParams);

        // valid params
        const params = {
            "userAddress": "0X",
        }
        const results = (
            await getUser(
                db,
                params
            )
        );
        const fieldsToReturn = [
            "address",
            "status",
            "registrationDate",
            "description",
            "nextSubcriptionPayDate",
            "nextSubcriptionAmountDue"
        ]
        expect(fieldsToReturn).to.eql(Object.keys(results["data"]));

        // empty response
        const emptyResponseParams = {
            "userAddress": "0xabc"
        }
        const emptyResults = (
            await getUser(
                db,
                emptyResponseParams
            )
        );
        expect(emptyResults).to.eql(null);
    })
})