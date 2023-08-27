export const getUserMarkets = async(db, params) => {
    const usersCollection = await db.collection("markets");

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
            "users.address": params.userAddress
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




    return await usersCollection.aggregate([
        {
            $unwind: "$users"
        },
        {
            $match: {
                $and: matchParams
            }
        },
        {
            $sort: {
                "users.predictionDate": sortOrder
            }
        },
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
            $skip: parseInt(params['offset'] || 0)
        },
        {
            $limit: parseInt(params['limit'] || 10)
        }
     ])
     .toArray();
}