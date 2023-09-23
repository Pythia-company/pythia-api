export const getUserMarket = async(db, params) => {
    const marketCollection = await db.collection("markets");

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
            $expr: {
                $eq: [
                  { $toLower: "$address" },
                  params.marketAddress.toLowerCase()
                ]
            }
        },
        {
            $expr: {
                $eq: [
                  { $toLower: "$users.address" },
                  params.userAddress.toLowerCase()
                ]
            }
        }
    );

    let data = (
        await marketCollection.aggregate([
            { $unwind: "$users" },
            {
                $match: {
                    $and: matchParams
                }
            },
            {
            $project: {
                    _id: 0,
                    predictionDate: "$users.predictionDate",
                    predictionTransactionHash: {
                        $cond: {
                            if: { $ifNull: ["$users.predictionTransactionHash", false] },
                            then: "$users.predictionTransactionHash",
                            else: null
                        }
                    },
                    encodedPrediction: "$users.encodedPrediction",
                    reputationCollectionDate: {
                        $cond: {
                            if: { $ifNull: ['$users.reputationCollectionDate', false] },
                            then: "$users.reputationCollectionDate",
                            else: null
                        },
                    },
                    decodedPrediction: {
                        $cond: {
                            if: { $ifNull: ['$users.decodedPrediction', false] },
                            then: "$users.decodedPrediction",
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
            }
        ])
        .toArray()
    );

     
    if(data.length === 0){
        data = [
            {
            'predictionDate': null,
            "predictionTransactionHash": null,
            'encodedPrediction': null,
            'reputationCollectionDate': null,
            'decodedPrediction': null,
            'reputation': null,
            'correct': null
            }
        ]
    }
    return {
        "data": data[0],
        "meta": {}
    }
}