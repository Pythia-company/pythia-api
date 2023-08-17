import { fetchResponse } from "./utils.js";
import chai, { expect } from "chai";

// describe('testing /users enpoint', async function() {

//     it('correct parameters check fields', async function() {
//         const url = "http://api.pythia.company:8888/users?topic=defi";
//         const responseData = await fetchResponse(url);

//         const responseFields = [
//             "address",
//             "accuracy",
//             "reputation"
//         ]

//         expect(Object.keys(responseData[0])).to.have.members(responseFields);
//     })
// })

const url = "http://api.pythia.company:8888/users?topic=defi";
const responseData = await fetchResponse(url);
console.log(responseData)