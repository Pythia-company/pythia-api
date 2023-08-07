import { MongoClient } from "mongodb";
import {} from 'dotenv/config';

const options = {
  socketTimeoutMS: 3000,
  keepAlive: true,
  useNewUrlParser: true 
}

console.log(`mongo uri: ${process.env.MONGODB_URI}`);
const client = new MongoClient(process.env.MONGODB_URI, options);


let conn;
try {
  conn = await client.connect();
  console.log(`conn:${conn}`);
} catch(e) {
  console.error(e);
}

export const db = conn.db("pythia");
export const dbTest = conn.db("PythiaLogs_Test")