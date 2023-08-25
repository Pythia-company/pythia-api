export const getMarketUsers = async(db, params) => {
    const usersCollection = await db.collection("users");

    const sortOrder = (
        (
            (params['order'] == null) ||
            (params['order'] === 'desc')
        ) ?
        -1 :
        1
    );



    return await usersCollection.aggregate([
        { $unwind: "$markets" },
        {
            $match: {
                $and: [
                    {
                        "markets.address": params.marketAddress
                    }
                ]
            }
        },
        {
            $sort: {
                "markets.predictionDate": sortOrder
            }
        },
        {
           $project: {
                _id: 0,
                address: 1,
                predictionDate: "$markets.predictionDate",
                encodedPrediction: "$markets.encodedPrediction",
                reputationCollectionDate: {
                    $cond: {
                        if: { $ifNull: ['$markets.reputationCollectionDate', false] },
                        then: "$markets.reputationCollectionDate",
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