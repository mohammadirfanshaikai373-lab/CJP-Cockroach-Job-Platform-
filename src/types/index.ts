export type UserRole = 'Mentor' | 'Seeker';

export type CommitmentType = '15min_call' | 'file_review' | 'referral' | 'shadow_task';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  headline: string;
  company?: string;
  location?: string;
  avatar: string;
  coverImage?: string;
  skills: string[];
  endorsements: { skill: string; count: number }[];
  reputation: {
    resilience: number;
    speed: number;
    authenticity: number;
    completedCommitments: number;
    thanks: number;
    expired: number;
    disputesLost: number;
  };
  badges: string[];
  projectProofs: ProjectProof[];
  isPremium?: boolean;
  connections: number;
  profileViews: number;
  postImpressions: number;
  about: string;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  languages: string[];
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface ProjectProof {
  id: string;
  title: string;
  whatBuilt: string;
  whatLearned: string;
  nextGoal: string;
  link: string;
  type: 'github' | 'loom' | 'other';
}

export interface FeedPost {
  id: string;
  author: User;
  title: string;
  description: string;
  skillTags: string[];
  commitmentType: CommitmentType;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  isHelpOffer: boolean;
  thanks: number;
  isThanked?: boolean;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  shares: number;
  isSaved?: boolean;
  images?: string[];
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  timestamp: Date;
  likes: number;
}

export interface Connection {
  id: string;
  user: User;
  mutualSkills: number;
  mutualConnections: number;
  status: 'pending' | 'accepted' | 'sent';
}

export interface Community {
  id: string;
  name: string;
  skill: string;
  city: string;
  members: number;
  activeVoiceRooms: number;
  isJoined: boolean;
  description: string;
  logo?: string;
}

export interface Challenge {
  id: string;
  company: string;
  companyLogo: string;
  title: string;
  techStack: string[];
  prize: string;
  timeLeft: string;
  submissions: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  postedAt: Date;
  applicants: number;
  isSaved: boolean;
  isApplied: boolean;
  assessment?: JobAssessment;
  contact: {
    name: string;
    email: string;
    phone: string;
  linkedin: string;
  };
}

export interface JobAssessment {
  id: string;
  title: string;
  duration: string;
  questions: number;
  passingScore: number;
}

export interface MessageThread {
  id: string;
  participant: User;
  lastMessage: string;
  timestamp: Date;
  commitmentType?: CommitmentType;
  dueDate?: Date;
  status: 'active' | 'completed' | 'expired';
  unread: number;
  isTyping?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isVoiceNote?: boolean;
  voiceDuration?: string;
}

export interface Commitment {
  id: string;
  type: CommitmentType;
  mentor: User;
  seeker: User;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  post: FeedPost;
}

export interface Resume {
  id: string;
  name: string;
  template: 'modern' | 'classic' | 'minimal' | 'professional';
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  projects: ResumeProject[];
  certifications: string[];
  languages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResumeExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  highlights: string[];
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  gpa?: string;
  graduationDate: string;
  highlights: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  host: string;
  date: Date;
  location: string;
  attendees: number;
  isVirtual: boolean;
  isRegistered: boolean;
  image?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author: User;
  publishedAt: Date;
  readTime: string;
  likes: number;
  comments: number;
  tags: string[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'connection' | 'challenge' | 'job' | 'commitment' | 'post' | 'message' | 'event' | 'success' | 'info';
  read: boolean;
  timestamp: Date;
  data?: any;
}
