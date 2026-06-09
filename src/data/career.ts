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
  // ── Foundations ─────────────────────────────────────────────────────────────

  {
    id: 'edu',
    title: 'B.S. Computer Science & Data Science',
    org: 'University of Wisconsin–Madison',
    start: '2023-09',
    end: '2027-05',
    kind: 'edu',
    stack: ['Python', 'C', 'Java', 'SQL', 'Linux'],
    summary: 'GPA 3.8. Dual CS + Data Science degree; systems and data tracks running in parallel.',
    detail:
      'University of Wisconsin–Madison, graduating May 2027. GPA 3.8. ' +
      'The degree runs two parallel tracks: a low-level systems track (C, OS, architecture) ' +
      'and a data-systems track (databases, distributed computing, ML). ' +
      'Both tracks converge at the industry nodes — the systems depth feeds the infrastructure work, ' +
      'the data depth feeds the pipeline work.',
    feeds: 'The CS core splits into two parallel tracks that develop independently before converging at HG Insights.',
  },

  {
    id: 'coursework-systems',
    title: 'Systems Programming',
    org: 'CS 354 · CS 537 — UW–Madison',
    start: '2023-09',
    end: '2024-12',
    kind: 'coursework',
    stack: ['C', 'x86 Assembly', 'xv6', 'POSIX', 'Linux'],
    summary:
      'Machine organization, OS internals. Built a custom memory allocator, shell, thread pool, ' +
      'concurrent BST, and extended xv6 with mmap, xattr, and a container runtime.',
    detail:
      'CS 354 (Machine Organization & Programming) and CS 537 (Operating Systems). ' +
      'Written in C throughout. ' +
      'Projects: custom memory allocator (free-list coalescing), POSIX shell with pipes/redirection, ' +
      'thread pool with work-stealing queue, concurrent BST with fine-grained locking. ' +
      'Extended the xv6 teaching OS: added mmap/munmap, extended attributes (xattr), ' +
      'a lightweight container runtime, and a scheduling policy. ' +
      'Also studied cache hierarchy, virtual memory, and process scheduling.',
    feeds:
      'C and OS-level systems knowledge feeds directly into bare-metal firmware (Wisconsin Racing) ' +
      'and backend infrastructure design (HG Insights).',
  },

  {
    id: 'coursework-data',
    title: 'Database & Big-Data Systems',
    org: 'CS 564 · CS 544 — UW–Madison',
    start: '2024-01',
    end: '2025-05',
    kind: 'coursework',
    stack: ['SQL', 'Python', 'Spark', 'Cassandra', 'HDFS', 'Docker', 'Java'],
    summary:
      'Database internals and distributed data systems. Implemented a Buffer Manager, ' +
      'Heap File Manager, and B+ Tree index from scratch. Worked with Spark, Cassandra, HDFS.',
    detail:
      'CS 564 (Database Management Systems) and CS 544 (Big Data Systems). ' +
      'From-scratch implementations: Buffer Manager with LRU eviction, Heap File Manager, ' +
      'B+ Tree index with split/merge. Query parsing and optimization fundamentals. ' +
      'In the big-data half: Spark RDDs and DataFrames, Cassandra wide-column modeling, ' +
      'HDFS block layout, Docker-based cluster setup. ' +
      'Emphasis throughout on understanding what happens below the abstraction boundary.',
    feeds:
      'Buffer management, B+ tree internals, and distributed-system mental models feed directly ' +
      'into the data pipeline work at HG Insights and motivate the Predicate Partition Tree structure.',
  },

  {
    id: 'research-eeg',
    title: 'EEG/FFR Signal Classification',
    org: 'UW–Madison Neuroscience Lab',
    start: '2024-01',
    end: '2024-08',
    kind: 'research',
    stack: ['Python', 'NumPy', 'SciPy', 'scikit-learn', 'MNE-Python'],
    summary:
      'Built a signal-processing and classification pipeline for EEG/FFR data ' +
      'to decode Mandarin tonal features — first applied-ML pipeline work.',
    detail:
      'Undergraduate research in a cognitive neuroscience lab studying auditory brainstem responses. ' +
      'The task: classify EEG frequency-following responses (FFR) to distinguish Mandarin lexical tones. ' +
      'Built end-to-end: raw EEG ingestion → bandpass filtering → epoch extraction → ' +
      'feature engineering (spectral, temporal) → scikit-learn classifier pipeline. ' +
      'First experience owning a full data pipeline from raw sensor data to model output. ' +
      'Introduced the pattern of treating a pipeline as a typed sequence of transforms — ' +
      'a pattern that recurs in every subsequent role.',
    feeds:
      'Owning a full ML pipeline from raw data to output — and the discipline of typed, reproducible transforms — ' +
      'carries directly into the clinical NLP pipeline at Aeries.',
  },

  // ── Industry ─────────────────────────────────────────────────────────────────

  {
    id: 'aeries',
    title: 'Small Language Model — Clinical Screening',
    org: 'Aeries Technology · Mumbai',
    start: '2024-05',
    end: '2024-08',
    kind: 'industry',
    stack: ['Python', 'PyTorch', 'Hugging Face', 'FastAPI', 'PostgreSQL'],
    summary:
      'Built an SLM pipeline that ingests doctor–patient transcripts and produces structured ' +
      'clinical screening outputs. First production SLM work.',
    detail:
      'Designed and implemented a pipeline to transform unstructured doctor–patient conversation ' +
      'transcripts into structured clinical screening summaries using a fine-tuned small language model. ' +
      'Owned the full stack: data cleaning and prompt construction, fine-tuning loop, ' +
      'evaluation harness, and a FastAPI inference service backed by PostgreSQL. ' +
      'Key constraint: the model had to run on modest hardware (no GPU serving budget), ' +
      'which forced careful quantization and batching decisions. ' +
      'This was the first time I shipped a language model into a production pipeline ' +
      'rather than a research notebook.',
    feeds:
      'First production SLM — established the foundation for the NER pipeline and ' +
      'LangGraph DAG orchestration work at HG Insights.',
  },

  {
    id: 'hg',
    title: 'Data & ML Infrastructure',
    org: 'HG Insights · Santa Barbara (SWE Intern)',
    start: '2024-09',
    end: '2025-08',
    kind: 'industry',
    stack: [
      'Python', 'LangGraph', 'AWS Lambda', 'Docker', 'SQS', 'Databricks',
      'Pydantic', 'RoBERTa', 'ECR', 'asyncio', 'MCP',
    ],
    summary:
      'Built distributed data pipelines and ML infrastructure on AWS. ' +
      'LangGraph DAG orchestration, NER models, SEC filing enrichment, ' +
      'and a custom MCP server for CSV enrichment.',
    detail:
      'Multi-stint internship at a B2B intelligence company. Work spanned four distinct pipeline systems:\n\n' +
      '**LangGraph DAG pipelines** — Designed and deployed multi-step data processing DAGs on ' +
      'AWS Lambda/Docker with SQS for parallelization and Databricks for compute-intensive stages. ' +
      'Built the orchestration layer that coordinates between queue producers, Lambda workers, ' +
      'and downstream consumers.\n\n' +
      '**NER model development** — Fine-tuned JobBERT and RoBERTa with BILOU tagging for ' +
      'product-mention extraction from company tech-stack descriptions. ' +
      'Owned the training pipeline, evaluation, and the serving integration.\n\n' +
      '**Firmographics enrichment pipeline** — Built a pipeline to extract structured company attributes ' +
      'from SEC 10-K/10-Q filings. Pydantic models for schema enforcement; ' +
      'deployed on AWS Lambda via ECR.\n\n' +
      '**MCP server for CSV enrichment** — Implemented a custom Model Context Protocol server ' +
      'with asyncio parallelism for high-throughput CSV enrichment tasks.',
    feeds:
      'Multi-step pipeline orchestration and LangGraph experience feeds directly into ' +
      'the multi-agent architecture of the AI Mock Interview system ' +
      'and the financial due-diligence pipeline.',
  },

  {
    id: 'wiscracing',
    title: 'Firmware Engineer — Wind-Tunnel Calibration Rig',
    org: 'Wisconsin Racing (Formula SAE)',
    start: '2023-09',
    kind: 'industry',
    stack: ['C', 'Arduino', 'ESP32', 'Python', 'DRV8825', 'Serial/UART'],
    summary:
      'Designed and built a pitot-tube gimbal calibration rig for wind-tunnel testing — ' +
      'full firmware from scratch on ESP32/Arduino with a Python orchestration layer.',
    detail:
      'Wisconsin Racing is UW–Madison\'s Formula SAE team. ' +
      'As a firmware engineer, I owned the pitot-tube gimbal calibration rig — ' +
      'a mechanism used in wind-tunnel sessions to sweep the pitot tube across calibration angles ' +
      'and validate airspeed sensor accuracy.\n\n' +
      'Scope: designed the motor control system using DRV8825 stepper drivers, ' +
      'implemented UART serial communication between the ESP32 and a Python host, ' +
      'wrote the full firmware from scratch (no RTOS — bare-metal loop with state machine), ' +
      'and built the Python orchestrator that sequences calibration passes, ' +
      'reads sensor output, and logs structured data for the aerodynamics team.',
    feeds:
      'Direct application of CS 354/537 systems knowledge to real embedded hardware — ' +
      'proves the systems track translates from xv6 to production firmware.',
  },

  // ── Shipped Projects ─────────────────────────────────────────────────────────

  {
    id: 'mockinterview',
    title: 'AI Mock Interview System',
    org: 'Personal Project',
    start: '2025-01',
    end: '2025-06',
    kind: 'project',
    stack: ['Python', 'CrewAI', 'FastAPI', 'React', 'TypeScript', 'OpenAI', 'Ollama'],
    summary:
      'Multi-agent mock interview platform — specialized agents for questioning, evaluation, ' +
      'and feedback. 150+ users. Supports both OpenAI and local Ollama models.',
    detail:
      'A multi-agent system where distinct agents handle different roles in the interview loop: ' +
      'a questioning agent (generates role-specific questions from a job description), ' +
      'an evaluation agent (scores responses against a rubric), ' +
      'and a feedback agent (synthesizes actionable feedback). ' +
      'Orchestrated with CrewAI; FastAPI backend; React/TypeScript frontend.\n\n' +
      'Supports both OpenAI (cloud) and Ollama (local) as the model backend — ' +
      'the agent logic is model-agnostic by design. ' +
      '150+ users organically. ' +
      'The architecture maps directly from the LangGraph DAG pipelines at HG — ' +
      'multi-step orchestration with typed inputs/outputs between agents.',
    links: [],
    feeds:
      'Demonstrates that the pipeline orchestration skills from HG transfer to ' +
      'consumer-facing multi-agent product work.',
  },

  {
    id: 'duediligence',
    title: 'Financial Due-Diligence Dashboard',
    org: 'Personal Project',
    start: '2025-06',
    end: '2025-09',
    kind: 'project',
    stack: ['React', 'TypeScript', 'Python', 'FastAPI', 'LangGraph', 'PostgreSQL'],
    summary:
      'Dashboard that runs automated due-diligence analysis on financial documents — ' +
      'multi-step extraction pipeline feeding a React visualization layer.',
    detail:
      'A full-stack application for automated financial due-diligence. ' +
      'The backend is a LangGraph-orchestrated pipeline: document ingestion → ' +
      'section extraction → structured data normalization (Pydantic) → ' +
      'risk and signal summarization → PostgreSQL storage. ' +
      'The React frontend visualizes the pipeline outputs as a structured dashboard ' +
      'with drill-down into individual document sections. ' +
      'Built directly from the patterns established at HG — ' +
      'SEC filing parsing, Pydantic schema enforcement, and multi-step orchestration ' +
      'all carry over with minimal adaptation.',
    links: [],
  },

  {
    id: 'ppt',
    title: 'Predicate Partition Tree',
    org: 'Research / Patent Pending',
    start: '2025-03',
    kind: 'project',
    stack: ['Python', 'C++', 'Data Structures', 'Query Optimization'],
    summary:
      'A tree-based data structure for range-predicate queries. ' +
      'Partition-aware traversal prunes non-matching branches early. Patent application in progress.',
    detail:
      'The Predicate Partition Tree (PPT) is a custom tree structure designed to answer ' +
      'range-predicate queries more efficiently than a naive scan by partitioning the ' +
      'key space at each internal node in a predicate-aware way. ' +
      'Non-matching subtrees are pruned at traversal time based on stored partition bounds, ' +
      'reducing the number of comparisons for queries with selective predicates.\n\n' +
      'The structure emerged from the B+ Tree work in CS 564 — ' +
      'specifically from asking why a standard B+ tree has to visit nodes that are ' +
      'provably outside a query\'s predicate range. ' +
      'Patent application in progress. ' +
      'Implementation in Python (prototype) and C++ (performance evaluation).',
    links: [],
  },
]

// ── Edges ─────────────────────────────────────────────────────────────────────

export const edges: Edge[] = [
  { from: 'edu',               to: 'coursework-systems' },
  { from: 'edu',               to: 'coursework-data'    },
  { from: 'coursework-systems', to: 'wiscracing'         },
  { from: 'coursework-systems', to: 'hg'                 },
  { from: 'coursework-data',   to: 'hg'                  },
  { from: 'research-eeg',      to: 'aeries'              },
  { from: 'aeries',            to: 'hg'                  },
  { from: 'hg',                to: 'mockinterview'       },
  { from: 'hg',                to: 'duediligence'        },
  { from: 'coursework-data',   to: 'ppt'                 },
]
