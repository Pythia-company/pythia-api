import { fetchResponse } from "./utils.js";
import chai, { expect } from "chai";

// describe('testing /users/{userAddress}/stats enpoint', async function() {

//     it('correct parameters check fields', async function() {
//         const url = "http://api.pythia.company:8888/users/stats/0xf312eafdffefd0eafb3b1b8e4f71088cfe5ff8ff?topic=defi";
//         const responseData = await fetchResponse(url);

//         const responseFields = [
//             "address",
//             "percentile",
//             "accuracy",
//             "reputation",
//             "totalPredictions",
//             "chart"
//         ]
//         console.log("response data")
//         console.log(responseData)

//         expect(Object.keys(responseData)).to.have.members(responseFields);
//     })
// })

const url = "http://api.pythia.company:8888/users/stats/0xf312eafdffefd0eafb3b1b8e4f71088cfe5ff8ff?topic=defi";
const responseData = await fetchResponse(url);
console.log(responseData);