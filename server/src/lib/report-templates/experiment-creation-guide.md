> **PLACEHOLDER:** Adjust the click-by-click instructions below to match your UpGrade UI. The structural fields (name, description, decision point, conditions, metrics) are interpolated from the experiment design and should already be correct.

Once your environment is ready, create the experiment in the UpGrade UI:

1. **New experiment**
   - Name: `{{name}}`
   - Description: `{{description}}`
   - App context: `{{app_context}}`
   - Type: Simple (between-subject, individual-level assignment)
   - Assignment algorithm: Random
   - Participants: Include All
   - Post-experiment behavior: Continue

2. **Decision point**

{{decision_point_block}}

3. **Conditions**

{{conditions_block}}

4. **Metrics**

You'll define each metric once at the environment level, then attach it to this experiment as a query.

{{metrics_block}}

5. **Save and start enrolling.** Once the experiment is saved with the values above, transition it to the `enrolling` state to begin assigning participants.
