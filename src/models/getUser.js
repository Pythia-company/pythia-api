export const getUser = async(db, params) => {
    const usersCollection = await db.collection("users");

    return await usersCollection.aggregate([
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
                address: 1,
                description: 1,
                status:1,
                registrationDate: 1,
                nextSubcriptionPayDate: 1,
                nextSubcriptionAmountDue: 1
            }
        }
     ])
     .toArray();
}