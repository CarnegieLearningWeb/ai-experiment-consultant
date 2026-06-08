AI-Assisted Experimentation Consultant for UpGrade Adoption

1. Purpose of This Document

This document summarizes a proposed AI-assisted experimentation consulting tool intended to support a PELE 2026 workshop submission and a lightweight demo application.

The document is meant to serve as a broad project/specification reference for:

* writing a Work-in-Progress / Demo paper for the PELE 2026 workshop
* planning a lightweight web-based demo application
* helping future ChatGPT, Claude, Codex, or other LLM sessions understand the project quickly
* serving as a development-oriented specification for a prototype

This is not intended to be the final paper draft. It captures the current concept, motivation, proposed product flow, MVP scope, possible technical approach, open questions, and related references.

2. Workshop Context

The immediate goal is to submit a Work-in-Progress / Demo paper to the PELE 2026 workshop.

Workshop site:
https://sites.google.com/carnegielearning.com/pele-2026/home

Current understanding of submission format:

* Work-in-Progress & Demo papers
* Up to 4-page PDF
* CHI / ACM format
* Word, LaTeX, or Overleaf format accepted
* References are not included in the page limit

The goal is to submit a paper by the deadline and later prepare a lightweight demo for the workshop presentation.

3. Working Title Options

Possible working titles:

1. AI-Assisted Experimentation Consulting for Educational Platform Adoption
2. From Idea to Experiment: AI-Assisted Planning for UpGrade Adoption
3. Scaling Educational Experimentation through AI-Assisted Consulting
4. An AI Consultant for Planning Educational Experiments with UpGrade
5. AI-Assisted Onboarding for Educational A/B Testing Platforms

Current preferred title:

AI-Assisted Experimentation Consulting for Educational Platform Adoption

This title may change as the paper and demo direction become more concrete.

4. High-Level Summary

The proposed tool is a web-based AI consultant that helps external teams plan educational experiments using UpGrade.

The tool is designed to help users move from a high-level idea such as “I want to test whether adding a hint improves problem completion” to a structured experiment plan that includes:

* learning app description
* page/problem description
* experiment idea or hypothesis
* possible research grounding or related references
* UpGrade experiment design, including decision point, conditions, participants, and metrics
* simulated experiment result
* actionable implementation TODOs
* UpGrade setup guidance
* client library integration guidance, including code snippets
* a final markdown report that can be shared with researchers, developers, or AI coding tools

The MVP does not need to fully automate UpGrade setup, client app code modification, GitHub PR creation, or experiment execution in real production environments. The immediate goal is to provide a useful consulting/planning workflow and generate a structured, actionable report.

5. Motivation and Problem Context

UpGrade is an A/B testing platform for educational software. It can support experiment configuration, condition assignment, metrics, enrollment, dashboards, and related experimentation workflows.

However, recent external onboarding work suggests that adopting UpGrade in a real client application can require significant expert consultation.

Carnegie Learning recently received additional Gates Foundation funding related to UpGrade. One important goal is to expand UpGrade adoption beyond internal Carnegie Learning use and support external teams in using UpGrade to run experiments in their own educational applications.

As part of this work, external partner teams such as Teachley (https://www.teachley.com/) and RightOn (https://www.rightoneducation.com/) were selected. The UpGrade team has been meeting with these teams regularly to help them understand how to design and run experiments with UpGrade.

These onboarding meetings involve consulting on topics such as:

* understanding the client application
* identifying where decision points should exist in the client app
* deciding what kinds of experiments are appropriate
* defining control and variant conditions
* planning how variants should be implemented
* deciding which metrics should be collected
* discussing UpGrade setup and architecture
* explaining how the client app should communicate with UpGrade
* helping the external team translate a high-level experiment idea into an actionable implementation plan

This suggests that the barrier to adopting UpGrade is not only the user interface of UpGrade itself. The broader challenge is that teams need help with the full experimentation lifecycle, especially before they reach the point of entering an experiment into UpGrade.

The proposed AI consultant addresses this broader gap by helping users turn vague or early-stage experiment ideas into concrete, structured, actionable plans.

6. Core Problem Framing

Existing experimentation platforms can provide strong support for defining, running, and monitoring experiments once the user knows what they want to do.

However, external teams may still struggle with questions such as:

* What should we experiment on in our app?
* Where should the decision point be placed?
* What should the control and variant conditions be?
* What metrics should we track?
* What needs to change in the client app?
* What does the developer team need to implement?
* What UpGrade concepts do we need to understand?
* What steps are required before we can actually run the experiment?

The proposed AI consultant aims to support this planning and consulting layer.

A concise framing:

UpGrade supports experiment execution, while this AI consultant supports experiment planning, onboarding, and implementation readiness.

7. Product Vision

The long-term product vision is an AI-powered experimentation consultant that helps educational software teams plan, implement, and eventually operate experiments with UpGrade.

The tool would serve as a bridge between:

* researchers who understand learning goals and experiment ideas
* developers who implement client app changes
* UpGrade as the experimentation platform
* external teams that may not yet understand experimentation workflows deeply

In its simplest version, the tool helps a user generate a structured experiment plan and report.

In more advanced versions, the tool could support partial automation, such as:

* generating variant content
* suggesting client code snippets
* helping create UpGrade experiment configuration
* generating implementation checklists
* assisting developers through AI coding tools
* connecting with repositories or CI workflows
* creating PRs or setup tasks
* supporting experiment monitoring and reporting

The MVP should focus on the planning/reporting workflow, while leaving deeper automation as future work.

8. MVP Scope

The MVP is a lightweight web application that guides users through a chat-based consulting flow and generates a final actionable report.

MVP includes:

* web-based app
* Google login for basic access control / abuse prevention
* simple chat UI
* AI consultant that follows a structured consulting flow
* file upload, especially images
* no persistent database in v1
* simple backend endpoint for AI requests
* UpGrade knowledge included through prompt context, curated documents, or tool-based retrieval
* learning app description collected from the user during chat
* simulated experiment using the demo UpGrade deployment
* final markdown report generation
* copyable report output

MVP likely excludes:

* persistent user accounts or saved project history
* full production UpGrade integration
* automatic client app code modification
* GitHub repo analysis or PR generation
* automatic deployment
* automatic real experiment launch
* unrestricted web search
* broad support for complex UpGrade experiment types

9. Deployment Context

The consulting app is expected to be deployed alongside the existing UpGrade demo app.

Existing demo app:
https://upgrade-demo.carnegielearning.com/

Possible consulting app route:
https://upgrade-demo.carnegielearning.com/ai-consultant

Existing demo UpGrade deployment (frontend):
https://upgrade-demo.carnegielearning.com/upgrade

Existing demo UpGrade deployment (backend used for simulated experiments):
https://upgrade-demo.carnegielearning.com/api

The deployed UpGrade instance may be used by the consulting tool for simulation or preflight demonstrations.

For MVP simplicity, the consulting app may share the existing EC2 instance used for the UpGrade demo app. For this reason, all consulting-app backend API endpoints should be namespaced under `/api/v1/ai-consultant`, e.g., `/api/v1/ai-consultant/chat`.

10. Basic Technical Approach

The exact stack can be decided later, potentially with help from Claude Code, Codex, or another coding LLM.

Current assumptions:

* Web app frontend
* Minimal backend
* One primary AI request endpoint
* Google login
* No v1 database
* file upload support
* Integration with the existing demo UpGrade backend for simulated experiments
* Markdown report generation

The stack should be chosen for implementation speed, maintainability, and ease of LLM-assisted development.

11. User Interface Overview

The app should be simple and minimal.

11.1 Login Page

The first page shows:

* tool name
* short description
* major capabilities
* Google login button
* possibly links to the paper and GitHub repo

Google login is not required for data storage in v1, but can serve as a basic guardrail to prevent random public abuse of AI features.

11.2 Main Chat Page

After login, the user sees a chat-style interface similar to ChatGPT, Claude, or Gemini.

Possible layout:

* Header
    * left: app/tool name
    * right: New Chat button
* Main area
    * AI messages left-aligned
    * user messages right-aligned with a subtle background container
    * minimal visual clutter
* Footer or sticky composer
    * text input area
    * file upload button on the left
    * send button on the right

The interface should feel conversational rather than form-driven.

12. Why Chat-Based Instead of Form-Based

A structured form is useful for collecting fixed information, but this tool is intended to feel like a consulting conversation.

A chat-based approach supports:

* flexible user input
* iterative clarification
* different levels of user expertise
* users who provide all information at once
* users who need step-by-step guidance
* requests for explanation, recommendation, or revision
* a more natural consulting experience

Internally, the app can still maintain structured state. For example, the conversation can populate fields such as:

* app description
* target page/problem
* learning goal
* pain point
* experiment idea
* hypothesis
* conditions
* metrics
* decision point
* simulation result
* final report sections

This allows the user experience to remain conversational while the system output remains structured.

13. Proposed Consulting Flow

The MVP flow consists of six broad phases:

1. Learning App Description
2. Page / Problem Description
3. Experiment Ideation and Hypothesis Refinement
4. UpGrade Experiment Planning
5. Simulation / Preflight Check
6. Report Generation

These phases do not need to be rigidly exposed to users as steps, but they provide a useful internal structure for prompts, state management, and report generation.

14. Phase 1: Learning App Description

Goal:

Collect basic information about the user’s learning app.

Example opening message:

Hi, I’m your AI consultant to help you run experiments on your learning app using UpGrade, an A/B testing platform for education software.

Can you tell me about your learning app? What does it do and who is it for?

Expected user responses:

* user describes their app
* user provides partial information
* user says they do not have an app yet
* user asks for an example learning app description
* user provides an irrelevant or unsupported request

If app information is insufficient, the AI can ask follow-up questions.

If the user has no app or does not want to provide app information, the AI can offer to generate a simple example learning app description so the user can continue the flow.

Example fallback:

That’s alright. Would you like me to generate an example learning app description so we can continue?

If the AI generates an example learning app description, it should ask for user approval before proceeding.

15. Phase 2: Page / Problem Description

Goal:

Collect information about the specific page, problem, activity, or learning interaction where the experiment might run.

Example prompt:

Can you tell me about a page or problem where you would like to run an experiment? How does it look and work currently? You can upload screenshots to help me better understand it.

Expected information:

* page/problem description
* current user flow
* current learning interaction
* pain point or issue
* screenshots, if available
* relevant constraints

If this information was already provided in Phase 1, the AI can skip or shorten this phase.

If the user has no specific page/problem, the AI can generate an example page/problem description based on the learning app description and ask for approval.

16. Phase 3: Experiment Ideation and Hypothesis Refinement

Goal:

Help the user define what they want to experiment on and what outcome they hope to improve.

Example prompt:

Great. Now let’s talk about the experiment itself. What is your core idea, and what specific outcome do you hope to improve?

For example: “I want to add a hint button to see if it increases the problem completion rate.”

If you are not sure yet, you can describe a pain point you have noticed, or ask me for suggestions based on your learning app description.

Possible user paths:

* user provides an experiment idea
* user provides a pain point but no experiment idea
* user asks for suggestions
* user asks the AI to compare ideas
* user uploads more screenshots
* user asks for research grounding

Possible AI actions:

* refine the user’s idea into a clearer hypothesis
* ask clarifying questions
* suggest candidate interventions
* identify possible variants
* explain possible metrics
* surface potential risks
* search for or retrieve relevant papers through a suitable literature-search tool or MCP
* use or reference AI scientist / hypothesis generation ideas from related work

The goal is not necessarily to prove that the idea is correct. The goal is to help the user formulate an experimentable, concrete, and reasonably grounded hypothesis.

17. Related-Paper Support in Phase 3

The tool may support a research-grounding feature.

Potential behavior:

* retrieve up to three related papers
* summarize their relevance
* explain how they support, weaken, or refine the proposed experiment idea
* suggest how the user might adjust the hypothesis or variant design

The current plan is not to use arbitrary open web search for this. Instead, the system may use a suitable paper-search MCP or curated academic search source.

The exact implementation can be decided later.

18. Phase 4: UpGrade Experiment Planning

Goal:

Translate the approved learning app description, page/problem description, and experiment idea into a concrete UpGrade experiment design.

The MVP should focus on simple experiments only.

Supported MVP experiment style:

* between-subject experiment
* individual-level assignment
* one decision point
* simple conditions such as control and variant
* basic condition weights such as 50/50
* Include All participants
* simple metrics

Potentially unsupported or deferred features:

* factorial experiments
* within-subject designs
* group-based condition assignment
* payloads
* exclude-if-reached behavior
* repeatable metrics
* multiple decision points
* complex participant include/exclude logic
* complex segmenting or stratification

The AI should be aware of these MVP limitations. If a user requests an unsupported experiment type, the AI should explain the limitation and suggest a supported alternative where possible.

19. Example Experiment Design Output

The AI can propose an UpGrade-ready experiment design using simple, readable terms.

Example structure:

Name: Hint Button Experiment

Description: Tests whether adding an optional hint button improves completion rate on a target math problem.

App Context: example-math-app

Decision Point:

* Site: problem_page
* Target: problem_123_hint_support

Conditions:

* control: 50%
* hint_button: 50%

Participants:

* Include All

Metrics:

* completionRate: Percent = COMPLETED
* timeOnTask: Mean

Example follow-up:

Does this look good? Let me know if you have any questions or anything you want to update. These settings can be revised before running the experiment in UpGrade.

20. Editable vs Restricted Experiment Fields

Some fields can be safely adjusted by the user:

* name
* description
* app context
* site
* target
* condition names
* metric names

Some fields may be intentionally restricted in the MVP:

* participants default to Include All
* only simple assignment designs are supported
* only simple condition designs are supported
* complex metrics or repeatable metrics may be deferred

The AI should guide the user toward a simple, supported design.

21. Phase 5: Simulation / Preflight Check

Goal:

Give the user a quick demonstration of what assignment, enrollment, metric logging, and result interpretation might look like using the demo UpGrade deployment.

This phase is part of the intended MVP. The user may still choose to skip it during a particular consultation flow, but the prototype should support simulation.

Example prompt:

Do you want to run a quick simulated experiment with a synthetic cohort? This can help you understand what assignment, enrollment, and metric results might look like before setting up a real experiment.

The simulation is not intended to predict real learning outcomes. It is a preflight / demonstration step.

Possible default cohort sizes:

* 100 participants
* 200 participants
* 500 participants
* 1000 participants

The final default can be decided later. A small default such as 100 or 200 may be easier to understand in a demo. A larger synthetic cohort may produce more stable-looking condition splits.

22. Possible Simulation Workflow

If the user agrees to run a simulation, the system may use the demo UpGrade backend to:

* create an experiment
* start the experiment
* simulate synthetic participant visits
* call the appropriate UpGrade flow for initialization / assignment
* mark assigned conditions
* log synthetic metrics
* retrieve result data
* summarize enrollment and metric outcomes
* delete the temporary experiment after the simulation

The exact API calls and implementation details should be verified against the current UpGrade API and demo deployment.

Potential UpGrade-related actions mentioned during planning:

* init (POST /api/v6/init)
* assign (POST /api/v6/assign)
* mark (POST /api/v6/mark)
* log metric values (POST /api/v6/log)
* retrieve result data
* delete temporary experiment

These should be confirmed during implementation.

23. Example Simulation Result Output

The AI can present simulation results in a concise markdown summary.

Example:

Enrollment Data

Condition | Weight (%) | Enrollment
control | 50 | 47
hint_button | 50 | 53

Metric Data

completionRate (Percent = COMPLETED)

Condition | Statistic Value
control | 80.86
hint_button | 60.41

timeOnTask (Mean)

Condition | Statistic Value
control | 10.76
hint_button | 13.01

The AI can then add a short interpretation:

* whether assignment and enrollment look reasonable
* which condition performed better in the simulated data
* what the metric values mean
* whether the result should be treated only as synthetic/demo data
* whether the user wants to rerun the simulation or proceed to report generation

24. Phase 6: Report Generation

Goal:

Generate a final markdown report that the user can copy and share with researchers, developers, stakeholders, or local AI coding tools.

The report is one of the main outputs of the MVP.

The report should capture:

* learning app description
* page/problem description
* experiment idea/hypothesis
* related papers summary, if used
* experiment design details
* UpGrade configuration plan
* simulation summary
* implementation TODO list
* UpGrade local setup guide
* UpGrade experiment creation guide
* client integration guide, including code snippets

Before generating the report, the AI can show a summary of included sections and ask whether the user wants to exclude anything.

Example:

Now I will generate a full report that includes the experiment plan and actionable steps for setting up your experiment in UpGrade.

The report can include:

* App / page description
* Experiment idea and hypothesis
* Related papers summary
* Experiment design details
* Simulated experiment result summary
* UpGrade local setup guide
* UpGrade experiment creation guide
* Client library integration guide, including TypeScript/JavaScript and Python snippets

Does this look good? Let me know if there is anything you want to exclude.

25. Report Output UI

The generated report may be displayed in a code-editor-like or markdown-preview-like area.

Possible UI features:

* markdown content area
* copy button
* maybe download button in a later version
* ability to ask the AI to revise report sections
* ability to regenerate selected sections

The report does not need to be saved in v1 unless persistence is added later.

26. Report as a Shared Artifact

The report can serve as a shared artifact between:

* researchers
* developers
* product teams
* external partner teams
* AI coding tools

It can function as a common language between research planning and implementation.

Potential uses:

* share with a developer to implement the variant and UpGrade integration
* use as an internal experiment planning document
* paste into Claude Code, Codex, or another local AI coding tool
* use as a checklist while setting up UpGrade locally
* adapt into a project ticket or implementation task list

This is one of the main ways the tool can provide value without fully automating code changes.

27. Difference from Existing Documentation

UpGrade already has documentation:

https://upgrade-platform.gitbook.io/upgrade-documentation

The AI-generated report is not meant to replace documentation. It provides a different layer of support.

General documentation:

* covers many possible cases
* requires navigation and interpretation
* may include information unrelated to the user’s specific experiment
* provides general examples that need adaptation

AI-generated report:

* is customized to the user’s app and experiment idea
* includes only the most relevant steps
* explains the experiment-specific plan
* includes specific names, decision points, conditions, and metrics
* can include copyable client integration snippets tailored to the proposed experiment
* can be handed to a developer or AI coding tool as a concrete task artifact

28. Possible Report Sections

A possible report structure:

1. Title
2. Summary
3. Learning App Description
4. Page / Problem Description
5. Experiment Idea
6. Hypothesis
7. Related Research Summary
8. Proposed UpGrade Experiment Design
9. Simulation Result Summary
10. Implementation TODO List
11. UpGrade Local Setup Guide
12. UpGrade Experiment Creation Guide
13. Client Integration Guide
14. Notes, Assumptions, and Limitations
15. Next Steps

The exact section list can be simplified for the demo and paper.

29. Fixed Content and Dynamic Content in Reports

Some report sections are dynamic and should be generated based on the conversation:

* app description
* page/problem description
* hypothesis
* experiment design
* decision point names
* condition names
* metrics
* simulation results
* implementation TODOs

Some report sections may use fixed or semi-fixed templates:

* UpGrade local setup guide
* general UpGrade experiment creation guide
* client library integration explanation
* standard safety/limitations note

To reduce token usage and generation time, fixed sections can be generated through deterministic functions or section-specific tools rather than asking the AI to rewrite them every time.

Possible approaches:

* placeholder replacement
* section-specific tools
* deterministic template renderer
* hybrid AI + template generation

The implementation can decide later.

30. UpGrade Knowledge Requirements

The AI consultant needs enough UpGrade knowledge to explain and generate simple experiment plans.

Potential knowledge areas:

* what UpGrade is
* basic experiment concepts
* app context
* decision point
* site
* target
* condition
* assignment
* participants
* include/exclude lists
* metrics
* enrollment
* experiment states
* client integration flow
* basic API concepts
* local setup flow

For MVP, the AI can focus on the simplest supported path and defer complex features.

UpGrade knowledge can be provided through:

* system prompt
* curated internal summary documents
* retrieved documentation
* small local knowledge base
* MCP/tool calls
* fixed report templates

Key MVP-relevant terms include:

* App Context: The client application where the experiment will run. In UpGrade, this is typically the application name/key known to the platform.
* Decision Point: The location in the client application where an experiment condition needs to be determined.
* Site: The broader category or location for a Decision Point, such as a page, function, or interaction area.
* Target: The specific element within a Site, such as a problem ID, hint button, content area, or timer display.
* Condition: A specific experimental treatment or variation, such as `control` or `hint_button`.
* Assignment: The process of assigning a participant to a Condition while the experiment is running.
* Metric: The outcome or event used to evaluate the experiment.
* Experiment Status: The operational phase of the experiment, such as Inactive, Running, Paused, or Completed.

For the MVP, the AI consultant should focus on simple supported experiment designs. More detailed UpGrade terminology, client library integration details, API behavior, and unsupported/advanced options should be provided later in separate implementation reference documents in the codebase.

31. Learning App Inputs

The learning app description and related experiment-planning inputs are user-provided in the MVP.

Possible inputs:

* learning app description
* page/problem description
* learning goal
* known pain point
* existing experiment idea
* file uploads

Possible future inputs:

* live app URL
* repository URL
* code snippets
* design documents
* product specs
* usage data
* existing analytics

32. Example App Strategy for Demo

A demo likely needs a concrete learning app example.

Possible options:

1. Use a simplified fictional learning app
2. Use a simplified fictional math problem page
3. Use an existing internal app such as MATHia, if appropriate
4. Use a small custom demo app created specifically for this project

A fictional or simplified demo app may be easier to control and explain.

If the demo includes code-level guidance, a small fictional app may be useful because the app structure can be designed to be simple and easy for the AI to reason about.

If the demo focuses only on planning and report generation, screenshots and text descriptions may be sufficient.

33. Prompt / AI Behavior Requirements

The AI consultant should:

* act as an educational experimentation consultant
* guide the user through the consulting flow
* ask for missing information when needed
* avoid overwhelming novice users with unnecessary UpGrade details
* prefer simple supported experiment designs in the MVP
* explain UpGrade terms when useful
* distinguish between recommendations and assumptions
* ask for user confirmation before moving to major phases
* generate structured outputs
* avoid pretending that simulated data predicts real outcomes
* refuse unrelated or unsafe requests
* avoid unsupported complex experiment types unless framed as future work or manual extension
* keep the conversation focused on planning educational experiments with UpGrade

34. Human Review and Control

The MVP should keep the user in control.

The AI can suggest, generate, and organize information, but important decisions should be confirmed by the user.

Examples of confirmation points:

* approving generated example learning app description
* approving generated page/problem description
* approving the experiment idea or hypothesis
* approving the proposed UpGrade experiment design
* choosing whether to run simulation
* approving report sections before final generation

Future automation should preserve human review at key decision points.

35. MVP Non-Goals

The MVP is not intended to:

* replace human researchers
* launch real experiments without human approval
* automatically modify production client app code
* automatically create GitHub PRs
* automatically deploy changes
* support every UpGrade feature
* perform unrestricted literature review
* make causal claims from simulated data
* replace UpGrade documentation
* replace the UpGrade UI

The MVP is intended to help users produce a structured, actionable experiment plan.

36. Long-Term Vision: Executable Experiment Artifacts

The generated report could eventually become more than a static document.

Long-term, the report could act as an executable or semi-executable artifact in a larger automation workflow.

Possible future workflow:

1. Researcher uses the AI consultant to generate an experiment report
2. Researcher approves the report
3. The report is committed to the client app repository as a markdown file
4. A developer or AI coding agent reviews the report
5. An AI coding agent creates a PR that implements variant content and client app integration
6. A developer reviews and merges the PR
7. A CI/CD or agent workflow creates the corresponding UpGrade experiment configuration
8. A researcher reviews the generated experiment in UpGrade
9. The researcher updates final details such as participants if needed
10. The researcher starts the experiment
11. After completion, an AI tool helps analyze results and generate a summary report

This future direction would need careful design, validation, security, and human approval.

37. Possible Benefits of the Long-Term Vision

If implemented carefully, a more automated workflow could:

* reduce repeated communication between researchers and developers
* reduce the risk of creating an UpGrade experiment before the client app is ready
* ensure the implementation plan and experiment configuration stay aligned
* make experimentation more repeatable
* reduce onboarding friction for external teams
* make UpGrade easier to adopt
* help scale educational experimentation beyond expert-supported consulting

This long-term vision is not required for the MVP.

38. Related References and Possible Inspiration

The following references were identified as potentially relevant. They may inform the paper, the tool design, or future directions.

These links are included as reference candidates. Their exact relevance should be verified before being used in the final paper.

### Towards an AI co-scientist

Reference: https://arxiv.org/pdf/2502.18864

Summary

`Towards an AI co-scientist` presents a human-in-the-loop, multi-agent AI system for scientific hypothesis generation. Given a scientist-provided research goal, the system generates candidate hypotheses, critiques and compares them, ranks stronger candidates, and refines them into more promising research directions.

The paper focuses on biomedical research, so it should not be treated as direct evidence for educational A/B testing or UpGrade adoption. Its value for this project is as related work on AI-assisted hypothesis generation and refinement.

Relevance to Our Paper / Tool

This is a useful core reference for the experiment ideation phase. Our project does not try to automate scientific discovery, but it can borrow the same general pattern for helping users move from vague learning-app pain points to clearer, testable educational experiment hypotheses.

Possible framing:

> Inspired by AI co-scientist approaches to hypothesis generation and critique, our prototype helps users generate, compare, and refine candidate educational experiment ideas before translating one selected idea into an UpGrade experiment plan.

Tool-design takeaway:

* Borrow the generate → critique → rank → refine pattern.
* Use it for test idea / hypothesis recommendation, not for the entire experiment lifecycle.
* The MVP can implement this as a lightweight structured ideation step, not a full multi-agent debate or tournament-ranking system.
* Full multi-agent architecture or external AI co-scientist frameworks should be treated as future work unless actually implemented.

---

### EXPERIGEN

Reference: https://openreview.net/pdf?id=LKGflZgEKB

Summary

`EXPERIGEN` is a collaborative agentic framework for data-driven hypothesis generation with experimental verification. It pairs a Generator, which proposes natural-language hypotheses, with an Experimenter, which operationalizes hypotheses, constructs features, runs statistical tests, and returns evidence for refinement.

The paper is not education-specific, but it is highly relevant because it connects hypothesis generation with evidence-aware refinement and A/B-testing-like validation.

Relevance to Our Paper / Tool

This is another core reference for the experiment ideation and hypothesis refinement phase. It supports the idea that AI should not merely suggest plausible test ideas, but should help make hypotheses concrete, measurable, and evidence-aware before implementation.

Possible framing:

> EXPERIGEN shows how AI-generated hypotheses can be paired with an evidence-seeking loop that operationalizes, tests, and refines candidate hypotheses. Our tool applies a narrower, human-controlled version of this idea to educational experimentation planning by helping users generate and refine testable intervention hypotheses before configuring them for UpGrade.

Tool-design takeaway:

* Generate candidate test ideas from the user’s learning app description and pain point.
* Check whether each idea is concrete enough to test.
* Identify the metric or observation that would support or weaken the hypothesis.
* Refine vague ideas into testable hypotheses before moving to UpGrade planning.

Important caveat: our MVP simulation uses synthetic data to demonstrate UpGrade mechanics. It does not experimentally verify whether an educational intervention will work.

---

### Towards end-to-end automation of AI research

Reference: https://www.nature.com/articles/s41586-026-10265-5

Summary

`Towards end-to-end automation of AI research` presents The AI Scientist, an agentic system that attempts to automate much of the machine learning research lifecycle, including idea generation, literature search, experiment planning, code implementation, experiment execution, result analysis, manuscript writing, and automated review.

The paper is about AI/ML research automation, not educational experimentation or UpGrade onboarding.

Relevance to Our Paper / Tool

This is mainly a long-term-vision reference. It can help position our project against broader work on automated research workflows, while making clear that our prototype is intentionally narrower and more human-controlled.

Possible framing:

> Whereas recent AI scientist systems explore end-to-end automation of machine learning research, our work focuses on a narrower practical onboarding problem: using AI to help educational software teams plan, review, and prepare experiments for implementation in UpGrade.

Tool-design takeaway:

* Useful for future-work framing around semi-executable experiment artifacts.
* The generated report could eventually guide AI coding tools, UpGrade setup, simulation, implementation tasks, or result analysis.
* Do not imply that the MVP automatically modifies code, runs real experiments, creates PRs, or writes final research papers.

---

### ASI-Evolve: AI Accelerates AI

Reference: https://arxiv.org/pdf/2603.29640

Summary

`ASI-Evolve` presents an agentic framework for iterative AI research automation. The system follows a learn → design → experiment → analyze loop, where prior knowledge and past results are used to generate new candidates, run experiments, analyze outcomes, and feed reusable insights into the next iteration.

The paper focuses on AI-for-AI research, not education, A/B testing, or platform adoption.

Relevance to Our Paper / Tool

This is also mainly a long-term-vision reference. It is less central than `Towards an AI co-scientist` and `EXPERIGEN`, but it is useful for thinking about future closed-loop experimentation support.

Tool-design takeaway:

* The useful pattern is iterative feedback: prior knowledge → candidate idea → experiment/simulation → analysis → reusable insight.
* For future versions, previous experiment plans, simulation outputs, implementation notes, real results, and human feedback could help generate better next experiment ideas.
* For the MVP, this should remain future framing rather than a promised feature.

If the related references section becomes too long, this can be merged with `Towards end-to-end automation of AI research` under a broader theme such as “AI-assisted and automated research workflows.”

---

### Optimizely blog post: AI experimentation

Reference: https://www.optimizely.com/insights/blog/AI-experimentation

Summary

This Optimizely blog post describes how AI agents can support different stages of the experimentation lifecycle, from ideation and prioritization to planning, variation development, QA, analysis, and follow-up recommendations.

It is a product/industry blog post, not an academic reference. Its value is mainly UX and product inspiration.

Relevance to Our Paper / Tool

This reference is optional. It is probably not necessary for the final academic paper, but it can stay in the project/spec document as a reminder of the staged experimentation-assistant UX that originally inspired part of the tool flow.

Tool-design takeaway:

* Experimentation support is broader than experiment configuration alone.
* A useful assistant may support ideation, planning, preflight/QA, interpretation, and next-step recommendation.
* Our MVP already covers a narrower version of this through learning app description, page/problem description, experiment ideation, UpGrade planning, simulation/preflight, and report generation.
* The main remaining UX takeaway is to make the staged consulting flow visible enough for users to understand where they are, while keeping the interaction conversational.

Recommendation: keep this in the project document if useful for product memory, but remove it from the final paper unless industry context is explicitly needed.

---

### Overall Reference Prioritization

If the section needs to be shortened later, prioritize the references this way:

1. Keep `Towards an AI co-scientist` for hypothesis generation, critique, ranking, and refinement.
2. Keep `EXPERIGEN` for evidence-aware hypothesis refinement and A/B-testing-like validation.
3. Keep one or both long-term automation references only if the paper discusses future semi-executable experiment artifacts or closed-loop experimentation workflows.
4. Treat the Optimizely blog post as optional UX/product inspiration, not a core academic reference.

Suggested grouping for the final paper:

* Core related work: `Towards an AI co-scientist`, `EXPERIGEN`
* Future-work context: `Towards end-to-end automation of AI research`, `ASI-Evolve`
* Optional product inspiration: Optimizely blog post

39. Possible Paper Framing

The paper can be framed around a practical gap:

External teams may need expert help to adopt educational experimentation platforms, especially when translating high-level learning goals, product pain points, or intervention ideas into concrete experiment plans and implementation steps.

The proposed tool explores whether AI-assisted consulting can reduce this onboarding burden by helping users:

* describe their learning app and target interaction
* generate and refine testable experiment ideas
* define hypotheses, conditions, decision points, and metrics
* understand how the experiment could be configured in UpGrade
* run a synthetic simulation / preflight demonstration
* produce a structured report that can be shared with researchers, developers, stakeholders, or AI coding tools

The paper should emphasize that this is not an end-to-end autonomous research system. The prototype is intentionally narrower and human-controlled. It supports experiment ideation, planning, onboarding, and implementation readiness, while leaving real experiment launch, production code modification, and final research judgment to human teams.

Possible paper contribution areas:

* motivation from external UpGrade onboarding
* description of an AI-assisted consulting workflow
* support for experiment ideation and hypothesis refinement
* prototype design
* representative use case
* simulation/preflight workflow
* generated experiment-planning report as a shared artifact
* discussion of benefits, limitations, and future automation

The exact emphasis can be adjusted later depending on the final prototype and available space.

40. Possible Abstract Direction

A future abstract may describe:

* the challenge of adopting educational experimentation platforms
* the current reliance on expert consultation
* the proposed AI-assisted experimentation consultant
* the chat-based consulting flow
* support for generating and refining testable experiment ideas
* the proposed UpGrade experiment plan
* the synthetic simulation/preflight demonstration
* the generated actionable report
* implications for scaling UpGrade adoption and educational experimentation

The abstract should avoid implying that the tool autonomously validates educational hypotheses or runs real experiments. The safer framing is that the tool helps teams move from vague experiment ideas to structured, human-reviewable experiment plans.

This document does not attempt to finalize the abstract.

41. Demo Strategy

A lightweight demo could show:

1. User logs in
2. AI asks about the learning app
3. User provides a simple app/page description and screenshot
4. AI helps refine an experiment idea
5. AI proposes an UpGrade experiment design
6. User approves the design
7. User runs or skips a simulated experiment
8. AI summarizes simulated results
9. AI generates a final report
10. User copies the report

The demo can use a fictional app or a simplified educational problem to keep the flow understandable.

42. Open Questions

Product / UX:

* Should the app expose the six phases visually, or keep them implicit in chat?
* Should images be shown inline in the conversation?
* Should we add a log out button to the UI or rely on cookie expiration?

Input:

* What file formats should we support for MVP?

AI behavior:

* Should related-paper lookup be an optional step?

Simulation:

* What synthetic cohort size should be the default?

Technical:

* Which stack is the most suitable for this MVP?
* How should prompt context and UpGrade knowledge be organized?


43. Risks and Considerations

Potential risks:

* scope creep
* AI giving incorrect UpGrade guidance
* poor-quality paper recommendations
* confusion between demo simulation and real evidence
* privacy/security issues if users upload sensitive app information

Potential mitigations:

* keep MVP focused on planning and report generation
* clearly label simulation as synthetic/demo-only
* use curated UpGrade knowledge
* use constrained experiment types
* keep human approval points
* use templates for fixed guide sections

44. MVP Prototype With Simulation

The intended MVP includes simulation as a concrete preflight demonstration.

The simulation demonstrates:

* condition assignment
* enrollment
* metric logging
* simple result interpretation
* how UpGrade would represent the experiment outcome

Simulation should be framed as a preflight demonstration rather than predictive evidence. The purpose is to help users understand the mechanics of running and interpreting an UpGrade experiment before they run a real experiment with real learners.

The user may skip simulation during a particular consultation, but the prototype should support it as part of the MVP.

45. Key Message

The project is motivated by a practical observation:

External teams may need substantial expert help to adopt UpGrade and plan educational experiments.

The proposed AI consultant attempts to systematize part of that expert consultation process.

It helps users move from a high-level learning app description and experiment idea to a structured, actionable plan for running an experiment with UpGrade.
