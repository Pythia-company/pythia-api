export const getUsers = async(db, params) => {
    const usersCollection = await db.collection("users");
    
    const offset = params['offset'] || 0
    const limit = params['limit'] || 10

    let dateCondition = {}
    if(params['periodDays'] != null){
        dateCondition = {
            $gte: [
                "$$markets.resolutionDate",
                Math.floor(Date.now() / 1000) - params['periodDays'] * 24 * 3600
            ]
        }
    }
    const reputationCondition = {
        $gt: ["$$markets.reputation", 0]
    }

    const aggregateQuery =  [
        {
            $addFields: {
                reputation: {
                    $filter: {
                        input: "$markets",
                        as: "markets",
                        cond: {
                            $and: [
                                dateCondition,
                                reputationCondition
                            ]
                        }
                    }
                },
                totalMarkets: {
                    $size: {
                        $filter: {
                            input: "$markets",
                            as: "markets",
                            cond: {
                                $and: [
                                    dateCondition
                                ]
                            }
                        }
                    }
                },
                correctMarkets: {
                    $size: {
                        $filter: {
                            input: "$markets",
                            as: "markets",
                            cond: {
                                $and: [
                                    dateCondition,
                                    reputationCondition
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                address: 1,
                reputation: {
                    $sum: "$markets.reputation"
                },
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
            $skip: offset
        },
        {
            $limit: limit
        }
    ];
    return await usersCollection.aggregate(
        aggregateQuery
    ).toArray();
}