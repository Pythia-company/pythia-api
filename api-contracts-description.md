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

# 1. API endpoints

## Описание эндпоинтов api

## 1. Выдача рынков для предсказания (как на титульной странице)

### 1.1. Описание параметров запроса

```javascript
{ 
    "from": {
        "type": "datetime"
        "default": now - 90 days
    }
    "to": {
        "type": "datetime"
        "default": now
    }
    "topic": {
        "type": "string",
        "default": null
    }
    "showResolved": {
        "type": "bool"
        "defualt": false
    }
    "orderBy": {
        "type": string,
        "default": "resolutionDate"
    }
}
```

### 1.2. Описание выдачи

```javascript
[
    {
        "type": "object",
        "properties": [
            "address": {
                "type": "hex",
                "default": null
            },
            "question":  {
                "type": "string",
                "default": null
            },
            "wageDeadline": {
                "type": "date",
                "default": null
            }
            "resolutionDate": {
                "type": "date",
                "default": null
            },
            "topic":  {
                "type": "string",
                "default": null
            },
            "reputationTokenAddress": {
                "type": "hex",
                "default": null
            },
            "answerChoices": {
                "type": "array[string]"
                "default": null
            }
            "resolved": {
                "type": "bool",
                "default": false
            }
        ]
    }
]
```

## 2. запросить топовых предсказателей

### 2.1. Описание параметров запроса

```javascript
{ 
    "from": {
        "type": "datetime"
        "default": now - 90 days
    }
    "topic": {
        "type": "string",
        "default": null
    },
    "orderBy": {
        "type": string,
        "default": "reputation"
    }
}
```

### 2.2. Описание выдачи

```javascript
[
    {
        "type": "object",
        "properties": [
            "address": {
                "type": "hex",
                "default": null
            },
            "description":  {
                "type": "string",
                "default": null
            },
            "registrationDate": {
                "type": "date"
                "default": null
            },
            "accuracy": {
                "type": "float",
                "default": 0.0,
            },
            "reputation": {
                "type": "float",
                "default": 0.0,
            },
            "numMarketsParticipated": {
                "type": "int",
                "default": 0,
            }
        ]
    }
]
```

## 3. запросить информацию по профилю пользователя

### 3.1. Описание параметров запроса

```javascript
{ 
    "address": {
        "type": "hex",
        "default": null
    },
    "from": {
        "type": "datetime"
        "default": now - 90 days
    }
    "topic": {
        "type": "string",
        "default": null
    }
}
```

### 3.2. Описание выдачи

```javascript
{
    "type": "object",
    "properties": [
        "address": {
            "type": "hex",
            "default": null
        },
        "description":  {
            "type": "string",
            "default": null
        },
        "registrationDate": {
            "type": "date"
            "default": null
        },
        "accuracy": {
            "type": "float",
            "default": 0.0,
        },
        "reputation": {
            "type": "float",
            "default": 0.0,
        },
        "numMarketsParticipated": {
            "type": "int",
            "default": 0,
        },
        "markets": {
            "type": "array",
            "elements": [
                {
                    "type": "object",
                    "properties": [
                        "date": {
                            "type": "date",
                            "default": null,
                        },
                        "reputation": {
                            "type": "int",
                            "default": 0,
                        }
                    ]
                }
            ]
        }
    ]
}

```
