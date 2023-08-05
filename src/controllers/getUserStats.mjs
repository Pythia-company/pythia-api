export const getUserStats = async(db, params) => {
    const usersCollection = await db.collection("users");

    let minPeriod = null
    let periodDaysCondition = {}
    if(params['periodDays'] == null){
        minPeriod = Math.floor(Date.now() / 1000) - 180 * 24 * 3600
        periodDaysCondition = {
            $gte: [
                "$markets.resolutionDate",
                Math.floor(Date.now() / 1000) - 180 * 24 * 3600
            ]
        }
    }else{
        periodDaysCondition = {
            $gte: [
                "$markets.resolutionDate",
                Math.floor(Date.now() / 1000) - params['periodDays'] * 24 * 3600
            ]
        }
    }
    const reputationCondition = {$gt: ["$markets.reputation", 0]}

    const resolvedCondition = {
        $eq: ["$markets.resolved", true]
    }

    const topicCondition  = {
        $eq: ["$markets.topic", params.topic]
    }
    const addressCondition = {
        $eq: ["$address", params.userAddress]
    }
    const numUsers = await usersCollection.count();

    const aggregatedStatQuery =  [
        {
            $unwind: "$markets"
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
                        then: "$markets.reputation",
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
                _id: "$address",
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
                    $toInt: {
                        $multiply: [
                            100,
                            {
                                $subtract: [
                                    1,
                                    {
                                        $divide: [
                                            "$rank",
                                            numUsers
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                },
                accuracy: {
                    $divide: ["$correct", "$resolved"]
                },
                reputation: 1,
                totalPredictions: 1
            }
        }
    ];
    const aggregatedStats = (
        await usersCollection.aggregate(
            aggregatedStatQuery
        ).toArray()
    )[0];

    const chartsQuery = [
        {
            $match: {
                $and: [
                    {
                        "address": {
                            $eq: params.userAddress
                        }
                    },
                    {
                        "markets.topic": {
                            $eq: "defi"
                        }
                    },
                    {
                        "markets.resolutionDate": {
                            $gte: minPeriod
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$markets"
        },
        {
            $addFields: {
                day: {
                    $toInt: {
                        $divide: [
                            "$markets.resolutionDate",
                            24 * 3600
                        ]
                    }
                },
                reputation: {
                    $cond: {
                        if: {
                            $and: [
                                {
                                    $eq: ["$markets.reputation", null]
                                },
                                resolvedCondition
                            ] 
                        },
                        then: 0,
                        else: "$markets.reputation"
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
        }
    ]

    const chartStats = (
        await usersCollection.aggregate(
            chartsQuery
        ).toArray()
    );
    aggregatedStats['chart'] = chartStats;
    return aggregatedStats;
}