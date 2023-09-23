export const getUserMarkets = async(db, params) => {
    const marketsCollection = await db.collection("markets");

    const sortOrder = (
        (
            (params['order'] == null) ||
            (params['order'] === 'desc')
        ) ?
        -1 :
        1
    );

    const matchParams = [];
    matchParams.push(
        {
            $expr: {
                $eq: [
                  { $toLower: "$users.address" },
                  params.userAddress.toLowerCase()
                ]
            }
        }
    );
    if(params['topics'] != null){
        matchParams.push(
            {
                "topic" : {
                    $in: params['topics']
                }
            }
        )
    }
    if(params['resolved'] == true){
        matchParams.push(
            {
                "status": "resolved"
            }
        )
    }
    if(params['receivedReward'] != null){
        matchParams.push(
            {
                "users.reputation": {$ne : null}
            }
        )
    }

    const pipeline = [
        {
            $unwind: "$users"
        },
        {
            $match: {
                $and: matchParams
            }
        }
    ]

    const dataPipeline = [
        ...pipeline,
        {
            $project: {
                 _id: 0,
                 address: "$address",
                 question: "$question",
                 creationDate: "$creationDate",
                 wageDeadline: "$wageDeadline",
                 resolutionDate: "$resolutionDate",
                 topic: "$topic",
                 reputationTokenAddress: "$reputationTokenAddress",
                 options: "$options",
                 status: "$status",
                 answer: {
                     $cond: {
                         if: { $ifNull: ['$answer', false] },
                         then: "$answer",
                         else: null
                     },
                 },
                 reputation: {
                     $cond: {
                         if: { $ifNull: ['$users.reputation', false] },
                         then: "$users.reputation",
                         else: null
                     },
                 },
                 correct: {
                     $cond: {
                         if: {
                             $and: [
                                 {$eq:["$users.decodedPrediction", "$answer"]},
                                 { $ifNull: ['$users.decodedPrediction', false]}
                             ]
                         },
                         then: true,
                         else: false
                     },
                 }
             }
         },
         {
            $sort: {
                "users.predictionDate": sortOrder
            }
         },
         {
            $skip: parseInt(params['offset'] || 0)
         },
         {
            $limit: parseInt(params['limit'] || 10)
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