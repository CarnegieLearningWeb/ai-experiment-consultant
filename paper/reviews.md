## PELE 2026 reviewer comments

These are the reviews we want to consider while revising the camera-ready version. The first review was a strong accept and mostly positive. The second review accepted the paper but gave concrete suggestions.

These comments should be treated as guidance rather than strict requirements. We should address suggestions that clearly improve the paper, clarify the contribution, or better align the text with the implemented prototype. However, not every suggestion needs to be applied if it would overcomplicate the paper, conflict with the current scope, or require changes that are unnecessary for the camera-ready version. When a reviewer suggestion is optional, difficult to apply cleanly, or not clearly beneficial, it is acceptable to note it, consider it, and leave the current paper direction unchanged.

----------------------- REVIEW 1 ---------------------

SUBMISSION: 4
TITLE: AI-Assisted Experimentation Consulting for Educational Platform Adoption

----------- Overall evaluation -----------
SCORE: 3 (strong accept)
----- TEXT:
I have watched UpGrade over the years. Now this paper reports on a new version of an LLM tool that prototypes an "AI-assisted experimentation consultant that guides users through a six-phase workflow, from gathering a description of the app through generating a report that describes testable hypotheses". This paper shows a plausible scenario.
There are no unsupported claims. The paper seems worthwhile for the AB testing workshop.


----------------------- REVIEW 2 ---------------------

SUBMISSION: 4
TITLE: AI-Assisted Experimentation Consulting for Educational Platform Adoption

----------- Overall evaluation -----------
SCORE: 2 (accept)
----- TEXT:
AI-Assisted Experimentation Consulting for Educational Platform Adoption

Summary:
In this paper, the author(s) walk through a new AI prototype meant to assist EdTech stakeholders in creating A/B tests with the UpGrade software from Carnegie Learning. The tool gathers information on the EdTech tool’s context including any potential research questions, then guides the user through making an experiment in UpGrade. The authors cite this as one of the most challenging parts on onboarding new UpGrade users and hope the AI can assist with that.

Strengths:
The prototype represents an interesting application of generative AI that seeks to solve a real problem in the Learning Engineering community. The tool has the potential to help expand access to experimentation to those without a research background, which would be a boon to students and end users. While still in early stages of development, the tool presents some insightful features that represent deep thinking about the users’ needs. For example:
The preflight phase where the tool builds a temporary experiment to test the idea is extremely cool and a valuable part of the process, ensuring the user doesn’t have to waste as much time fact-checking the AI.
The iterative experimentation idea is also very interesting! (Allowing users to upload previous experiment documentation as part of context collection.)
I believe that the user testing that is to be conducted in the Fall will only help improve the prototype into a useful tool.

Weaknesses:
Generally, I think the paper could be better-cited - perhaps with more of a discussion on why this tool is needed and what its implications might be outside of UpGrade users, for the Learning Engineering community at large.
The entire time I was reading through the flow I was wishing I had an example use case to follow along with, only to find out that there was an example at the end of the paper! You might consider mentioning the use case inclusion in your introduction, or incorporating the example flow into your break down of the flow. For example, you would talk about context collection in section 4.1, then immediately explain how this would work for ExampleMathApp. Repeat this process for each step of the flow.
I’m a little confused in “Design Goals and Scope” - I thought that you were describing the 6-step workflow mentioned in the abstract, but number 5 (Keep humans in control) doesn’t seem like a step so much as a feature. But then I saw that you described the list as a list of “design goals”. Not sure what fix to suggest here, just noting that it was confusing.
I feel like you should give the tool a name? Referring to it as “the AI” or “the prototype” doesn’t make it very memorable.
Really long run on sentence at the beginning of section 4.1, consider breaking that up.
If you are going to leave the example use case as its own section, I would add sub-headers for each of the 6 steps of the flow so readers can follow along a bit easier.
You may want to include a link to an example output from the AI tool rather than just listing what will be in the export.
The single decision point limitation seems like a significant one, I’m not sure if that does represent the most common type of UpGrade experiment type anymore. If I were you, that would be the first limitation I would address.
Though it is not required, the authors might consider aligning the format of the document with the standards of the conference.