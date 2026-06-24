## Example Chat Interaction

**AI**:

Hi, I'm your AI experiment consultant for learning apps. I can help you turn an idea, pain point, or screenshot into a concrete A/B test plan and implementation-ready report.

To start, tell me about your learning app. What does it do, and who is it for?

**User**:

<Uploaded minimath-screenshot.png>

MiniMathApp is a math practice app for middle-school students.

Many students get stuck or answer incorrectly on the first try on this area word-problem page.

We have not chosen an intervention yet. Please suggest a few A/B test ideas and recommend a good starting experiment.

**AI**:

Thanks — I understand the setup. MiniMathApp is a math practice app, and this area word-problem page is a good candidate for an experiment because many students get stuck or answer incorrectly on the first try.

Here are three experiment ideas:

Idea	Change	Main outcome
Optional hint button	Add a "Show hint" button for students who need help	First-attempt correctness
Worked example	Show a solved similar example before the problem	Completion and transfer to the next problem
Scaffolded steps	Break the answer process into length, width, and multiplication steps	Attempts before correct / completion

I'd recommend starting with the optional hint button. It is a small change, easy to compare against the current page, and directly targets students who are stuck.

Draft hypothesis: Adding an optional hint button will improve first-attempt correctness without substantially increasing time-on-task compared with the current page.

Reply yes to use the hint-button idea and this hypothesis, or tell me what you want to change.

**User**:

yes

**AI**:

Great — hint-button idea and hypothesis locked in.

Before we design the experiment: would you like me to look for up to three related research papers that may help ground or refine this hypothesis before creating the UpGrade experiment design?

**User**:

yes

**AI**:

```
🔧 search_papers
started
Searching for related research papers…
Found 12 related papers.
```

These papers don't prove the proposed intervention will work, but they may help ground or refine the experiment design.

1. Revisiting the Hint Button: Consistent Negative Associations Between Unproductive Hint Use and Learning Outcomes in Intelligent Tutoring Systems — An et al., 2026

- Relevance: A multi-semester study of 999 K–12 math students that directly examines on-demand hint buttons in tutoring systems — the same mechanism and population as our experiment.
- Design implication: Suggests tracking how hints are used (e.g. premature requests, superficial reading), so consider a hint-usage metric alongside first-attempt correctness rather than assuming hints are always productive.

2. Designing for Metacognition — Applying Cognitive Tutor Principles to the Tutoring of Help Seeking — Roll, Aleven, McLaren & Koedinger, 2007

- Relevance: A foundational, heavily-cited study on help-seeking and on-demand help in math cognitive tutors, directly relevant to how students engage an optional hint.
- Design implication: Reinforces measuring whether students use help appropriately, supporting a hint-engagement metric and caution against interpreting raw completion gains in isolation.

3. Typifying Students' Help-Seeking Behavior in an Intelligent Tutoring System for Mathematics — Meléndez-Armenta et al., 2021

- Relevance: Studies help-seeking behavior among secondary math students in an ITS — the same mechanism, subject, and age range as MiniMathApp.
- Design implication: Indicates help-seeking varies by student type, so segmenting or at least monitoring hint usage could help interpret first-attempt correctness results.

These papers consistently point to one refinement: add a hint-usage metric (e.g. proportion of students who open the hint) so we can tell whether correctness changes are driven by productive help-seeking, and read completion gains with that caution in mind. The core hint-button hypothesis itself can stay as-is.

Should I apply that refinement (add a hint-usage metric) and continue to the UpGrade experiment design?

**User**:

yes

**AI**:

Here's the proposed UpGrade experiment design. Quick note: UpGrade is the open-source experimentation platform we'll target for the actual implementation.

- Name: Hint Button Experiment
- Description: Tests whether adding an optional "Show hint" button on the area word-problem page improves first-attempt correctness without substantially increasing time-on-task, while tracking how often students use the hint.
- App Context: example-math-app
- Decision Point:
  - Site: problem_page
  - Target: area_rectangle_hint_support
- Conditions:
  - control — 50%
  - hint_button — 50%
- Participants: Include All
- Metrics:
  - firstAttemptCorrect (Percent = CORRECT) — categorical, allowed values CORRECT / INCORRECT
  - timeOnTask (Mean) — continuous
  - hintUsed (Percent = USED) — categorical, allowed values USED / NOT_USED (the research-grounded hint-usage metric)

A couple of notes on the shape: this is a single-decision-point, between-subject A/B test with equal weights — the MVP-supported shape. The hintUsed metric is only meaningful in the hint_button arm (the control has no hint to open), but it's useful for interpreting whether correctness changes come from productive help-seeking.

Reply yes to use this design, or tell me what you'd like to change.

**User**:

yes

**AI**:

Design approved.

Would you like me to run a quick preflight simulation against the demo UpGrade backend? It creates a synthetic cohort (no real users) so you can see how assignment, enrollment, and metric reporting would look. It's a demonstration of the data flow — not a prediction of real outcomes.

Reply yes to run it (I'll use a default cohort of 200), or tell me a different cohort size or to skip it.

**User**:

yes

**AI**:

```
🔧 run_simulation
started
Saving temporary metrics…
Creating experiment…
Starting experiment…
Running 200/200…
Fetching enrollment + metric results…
Cleaning up: deleting experiment…
```

Here's the preflight result (synthetic cohort of 200):

### Enrollment Data

Condition	Weight (%)	Enrollment
control	50	111
hint_button	50	89

### Metric Data

#### firstAttemptCorrect (Percent = CORRECT)
Condition	Statistic Value
control	52.25
hint_button	64.04

#### timeOnTask (Mean)
Condition	Statistic Value
control	29.55
hint_button	36.79

#### hintUsed (Percent = USED)
Condition	Statistic Value
control	0.00
hint_button	59.55

In this synthetic run, the hint_button arm shows higher first-attempt correctness (~64% vs ~52%) with somewhat higher time-on-task (~37s vs ~30s), and about 60% of hint-button students opened the hint — while the control's hint usage is a structural zero, as expected since there's no hint to open. The enrollment split came out a bit uneven (111/89) just from random assignment at this cohort size.

Disclaimer: these numbers are a preflight demonstration of how UpGrade collects and reports assignment, enrollment, and metric data — not a prediction of real learning outcomes.

Ready to generate the final report? It will include: Summary; Learning App Description; Page / Problem Description; Experiment Idea; Hypothesis; Related Research Grounding; Proposed UpGrade Experiment Design; Simulation Result Summary; Recommended Implementation Order; UpGrade Setup Guide; UpGrade Experiment Creation Guide; Client Integration Guide; Assumptions and Notes. Let me know if you'd like to exclude any.

**User**:

yes

**AI**:

```
🔧 generate_report
started
```

Done — your experiment plan is in the panel on the right. Open the chip in this message to reopen it later.

[Chip](example-report.md)
