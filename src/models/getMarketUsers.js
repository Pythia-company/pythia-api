export const getMarketUsers = async(db, params) => {
    const usersCollection = await db.collection("users");

    const sortOrder = (
        (
            (params['order'] == null) ||
            (params['order'] === 'desc')
        ) ?
        -1 :
        1
    );



    const pipeline = [
        { $unwind: "$markets" },
        {
            $match: {
                $and: [
                    {
                        "markets.address": params.marketAddress
                    }
                ]
            }
        },
        {
            $sort: {
                "markets.predictionDate": sortOrder
            }
        },
    ]

    const dataPipeline = [
        ...pipeline,
        {
            $project: {
                 _id: 0,
                 address: 1,
                 predictionDate: "$markets.predictionDate",
                 encodedPrediction: "$markets.encodedPrediction",
                 reputationCollectionDate: {
                     $cond: {
                         if: { $ifNull: ['$markets.reputationCollectionDate', false] },
                         then: "$markets.reputationCollectionDate",
                         else: null
                     },
                 },
                 decodedPrediction: {
                     $cond: {
                         if: { $ifNull: ['$markets.decodedPrediction', false] },
                         then: "$markets.decodedPrediction",
                         else: null
                     },
                 },
                 reputation: {
                     $cond: {
                         if: { $ifNull: ['$markets.reputation', false] },
                         then: "$markets.reputation",
                         else: null
                     },
                 }
             }
         },
         {
             $skip: parseInt(params['offset'] || 0)
         },
         {
             $limit: parseInt(params['limit'] || 10)
         }
    ];
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

    const data = await usersCollection.aggregate(
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
    output["data"] = data[0].data
    output["meta"] = data[0].meta[0]
    return output
}