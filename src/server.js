import express from 'express';
import {
    marketRouter
} from "./routes/markets.js";

import {
    userRouter
} from "./routes/users.js";

import {
    predictionsRouter
} from "./routes/predictions.js";

const PORT = process.env.PORT || 8888


let app = express();

app.use("/users", userRouter);

app.use("/markets", marketRouter);

app.use("/predictions", predictionsRouter);

// Start server
app.listen(PORT, function(){
    console.log("Node server running on http://localhost:" + PORT);
});