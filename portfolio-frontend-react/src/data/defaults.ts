import type {
  Profile,
  EducationItem,
  SkillGroup,
  ExperienceItem,
  ProjectItem,
  CertificationItem,
  AchievementItem
} from '../types';

export const defaultProfile: Profile = {
  name: 'Mahidhar',
  role: 'Software Engineer',
  tagline: 'Backend-leaning full-stack engineer. I design APIs, ship distributed systems, and care a lot about the details nobody sees — until something breaks.',
  bioParagraphs: [
    "I'm a software engineer with six years of experience building backend systems and developer tooling, currently focused on distributed data infrastructure. I like problems that involve a real tradeoff — latency vs. consistency, simplicity vs. flexibility — and I write down the reasoning so the next engineer doesn't have to guess.",
    "Outside of work I contribute to a couple of open-source CLI tools, mentor junior engineers, and I'm slowly working through a personal project that turns old flight data into readable visualizations."
  ],
  location: 'Bengaluru, India',
  experienceLabel: '6 years',
  focus: 'Backend & Infra',
  availability: 'Open to work',
  email: 'hello@mahidhar.dev',
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  twitter: 'https://x.com/yourusername',
  resumeUrl: 'resume.pdf',
  photoUrl: '',
  design: 'lavender'
};


export const defaultEducation: EducationItem[] = [
  { degree: 'B.Tech in Computer Science', institution: 'Indian Institute of Information Technology, Bengaluru', duration: '2016 — 2020', detail: 'CGPA: 8.7/10 — Coursework in distributed systems, databases, and operating systems.', certificateUrl: 'certificates/btech-degree.pdf', icon: '🎓', order: 1 },
  { degree: 'Higher Secondary Education', institution: 'Narayana Junior College', duration: '2014 — 2016', detail: 'Math, Physics, Chemistry — 96%', certificateUrl: 'certificates/12th-marksheet.pdf', icon: '📘', order: 2 },
  { degree: 'Secondary School (10th Grade)', institution: 'Sri Chaitanya High School', duration: '2013 — 2014', detail: 'CGPA: 9.8/10', certificateUrl: 'certificates/10th-marksheet.pdf', icon: '✏️', order: 3 }
];

export const defaultSkills: SkillGroup[] = [
  { category: 'Languages', items: ['TypeScript', 'Python', 'Go', 'SQL', 'Rust'], order: 1 },
  { category: 'Frameworks & Data', items: ['Node.js', 'FastAPI', 'React', 'PostgreSQL', 'Redis', 'Kafka'], order: 2 },
  { category: 'Infra & Tools', items: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'GitHub Actions'], order: 3 }
];

export const defaultExperience: ExperienceItem[] = [
  { role: 'Senior Backend Engineer', company: 'Northstar Systems', duration: '2023 — Present', description: 'Leading the data-infrastructure team; redesigned the event pipeline to handle 5x traffic growth with no added on-call load.', order: 1 },
  { role: 'Backend Engineer', company: 'Fieldwire Labs', duration: '2020 — 2023', description: 'Built the payments and billing service from scratch; owned uptime for a system processing $2M+ monthly.', order: 2 },
  { role: 'Software Engineer, New Grad', company: 'Cartwheel', duration: '2018 — 2020', description: 'Worked across the stack on the internal tools team, shipping the first version of the deploy dashboard still in use today.', order: 3 }
];

export const defaultProjects: ProjectItem[] = [
  { name: 'Ledgerline', description: 'An event-sourced ledger service handling 40M+ transactions a day, built to stay consistent under network partitions without sacrificing throughput.', tags: ['Go', 'Kafka', 'Postgres'], codeUrl: 'https://github.com/yourusername/ledgerline', liveUrl: 'https://ledgerline.yourdomain.dev', icon: '⌁', imageUrl: '', category: 'Professional', order: 1 },
  { name: 'Wayfind CLI', description: 'An open-source command-line tool that turns messy monorepos into navigable dependency graphs. 3k stars, used internally at two mid-size startups.', tags: ['Rust', 'Open Source'], codeUrl: 'https://github.com/yourusername/wayfind-cli', liveUrl: 'https://wayfind-cli.yourdomain.dev', icon: '◈', imageUrl: '', category: 'Open Source', order: 2 },
  { name: 'Skyward', description: 'A personal project mapping decades of public flight-path data into an interactive globe, exploring how air-traffic density changed over 40 years.', tags: ['Python', 'D3.js', 'Side project'], codeUrl: 'https://github.com/yourusername/skyward', liveUrl: 'https://skyward.yourdomain.dev', icon: '▤', imageUrl: '', category: 'Personal', order: 3 },
  { name: 'Nimbus Gateway', description: 'An internal API gateway with per-tenant rate limiting and request shaping, cutting p99 latency by 34% across 12 downstream services.', tags: ['TypeScript', 'Redis', 'AWS'], codeUrl: 'https://github.com/yourusername/nimbus-gateway', liveUrl: 'https://nimbus-gateway.yourdomain.dev', icon: '⌬', imageUrl: '', category: 'Freelance', order: 4 },
  { name: 'Campus Room Booking System', description: 'A final-year project: a web app for booking shared classrooms and labs, with conflict detection and an admin approval queue. Built with a team of three.', tags: ['Java', 'MySQL', 'Spring Boot'], codeUrl: 'https://github.com/yourusername/campus-booking', liveUrl: '', icon: '🏫', imageUrl: '', category: 'College', order: 5 }
];

export const defaultCertifications: CertificationItem[] = [
  { title: 'AWS Certified Solutions Architect — Associate', org: 'Amazon Web Services', year: '2024', certificateUrl: 'certificates/aws-saa.pdf', icon: '☁', order: 1 },
  { title: 'Certified Kubernetes Administrator (CKA)', org: 'The Linux Foundation', year: '2023', certificateUrl: 'certificates/cka.pdf', icon: '⎈', order: 2 },
  { title: 'Professional Data Engineer', org: 'Google Cloud', year: '2022', certificateUrl: 'certificates/gcp-pde.pdf', icon: '⚙', order: 3 }
];

export const defaultAchievements: AchievementItem[] = [
  { title: 'Speaker, GopherCon India 2024', description: 'Talk on event-sourced ledgers at scale', icon: '★', order: 1 },
  { title: '3,000+ GitHub stars', description: 'Across open-source tooling projects', icon: '◆', order: 2 },
  { title: 'Top performer, 2023 & 2024', description: 'Northstar Systems annual review', icon: '▲', order: 3 }
];
