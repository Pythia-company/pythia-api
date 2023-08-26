export const getUsers = async(db, params) => {
    const usersCollection = await db.collection("markets");
    

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


    const aggregateQuery =  [
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
                }
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
                }
            }
        },
        {
            $project: {
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
    ];
    return await usersCollection.aggregate(
        aggregateQuery
    ).toArray();
}