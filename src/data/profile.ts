export interface TimelineItem {
  year: string;
  role: string;
  company: string;
  location: string;
  description: string;
  bullets: string[];
  techStack: string[];
}

export interface SkillCategory {
  name: string;
  skills: { name: string; level: number; tag: 'Expert' | 'Advanced' | 'Proficient' }[];
}

export const PROFILE_DATA = {
  name: 'Shaik Naseer John Ahmed',
  title: 'Backend & Systems Engineer | Cloud & Concurrency Architect',
  location: 'Hyderabad, India (Open to Remote)',
  email: 'sknaseer.fez@gmail.com',
  phone: '+91 7780650107',
  github: 'https://github.com/Naseer-fez',
  linkedin: 'https://linkedin.com/in/naseer-fez',
  twitter: 'https://github.com/Naseer-fez',
  status: 'Open for Backend, Systems & Full-Stack Engineering roles',
  bio: [
    'I am a backend and systems engineer specializing in high-concurrency architectures, streaming data pipelines, zero-configuration remote access tunneling, and request-throttling engines. Currently pursuing my B.Tech in CSBS at Vignana Bharathi Institute of Technology (VBIT), Hyderabad, I build robust software that balances clean architectural design with deep algorithmic foundations.',
    'My recent engineering work includes architecting NasCloud (a self-hosted cloud storage engine with zero-intermediate-write streaming and NAT-traversing tunnels), authoring apirlpy (a high-performance, pluggable API rate limiter published on PyPI tested under 100k client workloads), and developing TapNap for ephemeral link sharing with cryptographic TTL enforcement.',
    'Beyond systems programming in Python, C/C++, and SQL, I actively build engineering communities as the Founder of the VBIT CSBS Coding Club, Co-Lead of the Arrna Tech Team, and Vice President of Street Cause (pan-India NGO), empowering student developers through collaborative sprints and open-source tooling.',
  ],
  stats: [
    { label: 'PyPI Packages', value: '1+ Published' },
    { label: 'Projects Shipped', value: '10+' },
    { label: 'Benchmarked Clients', value: '100k+' },
    { label: 'Async Concurrency', value: '500+ Conns' },
  ],
  timeline: [
    {
      year: '2024 — Present',
      role: 'Founder & Lead',
      company: 'Departmental Coding Club — VBIT (CSBS)',
      location: 'Hyderabad, India',
      description:
        'Founded and lead the CSBS department’s coding club, organizing peer programming sessions, competitive algorithmic problem solving, and technical workshops.',
      bullets: [
        'Organize weekly hands-on peer programming sprints, data structures workshops, and coding challenges.',
        'Developed automated challenge runners and test harness tools to benchmark student submissions.',
        'Mentored junior students in systems programming, algorithmic complexity, and debugging techniques.',
      ],
      techStack: ['Python', 'C', 'C++', 'Data Structures', 'Algorithms', 'Linux', 'Git'],
    },
    {
      year: '2024 — Present',
      role: 'Co-Lead, Tech Team',
      company: 'Arrna',
      location: 'Hyderabad, India',
      description:
        'Co-leading technical architecture for internal platforms, member management systems, and automated CI/CD deployment pipelines.',
      bullets: [
        'Designed modular backend services and secure authentication workflows with role-based access control.',
        'Constructed automated CI/CD pipelines using GitHub Actions for containerized testing and rapid deployment.',
        'Standardized Git workflows and code review processes across distributed developer squads.',
      ],
      techStack: ['Python', 'Flask', 'Docker', 'GitHub Actions', 'PostgreSQL', 'Linux'],
    },
    {
      year: '2024 — Present',
      role: 'Vice President',
      company: 'Street Cause (Pan-India Student-Run NGO)',
      location: 'Hyderabad, India',
      description:
        'Served as Vice President of the college division for a renowned pan-India NGO spanning 65+ institutions and 30+ cities, empowering youth through social initiatives.',
      bullets: [
        'Direct community service initiatives, technical outreach programs, and cross-college youth empowerment projects.',
        'Coordinate organizational operations, team management, and event execution across multiple campus chapters.',
        'Spearheaded digital campaigns and technology enablement for community service operations.',
      ],
      techStack: ['Leadership', 'Operations Management', 'Community Outreach', 'Team Coordination'],
    },
    {
      year: '2023 — 2024',
      role: 'Social Media Coordinator',
      company: 'Eco Club & Robotics Club — VBIT',
      location: 'Hyderabad, India',
      description:
        'Managed social media outreach campaigns, technical content creation, and digital branding for college technology and environmental clubs.',
      bullets: [
        'Designed high-engagement digital outreach campaigns and managed event marketing across social platforms.',
        'Collaborated with student robotics teams to document technical projects and hardware workshops.',
        'Increased student engagement and event participation by over 40% across club initiatives.',
      ],
      techStack: ['Digital Outreach', 'Technical Content', 'Community Engagement', 'Social Media Strategy'],
    },
    {
      year: '2024 — 2028 (Expected)',
      role: 'B.Tech in Computer Science and Business Systems',
      company: 'Vignana Bharathi Institute of Technology (VBIT)',
      location: 'Hyderabad, India',
      description:
        'Pursuing Bachelor of Technology with focus on Systems Programming, Distributed Architectures, Database Management, and Cloud Technologies.',
      bullets: [
        'Core coursework: Data Structures, Algorithms, Operating Systems, Database Systems, Computer Networks, and Software Engineering.',
        'Active open-source contributor and publisher on Python Package Index (PyPI).',
        'Demonstrated leadership across departmental coding organizations and student NGO leadership councils.',
      ],
      techStack: ['Python', 'C', 'C++', 'SQL', 'PostgreSQL', 'Linux', 'Docker', 'Git'],
    },
  ] as TimelineItem[],
  skillCategories: [
    {
      name: 'Languages & Core Systems',
      skills: [
        { name: 'Python', level: 96, tag: 'Expert' },
        { name: 'SQL (PostgreSQL / MySQL / SQLite)', level: 92, tag: 'Expert' },
        { name: 'C / C++', level: 86, tag: 'Advanced' },
        { name: 'JavaScript / TypeScript', level: 85, tag: 'Advanced' },
        { name: 'HTML5 / CSS3', level: 88, tag: 'Advanced' },
      ],
    },
    {
      name: 'Backend & Frameworks',
      skills: [
        { name: 'Flask / Flask-JWT-Extended', level: 95, tag: 'Expert' },
        { name: 'SQLAlchemy / ORM Architecture', level: 92, tag: 'Expert' },
        { name: 'stream-zip / Streaming I/O', level: 90, tag: 'Expert' },
        { name: 'rapidfuzz / NumPy / Matplotlib', level: 86, tag: 'Advanced' },
        { name: 'Gunicorn & Waitress WSGI', level: 90, tag: 'Expert' },
      ],
    },
    {
      name: 'Databases & Storage Engines',
      skills: [
        { name: 'PostgreSQL & MySQL', level: 92, tag: 'Expert' },
        { name: 'SQLite (WAL Mode & Concurrency)', level: 90, tag: 'Expert' },
        { name: 'In-Memory Caching & Eviction', level: 88, tag: 'Advanced' },
        { name: 'Reentrant Locking & Snapshot Isolation', level: 88, tag: 'Advanced' },
        { name: 'Dirty-Flag Cache Invalidation', level: 86, tag: 'Advanced' },
      ],
    },
    {
      name: 'Cloud, DevOps & Tooling',
      skills: [
        { name: 'Docker & Containerization', level: 90, tag: 'Expert' },
        { name: 'Cloudflare Tunnel & NAT Traversal', level: 92, tag: 'Expert' },
        { name: 'GitHub Actions CI/CD', level: 88, tag: 'Advanced' },
        { name: 'PyPI Package Publishing', level: 92, tag: 'Expert' },
        { name: 'Linux CLI & PyInstaller', level: 90, tag: 'Expert' },
        { name: 'Load Benchmarking & Thread Testing', level: 88, tag: 'Advanced' },
      ],
    },
  ] as SkillCategory[],
};
