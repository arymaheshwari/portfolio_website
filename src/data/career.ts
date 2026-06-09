export type NodeKind = 'edu' | 'coursework' | 'research' | 'industry' | 'project' | 'resume'

export type CareerNode = {
  id: string
  title: string
  org?: string
  start: string    // "YYYY-MM"
  end?: string     // omit if ongoing
  kind: NodeKind
  stack: string[]
  summary: string  // hover preview (1–2 lines)
  detail: string   // readout panel (full)
  links?: { label: string; url: string }[]
  feeds?: string   // why this led to the next layer
  image?: string   // optional portrait shown in the readout panel
}

export type Edge = { from: string; to: string }

// ── Nodes ─────────────────────────────────────────────────────────────────────

export const nodes: CareerNode[] = [
  // ── Layer 0 · Foundation ────────────────────────────────────────────────────

  {
    id: 'edu',
    title: 'B.S. Computer Science & Data Science',
    org: 'University of Wisconsin–Madison',
    start: '2023-09',
    end: '2027-05',
    kind: 'edu',
    stack: ['Python', 'C', 'Java', 'JavaScript', 'SQL', 'R'],
    summary: 'GPA 3.7. Dual CS + Data Science degree. Graduating May 2027.',
    detail:
      'University of Wisconsin–Madison, graduating May 2027. GPA 3.7/4. ' +
      'Dual degree in Computer Science and Data Science.\n\n' +
      'The foundation node — every course branches from here, and the coursework in turn ' +
      'feeds the internships, research, and projects downstream.',
    feeds: 'The degree branches into the core coursework that underpins every role and project.',
  },

  // ── Layer 1 · Coursework ────────────────────────────────────────────────────

  {
    id: 'ds-algo',
    title: 'Data Structures & Algorithms',
    org: 'UW–Madison',
    start: '2023-09',
    end: '2024-05',
    kind: 'coursework',
    stack: ['Java', 'Algorithms', 'Data Structures', 'Complexity'],
    summary: 'Core algorithms and data structures — the analytical backbone for everything that follows.',
    detail:
      'Asymptotic analysis, sorting and searching, trees, hashing, graph algorithms, ' +
      'dynamic programming, and complexity classes. ' +
      'The reasoning toolkit applied across every downstream role and project.',
    feeds: 'Algorithmic fundamentals feed directly into the internships, research, and projects.',
  },

  {
    id: 'os',
    title: 'Operating Systems',
    org: 'UW–Madison',
    start: '2024-01',
    end: '2024-12',
    kind: 'coursework',
    stack: ['C', 'Concurrency', 'Virtual Memory', 'Linux'],
    summary: 'OS internals in C — processes, memory, concurrency, file systems.',
    detail:
      'Process scheduling, virtual memory, concurrency primitives, synchronization, ' +
      'and file systems — implemented in C against a teaching kernel. ' +
      'The low-level systems grounding behind the firmware and backend infrastructure work.',
    feeds: 'Systems-level C and concurrency knowledge feeds the internships, research, and embedded projects.',
  },

  {
    id: 'bigdata',
    title: 'Big Data Systems',
    org: 'UW–Madison',
    start: '2024-09',
    end: '2025-05',
    kind: 'coursework',
    stack: ['Spark', 'Distributed Systems', 'Python', 'Hadoop'],
    summary: 'Distributed data processing at scale — partitioning, fault tolerance, pipelines.',
    detail:
      'Distributed processing models, partitioning, shuffling, fault tolerance, ' +
      'and large-scale pipeline design with Spark/Hadoop-style systems. ' +
      'The mental model behind the 15M-row normalization pipeline at HG Insights.',
    feeds: 'Distributed-systems thinking feeds the data-pipeline internships, research, and projects.',
  },

  {
    id: 'dbms',
    title: 'Database Management & Systems',
    org: 'UW–Madison',
    start: '2024-09',
    end: '2025-05',
    kind: 'coursework',
    stack: ['SQL', 'PostgreSQL', 'Query Optimization', 'Indexing'],
    summary: 'Database internals — SQL, query planning, transactions, indexing structures.',
    detail:
      'Relational algebra, SQL, query planning and optimization, transactions, ' +
      'and indexing structures down to the storage engine. ' +
      'Directly motivated the novel index data structure that was later patented.',
    feeds: 'Database internals feed the data-heavy internships and the novel data-structure project.',
  },

  {
    id: 'ai',
    title: 'Artificial Intelligence',
    org: 'UW–Madison',
    start: '2025-01',
    end: '2025-05',
    kind: 'coursework',
    stack: ['Search', 'Probabilistic Models', 'Neural Networks', 'Python'],
    summary: 'Classical and modern AI — search, reasoning, learning, and neural networks.',
    detail:
      'Adversarial and heuristic search, constraint satisfaction, probabilistic reasoning, ' +
      'and the foundations of machine learning and neural networks.\n\n' +
      'The conceptual grounding behind the EEG speech-classification research.',
    feeds: 'AI foundations feed directly into the EEG speech-classification research.',
  },

  // ── Layer 2 · Internships & Research ────────────────────────────────────────

  {
    id: 'aeries',
    title: 'Candidate-Ranking Tool',
    org: 'Aeries Technology · Mumbai (Product Intern)',
    start: '2024-05',
    end: '2024-08',
    kind: 'industry',
    stack: ['Python', 'React', 'Docker', 'GCP', 'REST APIs'],
    summary:
      'Full-stack candidate-ranking tool — React frontend, agentic Python backend. ' +
      'Cuts manual screening from weeks to minutes. Deployed on GCP.',
    detail:
      'Product Intern at Aeries Technology, Mumbai. May 2024 – August 2024.\n\n' +
      'Built a full-stack candidate-ranking tool with a React frontend and an agentic Python backend, ' +
      'cutting manual screening of hundreds of applicants from weeks to minutes.\n\n' +
      'Developed REST APIs connecting the frontend to the ranking service, with ' +
      '**prompt-injection checks** and output verification to keep rankings reliable.\n\n' +
      'Containerized with **Docker** and deployed on **GCP**, running end-to-end from ' +
      'resume input to a ranked shortlist surfaced to HR.',
    feeds: 'First production full-stack + AI experience — carries into every shipped project.',
  },

  {
    id: 'hg',
    title: 'Revenue Growth & Market Analysis Model',
    org: 'HG Insights · Santa Barbara (SWE Intern)',
    start: '2025-05',
    kind: 'industry',
    stack: ['Python', 'LangGraph', 'AWS AgentCore', 'AWS Lambda', 'Docker', 'ECR', 'SLM'],
    summary:
      'LangGraph DAG pipeline for Revenue Growth & Market Analysis. ' +
      'Normalized 15M+ rows (20%→100% completeness), 180-class taxonomy. ' +
      'Powers market analysis for 75% of Fortune 100 tech companies.',
    detail:
      'Software Engineering Intern at HG Insights, a B2B technology intelligence company. ' +
      'May 2025 – Dec 2025, May 2026 – Current.\n\n' +
      '**Revenue Growth & Market Analysis pipeline** — Designed and built the backend pipeline in Python, ' +
      'architecting a **LangGraph** DAG that orchestrates SEC filing ingestion and a trained **SLM**. ' +
      'Deployed on **AWS AgentCore, Lambda, and ECR (Docker)**.\n\n' +
      '**Data curation and normalization** — Drove data completeness for **15M+** unique rows from ' +
      '**20% to 100%**, then categorized them into a 180-class taxonomy.\n\n' +
      '**Production impact** — Shipped into production, powering market analysis for ' +
      '**75% of the tech companies in the Fortune 100**.',
    feeds: 'LangGraph orchestration and pipeline experience carries directly into the shipped projects.',
  },

  {
    id: 'research',
    title: 'EEG Speech Classification Research',
    org: 'University of Wisconsin–Madison (Research Assistant)',
    start: '2025-09',
    end: '2026-05',
    kind: 'research',
    stack: ['Python', 'PyTorch', 'EEG / Signal Processing', 'Neural Networks', 'MCP', 'Claude Code'],
    summary:
      '81% accuracy classifying Mandarin phonetic contrasts from raw EEG signals. ' +
      'MCP server productionized for lab use via Claude Code.',
    detail:
      'Undergraduate Research Assistant, University of Wisconsin–Madison. Sep 2025 – May 2026.\n\n' +
      'Built a **ML pipeline** to classify natural speech from raw EEG signals, implementing the methodology ' +
      'from **Berg et al. (2021) IEEE Paper** in Python end-to-end — signal preprocessing and classification.\n\n' +
      'Trained and evaluated multiple **neural network** architectures, reaching ' +
      '**81% accuracy** on recognizing critical Mandarin phonetic contrasts.\n\n' +
      'Productionized an **MCP server** exposing the model over the local network, giving lab students a ' +
      'clean interface to run the network without any ML setup — built with Claude Code.',
    feeds: 'ML pipeline and MCP tooling experience feeds the shipped projects.',
  },

  // ── Layer 3 · Projects ──────────────────────────────────────────────────────

  {
    id: 'wiscracing',
    title: 'Formula SAE Steering & DAQ Firmware',
    org: 'Wisconsin Racing (Formula SAE)',
    start: '2025-09',
    kind: 'project',
    stack: ['C', 'ESP32', 'CAN bus', 'Python', 'Firmware'],
    summary:
      'Steering-wheel firmware in C on ESP32. ' +
      '1st Design, 2nd Autocross, 7th Overall at FSAE Michigan 2025.',
    detail:
      'Led the design for the steering-wheel firmware and low-level control software in **C** on an **ESP32**, ' +
      'managing real-time driver inputs over **CAN bus** and analog potentiometers.\n\n' +
      'Built and programmed aerodynamic data-acquisition tools to record on-track performance, ' +
      'validated on the car at Ford\'s Wind Tunnel in Detroit, MI.\n\n' +
      'Placed **1st in Design**, **2nd in Autocross**, and **7th Overall** at Formula FSAE Michigan 2025.',
  },

  {
    id: 'mockinterview',
    title: 'AI Mock Interview System',
    org: 'Personal Project',
    start: '2025-01',
    kind: 'project',
    stack: ['Python', 'FastAPI', 'React', 'OpenAI', 'Ollama', 'Multi-agent'],
    summary:
      'Multi-agent interview platform — 150+ users in the first month. ' +
      'FastAPI + React, multi-model routing across OpenAI and Ollama.',
    detail:
      'Architected a multi-agent interview platform, coordinating specialized agents for ' +
      'resume analysis, question generation, and response evaluation, served through a ' +
      '**FastAPI** backend and **React** frontend.\n\n' +
      'Reached **150+ users** in the first month during recruiting season, running voice-based ' +
      'mock interviews end-to-end from resume upload to scored feedback.\n\n' +
      'Engineered **multi-model routing** across hosted (OpenAI) and self-hosted (Ollama) LLMs, ' +
      'decoupling the system from any single provider for cost and availability control.',
  },

  {
    id: 'ppt',
    title: 'Novel Data Structure — Patent Filed',
    org: 'Personal Research',
    start: '2025-03',
    kind: 'project',
    stack: ['Python', 'C++', 'Data Structures', 'Algorithms'],
    summary:
      'Novel tree-based data structure for range-predicate queries. Patent filed. ' +
      'Also contributed open-source code to VSCode.',
    detail:
      'Designed and implemented a novel tree-based data structure optimized for range-predicate queries. ' +
      'Non-matching subtrees are pruned at traversal time based on stored partition bounds, ' +
      'reducing comparisons for queries with selective predicates.\n\n' +
      'The structure emerged from database internals — examining why a standard index visits nodes ' +
      'provably outside a query\'s predicate range.\n\n' +
      '**Patent filed** for the novel data structure. Also contributed an open-source fix to VSCode.',
  },

  // ── Layer 4 · Output ────────────────────────────────────────────────────────

  {
    id: 'resume',
    title: 'Résumé',
    org: 'Compiled Output',
    start: '2023-09',
    end: '2027-05',
    kind: 'resume',
    image: '/profile.png',
    stack: ['Full Résumé', 'LinkedIn', 'GitHub', 'Email'],
    summary: 'The terminal node — every path through the graph resolves here. Links to reach me.',
    detail:
      'This is the terminal node: every path through the graph converges here.\n\n' +
      'Education seeds the coursework, the coursework feeds the internships and research, ' +
      'and those resolve into the projects that define the work. ' +
      'The **résumé is the compiled artifact** of that whole execution.\n\n' +
      'Reach me through the links below.',
    links: [
      { label: 'LinkedIn — /in/arymaheshwari', url: 'https://www.linkedin.com/in/arymaheshwari/' },
      { label: 'GitHub — @arymaheshwari',      url: 'https://github.com/arymaheshwari' },
      { label: 'Email — maheshwari25@wisc.edu', url: 'mailto:maheshwari25@wisc.edu' },
    ],
  },
]

// ── Edges ─────────────────────────────────────────────────────────────────────
//
// Curated DAG:
//   edu seeds every course
//   DS&A, Big Data, DBMS  → HG + Aeries
//   AI                    → Research
//   OS                    → Wisconsin Racing       (course → project, direct)
//   DBMS                  → Novel Data Structure    (course → project, direct)
//   Aeries, HG            → AI Mock Interview
//   Research + all projects → résumé (terminal node)

const COURSES  = ['ds-algo', 'bigdata', 'dbms', 'os', 'ai']
const PROJECTS = ['wiscracing', 'mockinterview', 'ppt']

export const edges: Edge[] = [
  // education seeds every course
  ...COURSES.map(c => ({ from: 'edu', to: c })),

  // coursework → internships
  { from: 'ds-algo', to: 'hg' },
  { from: 'ds-algo', to: 'aeries' },
  { from: 'bigdata', to: 'hg' },
  { from: 'bigdata', to: 'aeries' },
  { from: 'dbms',    to: 'hg' },
  { from: 'dbms',    to: 'aeries' },

  // coursework → research
  { from: 'ai',      to: 'research' },

  // coursework → projects (direct)
  { from: 'os',      to: 'wiscracing' },
  { from: 'dbms',    to: 'ppt' },

  // internships → project
  { from: 'aeries',  to: 'mockinterview' },
  { from: 'hg',      to: 'mockinterview' },

  // everything resolves into the résumé
  { from: 'research', to: 'resume' },
  ...PROJECTS.map(p => ({ from: p, to: 'resume' })),
]
