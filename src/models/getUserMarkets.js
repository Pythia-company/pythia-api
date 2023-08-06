export const getUserMarkets = async(db, params) => {
    const usersCollection = await db.collection("users");

    const offset = params['offset'] || 0
    const limit = params['limit'] || 10
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
            "address": params.userAddress
        }
    );
    if(params['resolved'] == true){
        matchParams.push(
            {
                "markets.status": "resolved"
            }
        )
    }
    if(params['receivedReward'] != null){
        matchParams.push(
            {
                "reputation": {$ne : null}
            }
        )
    }




    return await usersCollection.aggregate([
        {
            $match: {
                $and: matchParams
            }
        },
        {
            $sort: {
                "markets.predictionDatetime": sortOrder
            }
        },
        {
           $project: {
                _id: 0,
                address: "$markets.address",
                question: "$markets.question",
                creationDatetime: "$markets.creationDatetime",
                wageDeadline: "$markets.wageDeadline",
                resolutionDate: "$markets.resolutionDate",
                topic: "$markets.topic",
                reputationTokenAddress: "$markets.reputationTokenAddress",
                options: "$markets.options",
                status: "$markets.status",
                answer: {
                    $cond: {
                        if: { $ifNull: ['$markets.answer', false] },
                        then: "$markets.answer",
                        else: null
                    },
                },
                reputation: {
                    $cond: {
                        if: { $ifNull: ['$markets.reputation', false] },
                        then: "$markets.reputation",
                        else: null
                    },
                },
                correct: {
                    $cond: {
                        if: {
                            $and: [
                                {$eq:["$markets.decodedPrediction", "$markets.answer"]},
                                { $ifNull: ['$markets.decodedPrediction', false]}
                            ]
                        },
                        then: true,
                        else: false
                    },
                }
            }
        },
        {
            $skip: offset
        },
        {
            $limit: limit
        }
     ])
     .toArray();
}