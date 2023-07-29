


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

## /markets
```yaml
/markets:
    get: 
      summary: available markets
      description: returns list of markets available for prediction
      parameters:
          - name: topics
            in: query
            required: false
            schema:
              type: array
              items:
                type: string
                enum: [nft, defi, trading]
                default: trading
              description: market topics
          - name: createdAfter
            in: query
            required: false
            schema:
              type: string
              description: filter on date when market was created
          - name: wageDeadlineAfter
            in: query
            required: false
            schema:
              type: string
              description: filter on date when the prediction deadline for the market
          - name: resolvesAfter
            in: query
            required: false
            schema:
              type: string
          - name: status
            in: query
            required: false
            schema:
              type: string
              enum: [inprogress, unresolved, resolved]
              description: status of the market
          - name: questionPattern
            in: query
            required: false
            schema:
                type: string
                description: question pattern (used in search form)
          - name: address
            in: query
            required: false
            schema:
                type: string
                description: user address
          - name: sort
            in: query
            required: false
            schema:
              type: object
              properties:
                wageDeadline: 
                  type: string
                  enum: [asc, desc]
                  default: asc
                resolutionDate: 
                  type: string
                  enum: [asc, desc]
                  default: asc
                numOfPredictors:
                  type: string
                  enum: [asc, desc]
                  default: asc
          - name: limit
            in: query
            required: false
            schema:
              type: integer
              default: 30
      responses:
        '200':
          description: A list of markets
          content:
            application/json:
              schema:
                type: array
                items: 
                  type: object
                  properties:
                    address:
                      type: string
                    question:
                      type: string
                    creationDatetime:
                      type: string
                    wageDeadline:
                      type: string
                    resolutionDate:
                      type: string
                    topic:
                      type: string
                    reputationTokenAddress:
                      type: string
                    options: 
                      type: array
                      items: 
                        type: string
                    status: 
                      type: string
                      enum: ["inprogress", "unresolved", "resolved"]
                      default: "inprogress"
                    answer:
                      type: string
                      default: null
                    numOfPredictors:
                      type: integer      
                    userInfo: 
                      type: object
                      default: null
                      properties:
                        address: 
                          type: boolean
```
### Request
```
https://api.pythia.company/markets/?topics[]=nft&wageDeadlineAfter=2023-08-01T01:00:00.000Z&limit=10&sort[numOfPredictors]=desc
```
### Response
```javascript
[
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
```

## /markets/{address}
```yaml
/markets/{address}:
    get: 
      summary: information about the market
      description: returns list of markets available for prediction
      parameters:
        - name: address
          in: path
          required: true
          schema:
            type: string
            description: address of the market
        - name: predictions
          in: query
          required: false
          schema:
            type: integer
            description: get last n predictions
            default: 10
        - name: user
          in: query
          required: false
          schema:
            type: string
            description: user address
      responses:
        '200':
          description: info about the market
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: string
                  question:
                    type: string
                  creationDatetime:
                    type: string
                  wageDeadline:
                    type: string
                  resolutionDate:
                    type: string
                  topic:
                    type: string
                  reputationTokenAddress:
                    type: string
                  options: 
                    type: array
                    items: 
                      type: string
                  status: 
                    type: string
                    enum: ["inprogress", "unresolved", "resolved"]
                    default: "inprogress"
                  answer:
                    type: string
                    default: null
                  numOfPredictors: 
                    type: integer      
                  predictions: 
                    type: array
                    items:
                      type: object
                      properties:
                        address: 
                          type: string
                        encodedPrediction:
                          type: string
                  user:
                    type: object
                    default: null
                    properties:
                      address:
                        type: string
                      encodedPrediction: 
                        type: string
                        default: null
                        description: users description for this market
```
### Request
```
https://api.pythia.company/markets/0x1?predictions=10&user=0x2
```
### Response
```javascript
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
```


## /users
```yaml
/users:
    get: 
      summary: users
      description: returns users
      parameters:
        - name: topic
          in: query
          required: false
          schema:
            type: string
            description: filter on date when market was created
        - name: from
          in: query
          required: false
          schema:
            type: string
            description: date from which to get data
        - name: limit
          in: query
          required: false
          schema:
            type: integer
        - name: sort
          in: query
          required: false
          schema:
            type: object
            properties:
              reputation: 
                type: string
                enum: [asc, desc]
                default: asc
              accuracy:
                type: string
                enum: [asc, desc]
                default: asc
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items: 
                  type: object
                  properties:
                    address: 
                      type: string
                    registrationDatetime:
                      type: string
                    accuracy:
                      type: number
                    reputation:
                      type: number
```
### Request
```
https://api.pythia.company/users/?topics[]=nft&sort[accuracy]=asc&limit=20
```
### Response
```javascript
[
    {
        "address": "0xFfeEcd85edF58666AEb95Cc2EFA855DA62E6ea56"
        "registrationDatetime": "2023-04-01T01:00:00.000Z"
        "accuracy": 0.8,
        "reputation": 10.1
    }
]

```

## /users/{address}
```yaml
/users/{address}:
    get: 
      summary: user info
      description: returns user's information
      parameters:
        - name: address
          in: path
          required: true
          schema:
            type: string
            description: user address
        - name: topic
          in: query
          required: true
          schema:
            type: string
            description: topic
        - name: predictionDatetime
          in: query
          required: false
          schema:
            type: string
            description: only return markets after a given date
        - name: statuses
          in: query
          required: false
          schema:
            type: array
            description: only return markets in which user participated with given status
            items:
              type: string
              enum: ["inprogress", "unresolved", "resolved"]
              default: "unresolved"
      responses:
        '200':
          description: user
          content:
            application/json:
              schema:
                type: object
                properties:
                  address:
                    type: string
                  registrationDatetime: 
                    type: string
                  accuracy:
                    type: number
                  reputation:
                    type: number
                  markets:
                    type: array
                    items:
                      type: object
                      properties:
                        address:
                          type: string
                        status:
                          type: string
                        predictionDatetime:
                          type: string
                        correct:
                          type: boolean
                          description: whether user was correct in this market
                          default: null
                        reputation:
                          type: number
                          description: amout of reputation user received for this market
                          default: null
```
### Request
```
https://api.pythia.company/users/0x1?predictionDatetime=2023-04-01T01:00:00.000Z/statuses[]=resolved
```
### Response
```javascript
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
```



