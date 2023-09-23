export const getUser = async(db, params) => {
    const usersCollection = await db.collection("users");

    const data = (
        await usersCollection.aggregate([
        {
            $match: {
                $and: [
                    {
                        $expr: {
                            $eq: [
                              { $toLower: "$address" },
                              params.userAddress.toLowerCase()
                            ]
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                address: 1,
                description: { $ifNull: [ "$description", "null" ] },
                status:1,
                registrationDate: 1,
                nextSubcriptionPayDate: { $ifNull: [ "$nextSubcriptionPayDate", "null" ] },
                nextSubcriptionAmountDue: { $ifNull: [ "$nextSubcriptionAmountDue", "null" ] },
            }
        }
        ])
        .toArray()
    );
    if(data.length === 0){
        return null
    }
    return {
        "data": data[0],
        "meta": {}
    }
}