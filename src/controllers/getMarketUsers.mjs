export const getMarketUsers = async(db, params) => {
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
                "markets.predictionDatetime": sortOrder
            }
        },
        {
           $project: {
                _id: 0,
                address: 1,
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