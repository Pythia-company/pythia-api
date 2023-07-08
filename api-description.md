


# Описание эндпоинтов api по стандарту openapi: 3.0.1


```yaml
openapi: 3.0.1
info:
  version: "1.0.0"
  title: Pythia-API
  description: Pythia API
servers:
  - description: Pythia application
    url: https://api.pythia.company/
```

## 1. /markets
```yaml
get: 
    summary: available markets
    description: returns list of markets available for prediction
    produces:
        - application/json
    parameters:
        - name: topics
            in: query
            schema:
                type: array
                items:
                    string
                    enum: [nft, defi, trading]
                description: market topics
            required: false
        - name: createdAfter
            in: query
            schema:
                type: string
                description: filter on date when market was created
            required: false
        - name: wageDeadlineAfter
            in: query
            schema:
                type: string
                description: filter on date when the prediction deadline for the market
            required: false
        - name: resolvesAfter
            in: query
            schema:
                type: string
            required: false
        - name: status
            in: query
            schema:
                type: string
                enum: [inprogress, unresolved, resolved]
                description: status of the market
            required: false
        - name: questionPattern
            in: query
            schema:
                type: string
                description: question pattern (used in search form)
            required: false
        - name: address
            in: query
            schema:
                type: string
                description: user address
            required: false
        - sort:
            schema:
                type: object
                parameters:
                    wageDeadline: 
                        type: string
                        enum: [asc, desc]
                        default: null
                    resolutionDate: 
                        type: string
                        enum: [asc, desc]
                        default: null
                    numOfPredictors:
                        type: string
                        enum: [asc, desc]
                        default: null
            required: false
        - name: limit
            in: query
            schema:
                type: int
                min: 10
                max: 100
                default: 30
            required: true
    responses:
        description: A list of markets
        produces:
            - application/json
        schema:
            status: int
            data:
                type: array
                items: 
                    type: object
                    properties:
                        address: string
                        question: string,
                        creationDatetime: string
                        wageDeadline: string
                        resolutionDate: string
                        topic: string
                        reputationTokenAddress: string
                        options: 
                            type: array
                            items: 
                                string
                        status: 
                            type: string
                            enum: ["inprogress", "unresolved", "resolved"]
                        answer:
                            type: string
                            default: null
                        numOfPredictors: int      
                        userInfo: 
                            type: object
                            default: null
                            properties:
                                address: bool
                                description: whether user has predicted for this market
```
## Примеры

### Request
```
https://api.pythia.company/markets/?topics[]=nft&wageDeadlineAfter=2023-08-01T01:00:00.000Z&limit=10&sort[numOfPredictors]=desc
```
### Response
```javascript
[
    {
        "status": 200,
        "data": [
            {
                "address": "0xFfeEcd85edF58666AEb95Cc2EFA855DA62E6ea56"
                "question": "will btc/usd exceed 40000$?"
                "creationDatetime": "2023-04-01T01:00:00.000Z"
                "wageDeadline": "2023-08-01T01:00:00.000Z"
                "resolutionDate": "2023-07-10T01:00:00.000Z"
                "topic": "trading"
                "reputationTokenAddress": "0x1"
                "options": ["No", "Yes"]
                "status": "inprogress"
                "answer": null
                "numOfPredictors": 1000      
                "userInfo": {
                    "0x4": false
                }
            }
        ]
    }
]
```

## 1. /markets/{address}
```yaml
get: 
    summary: information about the market
    description: returns list of markets available for prediction
    produces:
        - application/json
    parameters:
        - name: address
            in: path
            schema:
                type: string
                description: address of the market
            required: true
        - name: predictions
            schema:
                type: int
                description: get last n predictions
                default: 10
            required: false
        - name: user
            schema:
                type: string
                description: user address
            required: false
    responses:
        description: info about the market
        produces:
            - application/json
        schema:
            status: int
            data:
                type: object
                properties:
                    address: string
                    question: string,
                    creationDatetime: string
                    wageDeadline: string
                    resolutionDate: string
                    topic: string
                    reputationTokenAddress: string
                    options: 
                        type: array
                        items: 
                            string
                    status: 
                        type: string
                        enum: ["inprogress", "unresolved", "resolved"]
                    answer:
                        type: string
                        default: null
                    numOfPredictors: int      
                    predictions: 
                        type: array
                        items:
                            type: object
                            properties:
                                address: string
                                encodedPrediction: string
                    user:
                        type: object
                        default: null
                        properties:
                            address: string
                            encodedPrediction: 
                                type: string
                                default: null
                                description: users description for this market
```
## Примеры

### Request
```
https://api.pythia.company/markets/0x1?predictions=10&user=0x2
```
### Response
```javascript
[
    {
        "status": 200,
        "data": [
            {
                "address": "0xFfeEcd85edF58666AEb95Cc2EFA855DA62E6ea56"
                "question": "will btc/usd exceed 40000$?"
                "creationDatetime": "2023-04-01T01:00:00.000Z"
                "wageDeadline": "2023-08-01T01:00:00.000Z"
                "resolutionDate": "2023-07-10T01:00:00.000Z"
                "topic": "trading"
                "reputationTokenAddress": "0x1"
                "options": ["No", "Yes"]
                "status": "inprogress"
                "answer": null
                "numOfPredictors": 1000      
                "predictions": [
                    {
                        "0x1": "0x567"
                    }
                ]
                "user": {
                    "address": "0x2",
                    "encodedPredicion": "0x445646"
                }

            }
        ]
    }
]

```


## 1. /users
```yaml
get: 
    summary: users
    description: returns users
    parameters:
        - name: topic
            in: query
            schema:
                type: string
                description: filter on date when market was created
            required: false
        - name: from
            in: query
            schema:
                type: string
                description: date from which to get data
            required: false
        - limit: 
            in: query
            schema:
                type: int
                min: 1
                max: 100
            required: false
        - sort: 
            in: query
            schema:
                type: object
                parameters:
                    reputation: 
                        type: string
                        enum: [asc, desc]
                    accuracy:
                        type: string
                        enum: [asc, desc]
            required: false
    responses:
        description: A list of users
        produces:
            - application/json
        schema:
            status: int
            data:
                type: array
                items: 
                    type: object
                    properties:
                        address: string
                        registrationDatetime: string
                        accuracy: float
                        reputation: float
```
## Примеры

### Request
```
https://api.pythia.company/users/?topics[]=nft&sort[accuracy]=asc&limit=20
```
### Response
```javascript
[
    {
        "status": 200,
        "data": [
            {
                "address": "0xFfeEcd85edF58666AEb95Cc2EFA855DA62E6ea56"
                "registrationDatetime": "2023-04-01T01:00:00.000Z"
                "accuracy": 0.8,
                "reputation": 10.1
            }
        ]
    }
]

```

## 1. /users/{address}
```yaml
get: 
    summary: user info
    description: returns user's information
    parameters:
        - name: address
            in: path
            schema:
                type: string
                description: user address
            required: true
        - name: topic
            in: query
            schema:
                type: string
                description: topic
            required: true
        - predictionDatetime: 
            in: query
            schema:
                type: string
                description: only return markets after a given date
            required: false
        - statuses:
            in: query
            schema:
                type: array
                description: only return markets in which user participated with given status
                items:
                    type: str
                    enum: ["inprogress", "unresolved", "resolved"]
            required: false
    responses:
        description: user
        produces:
            - application/json
        schema:
            status: int
            data:
                type: object
                properties:
                    address: string
                    registrationDatetime: string
                    accuracy: float
                    reputation: float
                    markets:
                        type: array
                        items:
                            type: object
                            properties:
                                address: string
                                status: string
                                predictionDatetime: string
                                correct:
                                    type: bool
                                    description: whether user was correct in this market
                                    default: null
                                reputation:
                                    type: float
                                    description: amout of reputation user received for this market
                                    default: null
                            
```
## Примеры

### Request
```
https://api.pythia.company/users/0x1?predictionDatetime=2023-04-01T01:00:00.000Z/statuses[]=resolved
```
### Response
```javascript
[
    {
        "status": 200,
        "data": [
            {
                "address": "0xFfeEcd85edF58666AEb95Cc2EFA855DA62E6ea56"
                "registrationDatetime": "2023-04-01T01:00:00.000Z"
                "accuracy": 0.8,
                "reputation": 10.1
                "markets": [
                    {
                        "address": "0x2",
                        "status": "resolved",
                        "predictionDatetime": "2023-04-01T01:00:00.000Z",
                        "correct": true,
                        "reputation": 10.1
                    },
                    {
                        "address": "0x3",
                        "status": "resolved",
                        "predictionDatetime": "2023-05-01T01:00:00.000Z",
                        "correct": false,
                        "reputation": 0
                    }
                ]
            }
        ]
    }
]

```



