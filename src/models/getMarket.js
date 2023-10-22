export const getMarket = async(db, params) => {
    const marketsCollection = await db.collection("markets");

    const aggregateParams = [
        {   
            $match: {
                $expr: {
                    $eq: [
                      { $toLower: "$address" },
                      params.marketAddress.toLowerCase()
                    ]
                }
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
                answer: 1,
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
    const data =  (
        await marketsCollection.aggregate(aggregateParams).toArray()
    )
    if(data.length === 0){
        return null
    }
    return {
        "data": data[0],
        "meta": {}
    }
}