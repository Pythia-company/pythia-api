export const getUserStats = async(db, params) => {
    const marketsCollection = await db.collection("markets");
    const usersCollection = await db.collection("users");

    const minDate = Math.floor(Date.now() / 1000) - 365 * 24 * 3600
    let periodDaysCondition = {}
    if(params['periodDays'] == null){
        periodDaysCondition = {
            $gte: [
                "$resolutionDate",
                minDate
            ]
        }
    }else{
        periodDaysCondition = {
            $gte: [
                "$resolutionDate",
                Math.floor(Date.now() / 1000) - parseInt(params['periodDays']) * 24 * 3600
            ]
        }
    }
    const reputationCondition = {$gt: ["$users.reputation", 0]}

    const resolvedCondition = {
        $eq: ["$status", "resolved"]
    }

    const topicCondition  = {
        $eq: ["$topic", params.topic]
    }
    const numUsers = await usersCollection.count();

    const aggregatedStatQuery =  [
        {
            $unwind: "$users"
        },
        {
            $match: {
                $expr: {
                    $eq: [
                        { $toLower: "$users.address" },
                        params.userAddress.toLowerCase()
                    ]
                }
            }
        },
        {
            $addFields: {
                reputation: {
                    $cond: {
                        if: {
                            $and: [
                                reputationCondition,
                                periodDaysCondition,
                                topicCondition
                            ]
                        },
                        then: "$users.reputation",
                        else: 0
                    }
                },
                correct: {
                    $cond: {
                        if: {
                            $and: [
                                reputationCondition,
                                periodDaysCondition,
                                topicCondition
                            ]
                        },
                        then: 1,
                        else: 0
                    }
                },
                resolved: {
                    $cond: {
                        if: {
                            $and: [
                                periodDaysCondition,
                                topicCondition,
                                resolvedCondition
                            ]
                        },
                        then: 1,
                        else: 0
                    }
                },
                total: {
                    $cond: {
                        if: {
                            $and: [
                                periodDaysCondition,
                                topicCondition
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
                reputation: {
                    $sum: "$reputation"
                },
                correct: {
                    $sum: "$correct"
                },
                resolved: {
                    $sum: "$resolved"
                },
                totalPredictions: {
                    $sum: "$total"
                }
            }
        },
        {
            $setWindowFields: {
               partitionBy: "",
               sortBy: { reputation: -1 },
               output: {
                  rank: {
                     $rank: {}
                  }
               }
            }
        },
        { $match: { _id: { $eq: params.userAddress} } },
        {
            $project: {
                _id: 0,
                address: "$_id",
                percentile: {
                    $subtract: [
                        1,
                        {
                            $cond: {
                                if: {
                                    $gt: [numUsers, 0]
                                },
                                then: {
                                    $divide: [
                                        "$rank",
                                        numUsers
                                    ]
                                },
                                else:0
                            }
                        }
                    ]
                },
                accuracy: {
                    $cond: { 
                        if: {
                            $gt: ["$resolved", 0]
                        },
                        then: {
                            $divide: ["$correct", "$resolved"]
                        },
                        else: 0
                    }
                },
                reputation: 1,
                totalPredictions: 1
            }
        }
    ];
    const aggregatedStats = (
        await marketsCollection.aggregate(
            aggregatedStatQuery
        ).toArray()
    )[0];
    if(aggregatedStats == null){
        return null
    }

    const chartsQuery = [
        {
            $unwind: "$users"
        },
        {
            $match: {
                $and: [
                    {
                        "users.address": {
                            $eq: params.userAddress
                        }
                    },
                    {
                        "topic": {
                            $eq: "defi"
                        }
                    },
                    {
                        "resolutionDate": {
                            $gte: minDate
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                day: {
                    $toInt: {
                        $divide: [
                            "$resolutionDate",
                            24 * 3600
                        ]
                    }
                },
                reputation: {
                    $cond: {
                        if: {
                            $and: [
                                {
                                    $eq: ["$users.reputation", null]
                                },
                                resolvedCondition
                            ] 
                        },
                        then: 0,
                        else: "$users.reputation"
                    }
                }
            }
        },
        {
            $group: {
                _id: "$day",
                reputation: {
                    $sum: "$reputation"
                }
            }
        },
        {
            $project: {
                _id: 0,
                key:  {
                    $multiply: [
                        "$_id",
                        24 * 3600
                    ]
                },
                value: "$reputation"
            }
        },
        {
            $sort:{key:1}
        }
    ]
    const chartStats = (
        await marketsCollection.aggregate(
            chartsQuery
        ).toArray()
    );
    aggregatedStats['chart'] = chartStats;
    return {
        "data": aggregatedStats,
        "meta": {}
    };
}