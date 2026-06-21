// Frozen Semantic Scholar snapshot for the MiniMathApp presentation demo.
//
// The candidates are the exact normalized, ranked results from a successful
// live search. Keeping the snapshot local removes rate-limit and search-index
// variance during the presentation while preserving the real tool-use flow.

export const MINIMATH_DEMO_SEARCH_INPUT = {
  researchContext: {
    subject: 'mathematics education',
    mechanism: 'optional on-demand hints',
    setting: 'online learning / intelligent tutoring',
    outcome: 'problem completion',
  },
  specificQueries: [
    'optional hint button effect on first-attempt correctness in math problems',
    'on-demand hints and student performance in math practice',
  ],
  domainQueries: [
    'on-demand hints mathematics education',
    'help seeking behavior intelligent tutoring systems mathematics',
    'hint availability mathematics learning outcomes',
  ],
  resultsPerQuery: 5,
};

export const MINIMATH_DEMO_CANDIDATES = [
  {
    title:
      'Revisiting the Hint Button: Consistent Negative Associations Between Unproductive Hint Use and Learning Outcomes in Intelligent Tutoring Systems',
    authors: ['Marshall An', 'Mahboobe Mehrvarz', 'John C. Stamper', 'Bruce M. McLaren'],
    year: 2026,
    venue: 'International Conference on Learning Analytics and Knowledge',
    abstract:
      'Intelligent Tutoring Systems (ITSs) commonly provide on-demand multi-level hints designed to scaffold learning, yet their relationship with learning outcomes remains complex. While unproductive hint-use behaviors are well documented, existing detection methods often rely on sophisticated models or tutor-specific features that hinder broader adoption. Through a multi-semester analysis of 999 K–12 mathematics students, this study demonstrates that simple, interpretable indicators of unproductive hint use—premature hint requests and superficial hint reading—are consistently associated with reduce...',
    url: 'https://www.semanticscholar.org/paper/71eb7a29ba027978057bec9018a054fa383bacef',
    doi: '10.1145/3785022.3785040',
    citationCount: 0,
  },
  {
    title: 'Typifying Students’ Help-Seeking Behavior in an Intelligent Tutoring System for Mathematics',
    authors: ['Roberto A. Meléndez-Armenta', 'Genaro Rebolledo-Méndez', 'N. S. Huerta-Pacheco'],
    year: 2021,
    venue: 'INGENIERÍA INVESTIGA',
    abstract:
      "The use of tutoring systems has become normalized in secondary schools (grades 7-9) in many parts of the world. There have been studies analyzing the students' behavior, their affective responses, or the abuse of the system, but little has been done to discover other types of behavior. This paper presents evidence that there are different types of help-seeking behavior which can be typified in Mexican students interacting with the Scooter intelligent tutoring system (ITS), which was designed to teach mathematics at secondary-level. The implemented methodology consisted of applying discovery al...",
    url: 'https://www.semanticscholar.org/paper/fcc06aae6014ac5f6702f016bf1853b3b680e4fb',
    doi: '10.15446/ing.investig.v42n2.84495',
    citationCount: 5,
  },
  {
    title:
      'The Use of Digital Technologies at School and Cognitive Learning Outcomes: A Population-Based Study in Finland',
    authors: ['A. Saarinen', 'J. Lipsanen', 'M. Hintsanen', 'M. Huotilainen', 'L. Keltikangas-Järvinen'],
    year: 2021,
    venue: 'International Journal of Educational Psychology',
    abstract:
      'Recently, the use of information and communications technology (ICT) at school has been extensively increased in Finland. This study investigated whether the use of ICT at school is linked to students ‘learning outcomes in Finland. We used the Finnish PISA 2015 data (N=5037). Cognitive learning outcomes (i.e. science, mathematics, reading, collaborative problem-solving) were evaluated with computer-based tests. ICT use at school, ICT availability at school, and students’ perceived ICT competence were assessed with self-rating questionnaires. Frequent ICT use at school predicted students’ weake...',
    url: 'https://www.semanticscholar.org/paper/fa6ece2914c92c1e39f42a472ed89c00e6b0cd11',
    doi: '10.17583/IJEP.2021.4667',
    citationCount: 30,
  },
  {
    title: 'Designing Tools for Caregiver Involvement in Intelligent Tutoring Systems for Middle School Mathematics',
    authors: ['Ha Tien Nguyen', 'Conrad Borchers', 'Meng Xia', 'Vincent Aleven'],
    year: 2024,
    venue: 'Proceedings of the 18th International Conference of the Learning Sciences - ICLS 2024',
    abstract:
      ": Intelligent tutoring systems (ITS) can help students learn successfully, yet little work has explored the role of caregivers in shaping that success. Past interventions to support caregivers in supporting their child’s homework have been largely disjunct from educational technology. The paper presents prototyping design research with nine middle school caregivers. We ask: (1) what are caregivers’ preferences for different prototypes incorporating data-driven recommendations into their math homework support? Integrating caregivers' preferences, we then ask: (2) what are caregivers’ perception...",
    url: 'https://www.semanticscholar.org/paper/be0dfe359c7d4ab6be34400b7431395793a160f1',
    doi: '10.22318/icls2024.630637',
    citationCount: 4,
  },
  {
    title: 'Warning About AI Fallibility Increases Help-Seeking in an Intelligent Tutoring System',
    authors: ['Tomohiro Nagashima', 'Mirella Hladký', 'Vera Rief'],
    year: 2026,
    venue: null,
    abstract:
      'Recent work in Technology-Enhanced Learning and Human-Computer Interaction highlights the importance of transparency and trust calibration in AI-supported learning environments as they pose a risk of hallucinations. In this study, we investigate whether a simple transparency intervention that warns students that a pedagogical agent may make mistakes affects learner behavior in a math intelligent tutoring system. We conducted a classroom experiment with 252 school students using two system versions: one including a warning message about potential system errors, and one that does not mention pot...',
    url: 'https://www.semanticscholar.org/paper/6ab1d36d80ca8b41cef572d806030faab6f6b7b2',
    doi: null,
    citationCount: 0,
  },
  {
    title: "Do Students' Learning Outcomes in Mathematics Change Depending on The Availability of Learning Facilities",
    authors: [
      'Radhitya Duta Pradana',
      'Endrayana Putut',
      'Laksminto Emanuel',
      'Christi Matitaputty',
      'Wahyuningtyas Puspitorini',
    ],
    year: 2025,
    venue: 'International Journal of Studies in International Education',
    abstract:
      "The purpose of this quantitative descriptive study is to ascertain how students' learning outcomes in mathematics are impacted by the availability of learning facilities.  In order to increase learning outcomes, the teaching and learning process will be more successful if supported by sufficient facilities, such as  proper study tables, additional illumination sources, lighting indications throughout the house,  appropriate study chairs, appropriate bookcases, availability of math textbooks and worksheet books, internet access at home, sufficient cell phones, student-owned question banks, and...",
    url: 'https://www.semanticscholar.org/paper/502f523faf90fcffa738ff4f64a0e09450d37ef7',
    doi: '10.62951/ijsie.v2i2.289',
    citationCount: 1,
  },
  {
    title:
      "Analysis of the Application of Game-Based Learning Methods on Students' Mathematics Learning Outcomes in Grade V of SDN 2 Bentek in the 2024/2025 Academic Year",
    authors: ['Tiratul Aini', 'Nunung Mardianti', 'Tutik ‘Alawiyah'],
    year: 2025,
    venue: 'Jurnal Ilmiah Mandala Education',
    abstract:
      'This study focuses on analysing the application of game-based learning methods in mathematics learning in fifth grade elementary school. In addition, this study also aims to identify factors that influence the effectiveness of applying game-based learning methods in mathematics learning and to describe the impact of applying game-based learning methods in improving mathematics learning outcomes. The research method used is qualitative research with a descriptive type and employs the Miles and Huberman design model.The research results indicate that the implementation of Game-Based Learning (GB...',
    url: 'https://www.semanticscholar.org/paper/e396a5780f41446bf8a155150941fedf0fd93ac6',
    doi: '10.58258/jime.v11i4.9306',
    citationCount: 0,
  },
  {
    title:
      'DEVELOPMENT OF ANDROID-BASED EXPOMATH MEDIA WITH A DIFFERENTIATED APPROACH TO IMPROVE STUDENT LEARNING OUTCOMES AND INTERESTS',
    authors: [
      'Lenni Yunita',
      'Harahap',
      'Mariam Nasution',
      'A. Rangkuti',
      'Tadris Mathematics',
      'Uin Syekh',
      'Ali Hasan',
      'Ahmad Addary Padangsidimpuan',
    ],
    year: 2025,
    venue: 'Proceeding International Conference on Islam, Law, and Society (INCOILS)',
    abstract:
      'The creation of the Android-based Expomath media stems from the limited availability of learning resources that leverage technology with a differentiated approach, particularly for ranked number material. Additionally, there is a gap in the utilization of technological advancements to create learning tools tailored to diverse student needs. This study aims to enhance students\' learning outcomes and interests by providing engaging, interactive media aligned with various learning styles. The research adopts the Research and Development (R&D) approach using the ADDIE model, encompassing Analysis,...',
    url: 'https://www.semanticscholar.org/paper/2d1f376e6c0382dd818604d9bd792aeefe00ee20',
    doi: '10.70062/incoils.v4i1.248',
    citationCount: 0,
  },
  {
    title: 'Mathematics and modern society: A Delphi study exploring mathematics education towards Education 4.0',
    authors: ['Evan P. Taja-on', 'Bryan Kim C. Dajero', 'Melvin G. Barete'],
    year: 2025,
    venue: 'Educational Point',
    abstract:
      'Mathematics plays a crucial role in fostering innovation and addressing societal challenges, making its enhancement essential in the context of Education 4.0. This study addresses a gap in the literature by providing expert-driven recommendations for transforming mathematics education in response to the demands of Education 4.0, which has been underexplored in existing research. Through an iterative consultation process, experts agreed on integrating key 21st-century skills such as critical thinking, creativity, collaboration, and digital literacy. The findings emphasize the importance of inno...',
    url: 'https://www.semanticscholar.org/paper/003dbf271575fb4b7242f46e1a75c52a4e9a14b3',
    doi: '10.71176/edup/16534',
    citationCount: 5,
  },
  {
    title: 'Mathematics and Bildung 1810 to 1850',
    authors: ['H. Jahnke'],
    year: 2019,
    venue: 'ICME-13 Monographs',
    abstract:
      'Section 5.1 of this chapter is written by Hans Niels Jahnke on the basis of his presentation at ICME 13. Michael Fried was invited to react to this presentation at ICME 13 and elaborated his reaction as Sect. 5.2 of this chapter. Although the authors are only responsible for their respective parts, the parts belong together and are therefore published here as a joint chapter. The first part analyzes the role of mathematics within the ideas on education of the neo-humanist movement. It refers to the period of around 1800–1850 and concentrates on the thinking of W. von Humboldt and the two catch...',
    url: 'https://www.semanticscholar.org/paper/db795a349f5ccbf8a008d423b85b3afca164b40d',
    doi: '10.1007/978-3-030-11069-7_5',
    citationCount: 3,
  },
  {
    title: 'Designing for metacognition—applying cognitive tutor principles to the tutoring of help seeking',
    authors: ['Ido Roll', 'V. Aleven', 'B. McLaren', 'K. Koedinger'],
    year: 2007,
    venue: null,
    abstract: null,
    url: 'https://www.semanticscholar.org/paper/722b988491e01647ac2827ec010de4f24196d0ae',
    doi: '10.1007/S11409-007-9010-0',
    citationCount: 126,
  },
  {
    title: 'Examining disciplinary specificity of preservice mathematics and science teachers’ professional identities',
    authors: ['Wittaya Pulsawad', 'A. Tong-on', 'Luecha Ladachart', 'Ladapa Ladachart'],
    year: 2024,
    venue: 'International Journal of Science and Mathematics Education',
    abstract: null,
    url: 'https://www.semanticscholar.org/paper/b988798ccbdaf533cb4fb2f059eb08d159875bcf',
    doi: '10.1007/s10763-024-10486-y',
    citationCount: 7,
  },
];

export const MINIMATH_DEMO_SELECTED_PAPERS = [
  {
    title:
      'Revisiting the Hint Button: Consistent Negative Associations Between Unproductive Hint Use and Learning Outcomes in Intelligent Tutoring Systems',
    url: 'https://www.semanticscholar.org/paper/71eb7a29ba027978057bec9018a054fa383bacef',
    authorsYear: 'An et al., 2026',
    relevance:
      'A multi-semester study of 999 K–12 math students that directly examines on-demand hint buttons in tutoring systems — the same mechanism and population as our experiment.',
    designImplication:
      'Suggests tracking how hints are used (e.g. premature requests, superficial reading), so consider a hint-usage metric alongside first-attempt correctness rather than assuming hints are always productive.',
  },
  {
    title: 'Designing for Metacognition — Applying Cognitive Tutor Principles to the Tutoring of Help Seeking',
    url: 'https://www.semanticscholar.org/paper/722b988491e01647ac2827ec010de4f24196d0ae',
    authorsYear: 'Roll, Aleven, McLaren & Koedinger, 2007',
    relevance:
      'A foundational, heavily-cited study on help-seeking and on-demand help in math cognitive tutors, directly relevant to how students engage an optional hint.',
    designImplication:
      'Reinforces measuring whether students use help appropriately, supporting a hint-engagement metric and caution against interpreting raw completion gains in isolation.',
  },
  {
    title: "Typifying Students' Help-Seeking Behavior in an Intelligent Tutoring System for Mathematics",
    url: 'https://www.semanticscholar.org/paper/fcc06aae6014ac5f6702f016bf1853b3b680e4fb',
    authorsYear: 'Meléndez-Armenta et al., 2021',
    relevance:
      'Studies help-seeking behavior among secondary math students in an ITS — the same mechanism, subject, and age range as MiniMathApp.',
    designImplication:
      'Indicates help-seeking varies by student type, so segmenting or at least monitoring hint usage could help interpret first-attempt correctness results.',
  },
];

export const MINIMATH_DEMO_REFINEMENT =
  'These papers consistently point to one refinement: add a hint-usage metric (e.g. proportion of students who open the hint) so we can tell whether correctness changes are driven by productive help-seeking, and read completion gains with that caution in mind. The core hint-button hypothesis itself can stay as-is.';

export const MINIMATH_DEMO_CONFIRMATION_QUESTION =
  'Should I apply that refinement (add a hint-usage metric) and continue to the UpGrade experiment design?';
