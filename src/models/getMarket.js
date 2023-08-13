export const getMarket = async(db, params) => {
    const marketsCollection = await db.collection("markets");

    const aggregateParams = [
        {
            $match: {
                address: params.marketAddress
            }
        },
        {
            $project: {
                _id: 0,
                address: 1,
                question: 1,
                creationDate: 1,
                wageDeadline: 1,
                resolutionDate: 1,
                topic: 1,
                reputationTokenAddress:1,
                options: 1,
                status: 1,
                answer: {
                    $cond: {
                        if: { $ifNull: ['$answer', false] },
                        then: "$answer",
                        else: null
                    },
                },
                numOfPredictors: {
                    $cond: {
                        if: { $ifNull: ['$users', false] },
                        then: {
                            $size: "$users"
                        },
                        else: 0
                    },
                }
            }
        }
    ]
    const output =  (
        await marketsCollection.aggregate(aggregateParams).toArray()
    )[0]
    return output
}