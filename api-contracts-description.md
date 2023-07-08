# 1. Entities stored in Mongo

###  Ниже описания формата, в котором храняться данные в базе данных MongoDB

## Market: 
```javascript
    {
        "schema": "markets",
        "properties": [
            "address": {
                "type": "hex",
            },
            "question":  {
                "type": "string",
            },
            "wageDeadline": {
                "type": "date-time",
            }
            "resolutionDate": {
                "type": "date-time",
            },
            "topic":  {
                "type": "string",
            },
            "reputationTokenAddress": {
                "type": "hex",
            },
            "options": {
                "type": "array[string]"
            },
            "status": {
                "type": "string",
                "enum": ["inprogress", "unresolved", "resolved"]
            },
            "answer": {
                "type": int,
                "default": null
            },
            "users": {
                "type": "array",
                "properties": [
                    "address": {
                        "type": "hex",
                        "default": null
                    },
                    "predictionDateTime": {
                        "type": "datetime",
                        "default": null,
                    },
                    "encodedPrediction": {
                        "type": "hex",
                        "default": null,
                    },
                    "decodedPrediction": {
                        "type": "int",
                        "default": null,
                    },
                    "reputationCollectionDateTime": {
                        "type": "datetime",
                        "default": null,
                    },
                    "reputation": {
                        "type": "float",
                        "default": 0
                    }
                ]
            }
        ]
    }
```

## User
```javascript
{   "schema": "users",
    "address": {
        "type": "hex",
        "default": null
    },
    "description":  {
        "type": "string",
        "default": null
    },
    "status": {
        "type": "int"
        "default": "0"
    },
    "registrationDate": {
        "type": "date"
        "default": null
    },
    "subcriptionInitDate": {
        "type": "date"
        "default": null
    },
    "nextSubcriptionPayDate": {
        "type": "date"
        "default": null
    },
    "subscriptionAmountDue": {
        "type": "float",
        "default": null
    },
    "markets": {
        "type": "array",
        "properties": [
            "address": {
                "type": "hex",
                "default": null
            },
            "predictionDateTime": {
                "type": "datetime",
                "default": null,
            },
            "encodedPrediction": {
                "type": "hex",
                "default": null,
            },
            "decodedPrediction": {
                "type": "int",
                "default": null,
            },
            "reputationCollectionDateTime": {
                "type": "datetime",
                "default": null,
            },
            "reputation": {
                "type": "float",
                "default": 0
            }
        ]
    }
}
```

## Reputation tokens
```javascript
{   "schema": "tokens",
    "address": {
        "type": "hex",
        "default": null
    },
    "topic":  {
        "type": "string",
        "default": null
    }
}
```

## Subscription
```javascript
{   "schema": "subscriptions",
    "address": {
        "type": "hex",
        "default": null
    },
    "description":  {
        "type": "string",
        "default": null
    }
}
```

