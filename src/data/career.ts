export type NodeKind = 'edu' | 'coursework' | 'research' | 'industry' | 'project'

export type CareerNode = {
  id: string
  title: string
  org?: string
  start: string    // "YYYY-MM" — drives sector-time display
  end?: string     // omit if ongoing
  kind: NodeKind
  stack: string[]  // drives telemetry channels
  summary: string  // hover preview (1–2 lines)
  detail: string   // engineer's readout panel (full)
  links?: { label: string; url: string }[]
  feeds?: string   // why this led to the next node(s)
}

export type Edge = { from: string; to: string }

// ── Nodes ─────────────────────────────────────────────────────────────────────

export const nodes: CareerNode[] = [
  // ── Foundation ──────────────────────────────────────────────────────────────

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
      'The degree runs two parallel tracks: a systems track (OS, algorithms, C programming) ' +
      'and a data-systems track (databases, big data). ' +
      'Coursework: Data Structures & Algorithms, OS, Big Data Systems, Database Management & Systems.',
    feeds:
      'The CS core splits into a systems track and a data track that each feed separate downstream work before converging at HG Insights.',
  },

  // ── Coursework ──────────────────────────────────────────────────────────────

  {
    id: 'coursework-systems',
    title: 'Systems Programming & OS',
    org: 'UW–Madison',
    start: '2023-09',
    end: '2024-12',
    kind: 'coursework',
    stack: ['C', 'OS', 'Data Structures', 'Algorithms', 'Linux'],
    summary: 'OS internals and data structures & algorithms. C programming throughout.',
    detail:
      'Coursework covering operating systems and data structures & algorithms.\n\n' +
      '**OS track**: process scheduling, virtual memory, file systems, concurrency primitives, ' +
      'and the kernel lifecycle — all implemented in C.\n\n' +
      '**Algorithms track**: asymptotic analysis, sorting, graph algorithms, dynamic programming, ' +
      'and complexity classes.\n\n' +
      'The low-level C and systems programming foundation built here carries into every subsequent role ' +
      'requiring embedded firmware or backend infrastructure.',
    feeds:
      'C and systems programming knowledge feeds directly into steering-wheel firmware at Wisconsin Racing and backend pipeline infrastructure at HG Insights.',
  },

  {
    id: 'coursework-data',
    title: 'Databases & Big Data Systems',
    org: 'UW–Madison',
    start: '2024-01',
    end: '2025-05',
    kind: 'coursework',
    stack: ['SQL', 'PostgreSQL', 'Python', 'Big Data', 'Distributed Systems'],
    summary: 'Database internals and big data systems. SQL, query optimization, large-scale data processing.',
    detail:
      'Coursework covering Database Management & Systems and Big Data Systems.\n\n' +
      '**Database track**: SQL, relational algebra, query planning and optimization, ' +
      'transaction management, indexing structures, and storage engine fundamentals.\n\n' +
      '**Big data track**: distributed processing, partitioning, fault tolerance, ' +
      'and large-scale data pipeline design.\n\n' +
      'The database internals coursework naturally raises the question of more efficient index structures — ' +
      'directly motivating the novel data structure work.',
    feeds:
      'Database and distributed-systems depth feeds into large-scale data pipeline work at HG Insights and motivates the novel data structure patent.',
  },

  // ── Industry ─────────────────────────────────────────────────────────────────

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
    feeds:
      'First production fullstack and AI product experience — API design, prompt safety, and deployment — feeds into the AI Mock Interview project and the HG Insights internship.',
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
      '**20% to 100%**, then categorized them into a 180-class taxonomy to make the training set consistent.\n\n' +
      '**Production impact** — Shipped the model into production, powering market analysis for ' +
      '**75% of the tech companies in the Fortune 100**.',
    feeds:
      'Production LangGraph orchestration and MCP experience at HG directly enables the research lab\'s MCP-based neural network deployment.',
  },

  // ── Projects ─────────────────────────────────────────────────────────────────

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
    feeds:
      'Multi-agent orchestration and FastAPI discipline demonstrates readiness for LangGraph pipeline work at HG Insights.',
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
      'Trained and evaluated multiple **neural network** architectures to improve classification, reaching ' +
      '**81% accuracy** on recognizing critical Mandarin phonetic contrasts.\n\n' +
      'Productionized an **MCP server** exposing the model via the local network, giving lab students a clean ' +
      'interface to run the neural network and classify Mandarin phonetics without any ML setup — ' +
      'built with Claude Code.',
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
      'The structure emerged from database internals coursework — specifically from examining ' +
      'why a standard index visits nodes provably outside a query\'s predicate range.\n\n' +
      '**Patent filed** for the novel data structure. ' +
      'Also contributed an open-source fix to VSCode.',
  },
]

// ── Edges ─────────────────────────────────────────────────────────────────────
//
// DAG narrative:
//   edu            → coursework tracks (systems + data)
//   systems track  → aeries, wiscracing, hg (backend infrastructure)
//   data track     → aeries, hg (pipelines), ppt (novel index)
//   aeries         → mockinterview (first fullstack → personal project), hg
//   mockinterview  → hg (multi-agent readiness → LangGraph work)
//   hg             → research (LangGraph/MCP experience → research MCP server)
//
// hg has 4 inbound edges (cs-sys, cs-data, aeries, mockinterview) — convergence node.

export const edges: Edge[] = [
  { from: 'edu',                to: 'coursework-systems' },
  { from: 'edu',                to: 'coursework-data'    },
  { from: 'coursework-systems', to: 'aeries'             },
  { from: 'coursework-data',    to: 'aeries'             },
  { from: 'coursework-systems', to: 'wiscracing'         },
  { from: 'coursework-systems', to: 'hg'                 },
  { from: 'coursework-data',    to: 'hg'                 },
  { from: 'coursework-data',    to: 'ppt'                },
  { from: 'aeries',             to: 'mockinterview'      },
  { from: 'aeries',             to: 'hg'                 },
  { from: 'mockinterview',      to: 'hg'                 },
  { from: 'hg',                 to: 'research'           },
]
