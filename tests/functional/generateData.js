// import {db} from "../../src/models/mongo_setup.js";


// const users = await db.collection("users");
// const markets = await db.collection("markets");

// const user1 =  {
//     "address": "0x1",
//     "desciption": "hello",
//     "status": "trial",
//     "registrationDate": 1e6,
//     "subcriptionInitDate": 1e6,
//     "nextSubcriptionPayDate": 1e6,
//     "subscriptionAmountDue": 2e15,
// }

// const user2 =  {
//     "address": "0x2",
//     "desciption": "hello",
//     "status": "trial",
//     "registrationDate": 1e6,
//     "subcriptionInitDate": 1e6,
//     "nextSubcriptionPayDate": 1e6,
//     "subscriptionAmountDue": 2e15,
// }


// const market1 = {
//     "address": "0xm1",
//     "question": "question",
//     "wageDeadline": 1e6,
//     "resolutionDate": 1e6,
//     "topic": "defi",
//     "reputationTokenAddress": "0x3",
//     "options": ["option1", "option2"],
//     "status": "unresolved",
// }
const url = "http://api.pythia.company:8888";

const testRequest = async() => {
    await fetch(`${url}/markets/0x`)
}

await testRequest();



// const market2 = {
//     "address": "0xm2",
//     "question": "question",
//     "wageDeadline": 1e6,
//     "resolutionDate": 1e6,
//     "topic": "defi",
//     "reputationTokenAddress": "0x3",
//     "options": ["option1", "option2"],
//     "status": "unresolved",
// }

// await users.insertMany(
//     [
//         user
//     ]
// )

