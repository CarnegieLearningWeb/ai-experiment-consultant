# Simulation API surface

The simulation feature (M4) calls the demo UpGrade backend to save/create temporary metrics/experiment, simulate synthetic participant visits, log metric values, fetch results, and tear the metrics/experiment down. This file is the working notes for that API surface.

Demo UpGrade backend base: `https://upgrade-demo.carnegielearning.com/api`

## High-level flow

1. Save temporary metrics to collect (`/metric/save`).
2. Create a temporary experiment matching the approved design (`/experiments`).
3. Start the experiment (`/experiments/state`).
4. For each synthetic participant:
   - `init` the participant (`/v6/init`).
   - `assign` to a condition at the decision point (`/v6/assign`).
   - `mark` the decision point (`/v6/mark`).
   - `log` synthetic metric values for that condition (`/v6/log`).
5. Retrieve enrollment (`/stats/enrollment/detail`) and metric (`/query/analyse`) result data.
6. Delete the temporary experiment (`/experiments/:id`).
7. Delete the saved metrics (`/metric/:key`).

Note: since available app contexts are defined as an environment variable in UpGrade, we cannot dynamically set it via API requests. Currently, the UpGrade demo app supports only one app context called "add", so we should use this in actual requests instead of the one that AI shared with the user (e.g., example-math-app) in the consulting process before running the simulation.

## UpGrade backend endpoints (requires an access token)

#### Common Headers

```js
{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": `Bearer ${accessToken}`
}
```

### `POST /metric/save`

Save metrics to collect. Per the MVP shape, this is called once per simulation with up to 3 metrics; each categorical metric supports up to 3 `allowedValues`.

#### Payload

```js
{
  "metricUnit": [
    {
      "metric": "completionRate",
      "datatype": "categorical",
      "allowedValues": [
        "COMPLETED",
        "NOT_COMPLETED"
      ]
    },
    {
      "metric": "timeOnTask",
      "datatype": "continuous"
    }
  ],
  "context": [
    "add"
  ]
}
```

#### Responses

- 200: Created metrics data (can be ignored)
- 400: BadRequestError - InvalidParameterValue

### `POST /experiments`

Create an experiment

Note: we can use fixed values except for "name", "description", "partitions" (decision points), "conditions", "queries" (metrics), and "id" fields. The IDs for "partitions" and "conditions" should be generated as UUID v4.

#### Payload

```js
{
  "name": "Hint Button Experiment",
  "description": "Tests whether adding an optional hint button improves completion rate on a target math problem.",
  "context": [
    "add"
  ],
  "type": "Simple",
  "assignmentUnit": "individual",
  "consistencyRule": "individual",
  "assignmentAlgorithm": "random",
  "tags": [],
  "state": "inactive",
  "postExperimentRule": "continue",
  "partitions": [
    {
      "id": "d169fe83-51eb-4a91-b545-66bdbc7c936d",
      "site": "problem_page",
      "target": "problem_123_hint_support",
      "description": "",
      "order": 1,
      "excludeIfReached": false
    }
  ],
  "conditions": [
    {
      "id": "430cba91-9d65-4cfd-a28e-2ab7d72db968",
      "conditionCode": "control",
      "assignmentWeight": 50,
      "description": null,
      "order": 1,
      "name": ""
    },
    {
      "id": "a9b16f6b-b3b2-4b49-bd64-7d061541c61c",
      "conditionCode": "hint_button",
      "assignmentWeight": 50,
      "description": null,
      "order": 2,
      "name": ""
    }
  ],
  "filterMode": "includeAll",
  "experimentSegmentInclusion": {
    "segment": {
      "individualForSegment": [],
      "groupForSegment": [
        {
          "type": "All",
          "groupId": "All"
        }
      ],
      "subSegments": [],
      "type": "private"
    }
  },
  "experimentSegmentExclusion": {
    "segment": {
      "individualForSegment": [],
      "groupForSegment": [],
      "subSegments": [],
      "type": "private"
    }
  },
  "queries": [
    {
      "name": "completionRate (Percent = COMPLETED)",
      "query": {
        "operationType": "percentage",
        "compareFn": "=",
        "compareValue": "COMPLETED"
      },
      "metric": {
        "key": "completionRate"
      },
      "repeatedMeasure": "MOST RECENT"
    },
    {
      "name": "timeOnTask (Mean)",
      "query": {
        "operationType": "avg"
      },
      "metric": {
        "key": "timeOnTask"
      },
      "repeatedMeasure": "MOST RECENT"
    }
  ]
}
```

#### Responses

- 200: Created experiment data

Note: the IDs for "experiment", "conditions", and "queries" should be stored for later requests (`/experiments/state`, `/stats/enrollment/detail`, `/query/analyse`, `/experiments/:id`).

```js
{
  "name": "Hint Button Experiment",
  "id": "67a81ce9-2847-41ec-bed5-e0ecdd701379",
  "conditions": [
    {
      "id": "430cba91-9d65-4cfd-a28e-2ab7d72db968",
      "conditionCode": "control",
      ...
    },
    {
      "id": "a9b16f6b-b3b2-4b49-bd64-7d061541c61c",
      "conditionCode": "hint_button",
      ...
    }
  ],
  "queries": [
    {
      "name": "completionRate (Percent = COMPLETED)",
      "id": "90c747ca-00a0-4e24-b885-ae7414e31b82",
      ...
    },
    {
      "name": "timeOnTask (Mean)",
      "id": "55d5fb79-e93a-47f7-9ea6-57e96f4da0fa",
      ...
    }
  ],
  ...
}
```

- 400: "default" as ConditionCode is not allowed (we should prompt the AI to not use "default" for a condition name)
- 401: AuthorizationRequiredError
- 422: Experiment is not valid for current configuration
- 500: Insert Error in database

### `POST /experiments/state`

Update experiment status

#### Payload

```js
{
  "experimentId": "67a81ce9-2847-41ec-bed5-e0ecdd701379",
  "state": "enrolling"
}
```

#### Responses

- 200: Updated experiment data (can be ignored)
- 401: AuthorizationRequiredError
- 500: id should be of type UUID, invalid input value for enum 'state' violates not-null constrain

### `POST /stats/enrollment/detail`

Get enrollment detail.

#### Payload

```js
{
  "experimentId": "67a81ce9-2847-41ec-bed5-e0ecdd701379"
}
```

#### Responses

- 200: Enrollment detail data

```js
{
  "id": "67a81ce9-2847-41ec-bed5-e0ecdd701379",
  "users": 2,
  "conditions": [
    {
      "id": "430cba91-9d65-4cfd-a28e-2ab7d72db968",
      "users": 1,
      ...
    },
    {
      "id": "a9b16f6b-b3b2-4b49-bd64-7d061541c61c",
      "users": 1,
      ...
    }
  ],
  ...
}
```

- 400: BadRequestError - InvalidParameterValue
- 401: AuthorizationRequiredError
- 500: Internal Server Error

### `POST /query/analyse`

Get metric results.

#### Payload

```js
{
  "queryIds": [
    "90c747ca-00a0-4e24-b885-ae7414e31b82",
    "55d5fb79-e93a-47f7-9ea6-57e96f4da0fa"
  ]
}
```

#### Responses

- 200: Metric results data

```js
[
  {
    "id": "90c747ca-00a0-4e24-b885-ae7414e31b82",
    "mainEffect": [
      {
        "conditionId": "430cba91-9d65-4cfd-a28e-2ab7d72db968",
        "result": "100.00000000000000000000",
        "participantsLogged": "1"
      },
      {
        "conditionId": "a9b16f6b-b3b2-4b49-bd64-7d061541c61c",
        "result": "0.00000000000000000000",
        "participantsLogged": "1"
      }
    ],
    "interactionEffect": null
  },
  {
    "id": "55d5fb79-e93a-47f7-9ea6-57e96f4da0fa",
    "mainEffect": [
      {
        "conditionId": "430cba91-9d65-4cfd-a28e-2ab7d72db968",
        "result": "10.3500000000000000",
        "participantsLogged": "1"
      },
      {
        "conditionId": "a9b16f6b-b3b2-4b49-bd64-7d061541c61c",
        "result": "14.1300000000000000",
        "participantsLogged": "1"
      }
    ],
    "interactionEffect": null
  }
]
```

- 400: BadRequestError - InvalidParameterValue
- 401: AuthorizationRequiredError
- 500: Internal Server Error

### `DELETE /experiments/:id`

Delete an experiment

#### Payload

None

#### Responses

- 200: Deleted experiment data (can be ignored)
- 400: ExperimentId should be a valid UUID
- 401: AuthorizationRequiredError
- 404: Not found error
- 500: id should be of type UUID

### `DELETE /metric/:key`

Delete a metric with key (e.g., completionRate)

#### Payload

None

#### Responses

- 200: []
- 404: Metrics key not found

## Client API endpoints (don't require an access token)

#### Common Headers

```js
{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "User-Id": userId
}
```

### `POST /v6/init`

Initialize a user in UpGrade.

#### Payload

None

#### Responses

- 200: Initialized user data (can be ignored)
- 400: BadRequestError - InvalidParameterValue
- 500: Internal Server Error

### `POST /v6/assign`

Get a condition assignment for a user at a decision point.

#### Payload

```js
{
  "context": "add"
}
```

#### Responses

- 200: List of condition assignment data (the "assignedCondition" data (`data.find(item => item.site === site && item.target === target)?.assignedCondition?.[0] ?? null;`) should be stored for `/v6/mark` payload)

```js
[
  {
    "site": "problem_page",
    "target": "problem_123_hint_support",
    "experimentType": "Simple",
    "assignedCondition": [
      {
        "id": "430cba91-9d65-4cfd-a28e-2ab7d72db968",
        "conditionCode": "control",
        "payload": null,
        "experimentId": "67a81ce9-2847-41ec-bed5-e0ecdd701379"
      }
    ]
  }
]
```

- 400: BadRequestError - InvalidParameterValue
- 404: Experiment User not defined
- 500: Internal Server Error

### `POST /v6/mark`

Mark that a user reached a decision point.

Note: `/v6/mark` should be called even when `/v6/assign` request fails or `assignedCondition` is set to `null`.

#### Payload

```js
{
  "data": {
    "site": "problem_page",
    "target": "problem_123_hint_support",
    "assignedCondition": {
      "conditionCode": "control"
    }
  }
}
```

#### Responses

- 200: Marked data (can be ignored)
- 400: BadRequestError - InvalidParameterValue
- 404: Experiment User not defined
- 500: Internal Server Error


### `POST /v6/log`

Log metric values for a user.

#### Payload

```js
{
  "value": [
    {
      "timestamp": "2026-05-22T15:30:26.617Z",
      "metrics": {
        "attributes": {
          "completionRate": "COMPLETED",
          "timeOnTask": 10.35
        }
      }
    }
  ]
}
```

#### Responses

- 200: Logged data (can be ignored)
- 400: BadRequestError - InvalidParameterValue
- 404: Experiment User not defined
- 500: Internal Server Error

## Example Simulation Results

Based on the response from `/stats/enrollment/detail` and `/query/analyse`, the AI can present simulation results in a concise markdown summary like the following:

```
### Enrollment Data

Condition | Weight (%) | Enrollment
control | 50 | 1
hint_button | 50 | 1

### Metric Data

#### completionRate (Percent = COMPLETED)

Condition | Statistic Value
control | 100.0
hint_button | 0.0

#### timeOnTask (Mean)

Condition | Statistic Value
control | 10.35
hint_button | 14.13
```

## Cleanup safety

The simulation must clean up its temporary experiment even when something fails mid-run. Design constraints (to be implemented in M4):

- Wrap the create → simulate → fetch sequence in a try/finally so the delete call always runs.
- Decide what happens if delete itself fails: we can retry the deletion but it's low risk to leave experiments undeleted since the demo app clears all experiments whenever a user starts a guided tour (which might affect the simulation but it's unlikely to happen).
- It might be nice to have the AI retry the simulation if something fails or got unexpected results. Maybe it can ask the user if they want to retry.

## Non-goals

- The simulation does not retry indefinitely on transient failures. One retry, then surface the error.
- The simulation does not concurrently run multiple experiments per session.
- The simulation does not preserve results across browser reloads.
