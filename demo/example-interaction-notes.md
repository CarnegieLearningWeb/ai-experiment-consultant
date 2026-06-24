# Expected PELE 2026 Demo Interaction with Presenter Notes

This document preserves the complete expected MiniMathApp interaction and adds separate **Notes** sections between turns. The conversation content mirrors [`example-interaction.md`](./example-interaction.md).

The simulation values below come from one completed synthetic run. Actual values may differ slightly because assignment and metric sampling are random.

## Flow at a glance

| Step | User action | AI response or action |
| ---: | --- | --- |
| 1 | Describes MiniMathApp | Asks for the target page, pain point, and screenshot |
| 2 | Uploads the area-problem screenshot and asks for ideas | Suggests three interventions and drafts the hint-button hypothesis |
| 3 | Approves the idea and hypothesis | Offers related research grounding |
| 4 | Accepts the research offer | Searches and presents three frozen papers plus an overall hint-usage refinement |
| 5 | Refines overall usage into premature hint use | Produces the UpGrade experiment design |
| 6 | Approves the design | Offers the synthetic preflight |
| 7 | Accepts the preflight | Runs and summarizes the simulation, then offers report generation |
| 8 | Approves all report sections | Generates and opens the final report |

**Notes**

So this is the login page. It also gives a quick overview of what the tool does. I'll sign in. (Click "Sign in as Zack")

## 0. Opening greeting

**AI**

Hi, I'm your AI experiment consultant for learning apps. I can help you turn an idea, a pain point, or a screenshot into a concrete A/B test plan and implementation-ready report.

To start, tell me about your learning app. What does it do, and who is it for?

**Notes**

Now we're in the chat. The consultant starts by asking about the learning app.

(Read) "To start, tell...is it for?"

There are also starter options if you're not sure where to begin.

I'll give it just the app-level context first.

(Paste/Read/Send)
```text
MiniMathApp is a math practice app for middle-school students. Students work through one problem at a time in topic-based practice units.
```

## 1. Learning app description

**User**

MiniMathApp is a math practice app for middle-school students. Students work through one problem at a time in topic-based practice units.

**AI**

Thanks. Which page, problem, or interaction would you like to improve? Please share the pain point and a screenshot if you have one.

**Notes**

(After response) And it says:

(Read) "Thanks. Which page...if you have one."

So I'll upload the screenshot (Upload minimath-screenshot.png)

Then I'll paste the page description and the pain point.

(Paste/Read/Send)
```text
This is an area word-problem page about a rectangular garden. Many students get stuck or answer incorrectly on the first try.

We have not chosen an intervention yet. Please suggest a few A/B test ideas and recommend a good starting experiment.
```

## 2. Page, problem, and experiment ideation

**User**

> Uploaded: `minimath-screenshot.png`

This is an area word-problem page about a rectangular garden. Many students get stuck or answer incorrectly on the first try.

We have not chosen an intervention yet. Please suggest a few A/B test ideas and recommend a good starting experiment.

**AI**

Thanks. This area word-problem page is a good candidate for an experiment because many students get stuck or answer incorrectly on the first try.

Here are three experiment ideas:

| Idea | Change | Main outcome |
| --- | --- | --- |
| Optional hint button | Add a "Show hint" button for students who need help | First-attempt correctness |
| Worked example | Show a solved similar example before the problem | Completion and transfer to the next problem |
| Scaffolded steps | Break the answer process into length, width, and multiplication steps | Attempts before correct / completion |

I'd recommend starting with the optional hint button. It is a small change, easy to compare against the current page, and directly targets students who are stuck.

Draft hypothesis: Adding an optional hint button will improve first-attempt correctness without substantially increasing time-on-task compared with the current page.

Reply yes to use the hint-button idea and this hypothesis, or tell me what you want to change.

**Notes**

(After response) Okay, it gives me three experiment ideas:

(Read) "Optional hint button...Scaffolded steps."

Then it recommends starting with the optional hint button:

(Read) "It is a small...who are stuck."

It also proposes a hypothesis:

(Read) "Adding an optional...the current page."

This sounds reasonable, so I'll approve it and move forward by replying:

(Paste/Read/Send)
```text
Let's use the optional hint-button idea and the proposed hypothesis.
```

## 3. Hypothesis approval and research offer

**User**

Let's use the optional hint-button idea and the proposed hypothesis.

**AI**

Great. The hint-button idea and hypothesis are locked in.

Before we create the experiment design, would you like me to look for up to three related research papers that may help ground or refine this hypothesis?

**Notes**

(After response) And it says:

(Read) "Great. The hint-button...refine this hypothesis?"

I'll say yes here. (Type "yes" and send)

## 4. Related research grounding

**User**

yes

**Tool call**

```text
🔧 search_papers
started
Searching for related research papers…
Found 12 related papers.
```

**Notes**

(While `search_papers` is running)

Now it's searching Semantic Scholar with a few related queries, narrowing the candidate papers, and then summarizing up to three of the most relevant papers for this experiment.

**AI**

These papers don't prove the proposed intervention will work, but they may help ground or refine the experiment design.

1. **[Revisiting the Hint Button: Consistent Negative Associations Between Unproductive Hint Use and Learning Outcomes in Intelligent Tutoring Systems](https://www.semanticscholar.org/paper/71eb7a29ba027978057bec9018a054fa383bacef)** — An et al., 2026
   - **Relevance:** A multi-semester study of 999 K–12 math students that directly examines on-demand hint buttons in tutoring systems. This is the same mechanism in a closely related school-age population.
   - **Design implication:** Suggests tracking how hints are used (e.g. premature requests, superficial reading), so consider a hint-usage metric alongside first-attempt correctness rather than assuming hints are always productive.

2. **[Designing for Metacognition — Applying Cognitive Tutor Principles to the Tutoring of Help Seeking](https://www.semanticscholar.org/paper/722b988491e01647ac2827ec010de4f24196d0ae)** — Roll, Aleven, McLaren & Koedinger, 2007
   - **Relevance:** A foundational, heavily-cited study on help-seeking and on-demand help in math cognitive tutors, directly relevant to how students engage an optional hint.
   - **Design implication:** Reinforces measuring whether students use help appropriately, supporting a hint-engagement metric and caution against interpreting correctness gains in isolation.

3. **[Typifying Students' Help-Seeking Behavior in an Intelligent Tutoring System for Mathematics](https://www.semanticscholar.org/paper/fcc06aae6014ac5f6702f016bf1853b3b680e4fb)** — Meléndez-Armenta et al., 2021
   - **Relevance:** Studies help-seeking behavior among secondary math students in an ITS, matching MiniMathApp's mechanism, subject, and age range.
   - **Design implication:** Indicates that help-seeking varies across students, reinforcing the need to monitor hint use rather than interpret it as a uniform behavior.

Taken together, these papers suggest one practical refinement: add an overall hint-usage metric, such as the proportion of students who open the hint. This would show how often students use the feature, but not whether they use it well. The core hint-button hypothesis can stay as-is.

Should I add that overall hint-usage metric and continue to the UpGrade experiment design?

**Notes**

(After response) Okay, it says:

(Read) "These papers don't...the experiment design."

(Scroll down) And it found three related papers, each with a relevance note and a design implication.

(Scroll down) Then it says:

(Read) "Taken together, these...UpGrade experiment design?"

As the AI notes, overall hint usage would show how often students open the hint, but not whether they use it well.

So I'll make the metric more specific: I want to track whether students open the hint before submitting a first answer.

(Paste/Read/Send)
```text
Please apply the research grounding, but track premature hint use instead of overall hint use. Measure whether a student opens the hint before submitting a first answer, so we can distinguish students who try first from those who go straight to the hint. Then continue to the experiment design.
```

## 5. User refinement and UpGrade experiment design

**User**

Please apply the research grounding, but track premature hint use instead of overall hint use. Measure whether a student opens the hint before submitting a first answer, so we can distinguish students who try first from those who go straight to the hint. Then continue to the experiment design.

**AI**

That makes sense. Instead of tracking only whether the hint was used, we'll track whether a student opens it before submitting a first answer. This gives us a more specific measure of premature help-seeking.

UpGrade is the open-source experimentation platform we'll target for implementation. Here's the proposed design:

- **Name:** Hint Button Experiment
- **Description:** Tests whether adding an optional "Show hint" button on the area word-problem page improves first-attempt correctness without substantially increasing time-on-task, while monitoring whether students open the hint before submitting a first answer.
- **App Context:** `minimath-app`
- **Decision Point:**
  - Site: `problem_page`
  - Target: `area_rectangle_hint_support`
- **Conditions:**
  - `control` — 50%
  - `hint_button` — 50%
- **Participants:** Include All
- **Metrics:**
  - `firstAttemptCorrect (Percent = CORRECT)` — categorical; allowed values `CORRECT` / `INCORRECT`; records whether the first submitted answer is correct
  - `timeOnTask (Mean)` — continuous; total seconds from showing the problem page until completion or exit
  - `prematureHintUse (Percent = PREMATURE)` — categorical; allowed values `PREMATURE` / `NOT_PREMATURE`; records whether the hint was opened before the first answer submission

`prematureHintUse` is a diagnostic metric motivated by the research grounding. At the first answer submission, log exactly one `PREMATURE` or `NOT_PREMATURE` value for each student. It is structurally zero in `control` because that condition has no hint button. The core hypothesis remains about first-attempt correctness and time-on-task.

Reply yes to use this design, or tell me what you'd like to change.

**Notes**

(After response) Okay, it says:

(Read) "That makes sense...of premature help-seeking."

Then it turns that into a proposed UpGrade experiment design.

(Scroll down) The design has one decision point, two conditions with a 50/50 split, and three metrics:

(Read) "firstAttemptCorrect...prematureHintUse."

For the new metric, it says:

(Read) "At the first...and time-on-task."

I could still change any of these details, but this is the design I want, so I'll approve it. (Type "yes" and send)

## 6. Design approval and simulation offer

**User**

yes

**AI**

Design approved.

Would you like me to run a quick preflight simulation against the demo UpGrade backend? It creates a synthetic cohort of 200 participants, with no real users, so you can see how assignment, enrollment, and metric reporting would look. It's a demonstration of the data flow, not a prediction of real outcomes.

Reply yes to run it.

**Notes**

(After response) It says:

(Read) "Design approved...of real outcomes."

I'll say yes to run the preflight. (Type "yes" and send)

## 7. Synthetic preflight simulation

**User**

yes

**Tool call**

```text
🔧 run_simulation
started
Saving temporary metrics…
Creating experiment…
Starting experiment…
Running 200/200…
Fetching enrollment + metric results…
Cleaning up: deleting experiment…
```

**Notes**

(While `run_simulation` is running)

Now it's creating a temporary UpGrade experiment and simulating 200 synthetic participants, and then it will clean up the temporary data.

This is just a preflight of the data flow, not a test with real students.

**AI**

Here's the completed preflight simulation for a synthetic cohort of 200.

### Enrollment Data

| Condition | Weight (%) | Enrollment |
| --- | ---: | ---: |
| control | 50 | 105 |
| hint_button | 50 | 95 |

### Metric Data

#### firstAttemptCorrect (Percent = CORRECT)

| Condition | Statistic Value |
| --- | ---: |
| control | 50.48% |
| hint_button | 65.26% |

#### timeOnTask (Mean)

| Condition | Statistic Value |
| --- | ---: |
| control | 30.1s |
| hint_button | 33.28s |

#### prematureHintUse (Percent = PREMATURE)

| Condition | Statistic Value |
| --- | ---: |
| control | 0% |
| hint_button | 33.68% |

The assignment split came out to 105 in control and 95 in hint_button, close to the intended 50/50 with the small variation you'd expect from random assignment. In this synthetic run, hint_button shows higher first-attempt correctness (65.26% vs 50.48%) with a modest increase in time-on-task (33.28s vs 30.1s). About a third of hint_button students (33.68%) opened the hint before submitting a first answer, while control's premature hint use is a structural zero because that condition has no hint button.

These numbers are a preflight demonstration of how UpGrade collects and reports data. They are synthetic and not a prediction of real learning outcomes.

Ready to generate the final report? It will include: Summary; Learning App Description; Page / Problem Description; Experiment Idea; Hypothesis; Related Research Grounding; Proposed UpGrade Experiment Design; Simulation Result Summary; Recommended Implementation Order; UpGrade Setup Guide; UpGrade Experiment Creation Guide; Client Integration Guide; Assumptions and Notes.

Reply yes to include all sections and generate the report. If you want to exclude any sections, tell me which ones instead.

**Notes**

(After response) Okay, it shows the enrollment and metric tables. I'll read the summary:

(Read) "The assignment split...no hint button."

And it reminds us:

(Read) "These numbers are...real learning outcomes."

Then it offers to generate the final report with all of these sections.

(Scroll down) And it says:

(Read) "Reply yes to...which ones instead."

I'll keep everything in for this demo. (Type "yes" and send)

## 8. Report generation

**User**

yes

**Tool call**

```text
🔧 generate_report
started
```

**Notes**

(While `generate_report` is running)

Now it's generating a Markdown report that combines the experiment plan with implementation guidance. This usually takes about 20 seconds.

**AI**

Done. Your experiment plan is in the panel on the right. Open the chip in this message to reopen it later.

**UI artifact**

[Report chip: `example-report.md`](./example-report.md)

**Notes**

(After report panel opens) Now the report is ready in the side panel.

(Scroll slowly) It starts with the high-level plan: the Summary, the Learning App Description, the Page / Problem Description, the Experiment Idea, and the Hypothesis.

(Scroll slowly) It also includes the Related Research Grounding, the Proposed UpGrade Experiment Design, and the Simulation Result Summary.

(Pause at Recommended Implementation Order) Here, the report turns the plan into a practical sequence: set up UpGrade, configure the experiment, integrate the client, and verify that the data appears.

A team could follow these steps directly, or use the report as a starting spec for an AI coding tool, with a developer still reviewing the work.

(Scroll slowly until the client code) Below that are the UpGrade Setup Guide, the UpGrade Experiment Creation Guide, and the Client Integration Guide, including code examples.

So the final output is not just a chat transcript. It becomes a handoff artifact that a researcher, developer, or product team can share and build from.

And because it's Markdown, it can be copied or downloaded from here. (Point to the copy/download buttons)

(Return to the slides)
