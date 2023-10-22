import {
    transformSortParams
} from "../utils/utils.js";

export const getMarkets = async(db, params) => {
    if(params == null){
        params = {}
    }
    const marketsCollection = await db.collection("markets");
    const matchParams = []
    params.userAddress = params.userAddress || ""


    Object.entries(params).forEach(([parameter, value]) => {
        if(parameter === "topics"){
            matchParams.push(
                {
                    "topic" : {
                        $in: value
                    }
                }
            )
        }else if(parameter === "createdAfter"){
            matchParams.push(
                {
                    "creationDate" : {
                        $gte: parseInt(value)
                    }
                }
            )
        }else if(parameter === "wageDeadlineAfter"){
            matchParams.push(
                {
                    "wageDeadline" : {
                        $gte: parseInt(value)
                    }
                }
            )
        }else if(parameter === "resolvesAfter"){
            matchParams.push(
                {
                    "resolutionDate" : {
                        $gte: parseInt(value)
                    }
                }
            )
        }else if(parameter === "status"){
            matchParams.push(
                {
                    "status" : value
                }
            )
        }else if(parameter === "questionPattern"){
            matchParams.push(
                {
                    "question": {$regex: value, $options: "i" }
                }
            )
        }
    });
    if(params['sort'] == null){
        params['sort'] = {}
    }
    if(params['sort']['wageDeadline'] == null){
        params['sort']['wageDeadline'] = 'asc'
    }
    if(params['sort']['resolutionDate'] == null){
        params['sort']['resolutionDate'] = 'asc'
    }
    if(params['sort']['numOfPredictors'] == null){
        params['sort']['numOfPredictors'] = 'asc'
    }

    const pipeline = []
    if(matchParams.length > 0){
        pipeline.push(
            {
                $match: {
                    $and: matchParams
                }
            },
        )
    }
  
    const dataPipeline = [
        ...pipeline,
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
                },
                payload: {
                    "predicted": {
                        $cond: [
                            { $in: [params.userAddress.toLowerCase(), "$users.address"] },
                            true,
                            false
                        ]
                    }
                }
            }
        },
        {
            $sort: transformSortParams(params['sort'])
        },
        {
            $skip: parseInt(params['offset'] || 0)
        },
        {
            $limit: parseInt(params['limit'] || 10)
        }
    ]

    const metaPipeline = [
        ...pipeline,
        {
            $addFields: {
                "limit": parseInt(params['limit'] || 10),
                "offset": parseInt(params['offset'] || 0),
            }
        },
        {
            $group: {
                _id: null,
                numObjects: { 
                    $sum: 1
                },
                "limit": {$max: "$limit"},
                "offset": {$max: "$offset"},
            } 
        },
        {
            $project: {
                "_id": 0,
                "limit": 1,
                "offset": 1,
                "numObjects": 1
            }
        }
    ]



    const data = await marketsCollection.aggregate(
        [
            {
                $facet: {
                    "data": dataPipeline,
                    "meta": metaPipeline
                }
        
            }
        ]
    ).toArray()
    const output = {"data": [], "meta": {}}
    if(data[0].data.length === 0){
        return {
            "data": [],
            "meta": {
                "limit": parseInt(params['limit'] || 10),
                "offset": parseInt(params['offset'] || 0),
                "numObjects": 0
            }
        }
    }
    output["data"] = data[0].data
    output["meta"] = data[0].meta[0]
    return output
}