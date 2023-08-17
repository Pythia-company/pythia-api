export const getUser = async(db, params) => {
    const usersCollection = await db.collection("users");

    return (
        await usersCollection.aggregate([
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
                description: { $ifNull: [ "$description", "null" ] },
                status:1,
                registrationDate: 1,
                nextSubscriptionPayDate: { $ifNull: [ "$nextSubcriptionPayDate", "null" ] },
                subscriptionAmountDue: { $ifNull: [ "$nextSubcriptionAmountDue", "null" ] },
            }
        }
        ])
        .toArray()
    )[0];
}