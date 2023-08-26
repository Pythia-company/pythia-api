export const getMarketsPredictions = async(db, params) => {
    const marketsCollection = await db.collection("markets");
    const matchParams = {}

    const limit = Math.min(parseInt(params['limit'] || 10), 100)
    const offset = Math.min(parseInt(params['offset'] || 0), 100)
    const query = [];
    query.push(
        {
            $unwind: "$users"
        }
    );

    if("topic" in params){
        query.push(
            {
                $match: {
                    "topic": {
                        $in: params.topic
                    }
                }
            }
        )
    }

    query.push(
        {
            $project: {
                _id: 0,
                user: "$users.address",
                market: "$address",
                topic: "$topic",
                encodedPrediction: "$users.encodedPrediction",
                predictionDate: "$users.predictionDate"
            }
        },
        {
            $skip: offset
        },
        {
            $limit: limit
        }
    )

    return await marketsCollection.aggregate(query).toArray();
}