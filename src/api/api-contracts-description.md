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
                "type": "integer",
            }
            "resolutionDate": {
                "type": "integer",
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
                    "predictionDate": {
                        "type": "integer",
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
                    "reputationCollectionDate": {
                        "type": "integer",
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
        "type": "integer"
        "default": null
    },
    "subcriptionInitDate": {
        "type": "integer"
        "default": null
    },
    "nextSubcriptionPayDate": {
        "type": "integer"
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
            "predictionDate": {
                "type": "integer",
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
            "reputationCollectionDate": {
                "type": "integer",
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

