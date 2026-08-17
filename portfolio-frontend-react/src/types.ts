export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bioParagraphs: string[];
  location: string;
  experienceLabel: string;
  focus: string;
  availability: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  resumeUrl: string;
  photoUrl: string;
  design?: string;
}

export interface EducationItem {
  _id?: string;
  degree: string;
  institution: string;
  duration: string;
  detail: string;
  certificateUrl: string;
  icon: string;
  order: number;
  cgpaOrMarks?: string;
}


export interface SkillGroup {
  _id?: string;
  category: string;
  items: string[];
  order: number;
}

export interface ExperienceItem {
  _id?: string;
  role: string;
  company: string;
  duration: string;
  description: string;
  order: number;
}

export interface ProjectItem {
  _id?: string;
  name: string;
  description: string;
  tags: string[];
  codeUrl: string;
  liveUrl: string;
  icon: string;
  imageUrl: string;
  category: string;
  order: number;
}

export interface CertificationItem {
  _id?: string;
  title: string;
  org: string;
  year: string;
  certificateUrl: string;
  icon: string;
  order: number;
}

export interface AchievementItem {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}
