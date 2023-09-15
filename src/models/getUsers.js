export const getUsers = async(db, params) => {
    const marketsCollection = await db.collection("markets");
    

    let dateCondition = {}
    if(params['periodDays'] != null){
        dateCondition = {
            "resolutionDate":{
                $gte: Math.floor(Date.now() / 1000) - parseInt(params['periodDays']) * 24 * 3600
            }
        }
    }
    const topicCondition = {"topic": params.topic}
    
    const reputationCondition = {
        $gt: ["$users.reputation", 0]
    }

    const resolvedCondition = {"status": "resolved"}


    const pipeline =  [
        {
            $unwind: "$users"
        },
        {
            $match: {
                $and: [resolvedCondition, dateCondition, topicCondition]
            }
        },
        {
            $addFields: {
                reputation: {
                    $cond: { 
                        if: reputationCondition,
                        then: "$users.reputation",
                        else: 0
                    }
                },
                correctMarkets: {
                    $cond: { 
                        if: {
                            $eq: [
                                "$users.decodedPrediction",
                                "$answer"
                            ]
                        },
                        then: 1,
                        else: 0
                    }
                },
                limit: parseInt(params['limit'] || 10),
                offset: parseInt(params['offset'] || 0)
            }
        },
        {
            $group: {
                _id: "$users.address",
                correctMarkets: {
                    $sum: "$correctMarkets"
                },
                reputation: {
                    $sum: "$reputation"
                },
                totalMarkets: {
                    $sum: 1
                },
                limit: {
                    $max: "$limit",
                },
                offset: {
                    $max: "$offset",
                }
            }
        }
    ];

    const dataPipeline = [
        ...pipeline,
        {
            $project: {
                _id: 0,
                address: "$_id",
                accuracy: {
                    $cond: {
                        if: {$eq: ["$totalMarkets", 0]},
                        then: 0,
                        else:  {
                            $round: [
                                {
                                    $multiply: [
                                        {$divide: ["$correctMarkets", "$totalMarkets"]},
                                        100
                                    ]
                                },
                                2     
                            ]
                        }
                    }
                },
                reputation: {
                    $round: [
                        "$reputation", 3
                    ]
                }
            }
        },
        {
            $sort: {
                accuracy: -1,
                accuracy: -1,
                totalMarkets: 1
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
    output["data"] = data[0].data
    output["meta"] = data[0].meta[0]
    return output
}