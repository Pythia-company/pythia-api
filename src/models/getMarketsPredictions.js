export const getMarketsPredictions = async(db, params) => {
    const marketsCollection = await db.collection("markets");

    const limit = Math.min(parseInt(params['limit'] || 10), 100)
    const offset = Math.min(parseInt(params['offset'] || 0), 100)
    const pipeline = [];
    pipeline.push(
        {
            $unwind: "$users"
        }
    );

    if("topic" in params){
        pipeline.push(
            {
                $match: {
                    "topic": {
                        $in: params.topic
                    }
                }
            }
        )
    }
    
    const dataPipeline = [
        ...pipeline,
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
    ]

    const metaPipeline = [
        ...pipeline,
        {
            $addFields: {
                "limit": parseInt(params['limit'] || 10),
                "offset": parseInt(params['offset'] || 0),
            }
        },
        { 
            $group: {
                _id: null,
                numObjects: { 
                    $sum: 1 
                },
                "limit": {$max: "$limit"},
                "offset": {$max: "$offset"},
            } 
        },
        {
            $project: {
                "_id": 0,
                "limit": 1,
                "offset": 1,
                "numObjects": 1
            }
        }
    ]



    const data = await marketsCollection.aggregate(
        [
            {
                $facet: {
                    "data": dataPipeline,
                    "meta": metaPipeline
                }
        
            }
        ]
    ).toArray()
    const output = {"data": [], "meta": {}}
    if(data[0].data.length === 0){
        return {
            "data": [],
            "meta": {}
        }
    }
    output["data"] = data[0].data
    output["meta"] = data[0].meta[0]
    return output
}