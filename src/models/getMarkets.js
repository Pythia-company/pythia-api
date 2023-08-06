import {
    transformSortParams
} from "../utils/utils.js";

export const getMarkets = async(db, params) => {
    const marketsCollection = await db.collection("markets");
    const matchParams = []
    Object.entries(params).forEach(([parameter, value]) => {
        if(parameter === "topic"){
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
                    "creationDatetime" : {
                        $gte: value
                    }
                }
            )
        }else if(parameter === "wageDeadlineAfter"){
            matchParams.push(
                {
                    "wageDeadline" : {
                        $gte: value
                    }
                }
            )
        }else if(parameter === "resolvesAfter"){
            matchParams.push(
                {
                    "resolutionDate" : {
                        $gte: value
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
                    "question": {
                        $text: {
                            $search: value,
                            $caseSensitive: false
                        } 
                    }
                }
            )
        }
    });
    if(params['sort'] == null){
        params['sort'] = {}
    }
    console.log(`params of sort: ${params['sort'] == null}`);
    if(params['sort']['wageDeadline'] == null){
        params['sort']['wageDeadline'] = 'asc'
    }
    if(params['sort']['resolutionDate'] == null){
        params['sort']['resolutionDate'] = 'asc'
    }
    if(params['sort']['numOfPredictors'] == null){
        params['sort']['numOfPredictors'] = 'asc'
    }


    return await marketsCollection.aggregate(
            [
                {
                    $match: {
                        $and: matchParams
                    }
                },
                {
                    $project: {
                        _id: 0,
                        address: 1,
                        question: 1,
                        creationDatetime: 1,
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
                },
                {
                    $sort: transformSortParams(params['sort'])
                },
                {
                    $skip: params['offset'] || 0
                },
                {
                    $limit: params['limit'] || 10
                }
            ]
        )
        .toArray()
}