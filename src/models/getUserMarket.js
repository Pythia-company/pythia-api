export const getUserMarket = async(db, params) => {
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

    const results = (
        await usersCollection.aggregate([
            { $unwind: "$markets" },
            {
                $match: {
                    $and: [
                        {
                            "address": params.userAddress
                        }
                    ]
                }
            },
            {
            $project: {
                    _id: 0,
                    predictionDatetime: "$markets.predictionDatetime",
                    encodedPrediction: "$markets.encodedPrediction",
                    reputationCollectionDateTime: {
                        $cond: {
                            if: { $ifNull: ['$markets.reputationCollectionDateTime', false] },
                            then: "$markets.reputationCollectionDateTime",
                            else: null
                        },
                    },
                    decodedPrediction: {
                        $cond: {
                            if: { $ifNull: ['$markets.decodedPrediction', false] },
                            then: "$markets.decodedPrediction",
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
            }
     ])
     .toArray()
     );

     if(results.length === 0){
        return {
            'predictionDatetime': null,
            'encodedPrediction': null,
            'reputationCollectionDateTime': null,
            'decodedPrediction': null,
            'reputation': null,
            'correct': null
        }
    }else{
        return results[0];
    }
}