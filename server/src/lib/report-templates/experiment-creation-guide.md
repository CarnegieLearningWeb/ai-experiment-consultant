After the local UpGrade environment is running, use the UpGrade frontend UI to create and start the experiment.

Open the UpGrade frontend:

```text
http://localhost:4200
```

### 1. Create the experiment

On the **Experiments** page, click **Add Experiment**.

In the **Add Experiment** modal, enter the following values:

- **Name:** `Hint Button Experiment`
- **Description:** `Tests whether adding an optional hint button on the problem page improves completion rate without substantially increasing time on task.`
- **App Context:** `example-math-app`

Leave the remaining settings unchanged:

- **Experiment Type:** Simple Experiment
- **Unit of Assignment:** Individual
- **Consistency Rule:** Individual
- **Assignment Algorithm:** Random

Click **Create**.

After the experiment is created, UpGrade will open the experiment details page.

### 2. Add the decision point

In the **Decision Points** section, click **Add Decision Point**.

Enter the following values:

- **Site:** `problem_page`
- **Target:** `problem_123_hint_support`

Leave **Exclude If Reached** unchecked.

Click **Create**.

### 3. Add the conditions

In the **Conditions** section, add each condition listed below.

For each condition:

1. Click **Add Condition**.
2. Enter the condition in the **Condition** field.
3. Click **Create**.

Conditions to add:

- `control`
- `hint_button`

### 4. Include participants

In the **Include Lists** section, turn on **Include All**.

When the confirmation modal appears, click **Enable**.

This allows all participants to be included in the experiment unless they are explicitly excluded by an exclude list.

### 5. Add the metrics

In the **Metrics** section, add each metric listed below.

For each metric:

1. Click **Add Metric**.
2. Leave **Metric Type** set to **Global Metric**.
3. Enter the listed values.
4. Click **Create**.

**Metric: `completionRate`**

- **Metric ID:** `completionRate`
- **Aggregate Statistic:** Percentage
- **Comparison:** Equal
- **Value:** `COMPLETED`
- **Display Name:** `completionRate (Percent = COMPLETED)`

**Metric: `timeOnTask`**

- **Metric ID:** `timeOnTask`
- **Aggregate Statistic:** Mean
- **Display Name:** `timeOnTask (Mean)`

### 6. Start the experiment

Click the blue **Start** button in the top-right area of the experiment details page.

In the confirmation modal, click **Start**.

The experiment status should change from **Inactive** to **Running**.

### 7. View enrollment and metric data

After the client app is integrated and starts sending assignment and metric data, open the **Data** tab on the experiment details page.

Use this tab to review:

- **Enrollment Data:** how many participants were assigned to each condition
- **Metrics Data:** collected values for the metrics configured in this experiment

At first, these sections may show no data. Data will appear after the client app enrolls participants and logs metrics.
