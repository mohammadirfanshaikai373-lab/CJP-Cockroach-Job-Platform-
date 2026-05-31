import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, FeedPost, Connection, Community, Job, MessageThread, Notification, Resume, Event, Commitment } from '../types';
import { CommitmentType } from '../types';

// ---------- Your existing data creators (unchanged) ----------
const createUsers = (): User[] => [
  { id: '1', name: 'Afifa', role: 'Mentor', title: 'Senior Developer', headline: 'Building scalable web applications | React Expert', company: 'Neon Dynamics', location: 'Bangalore, India', avatar: 'https://i.pravatar.cc/150?img=1', skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'], endorsements: [{ skill: 'React', count: 45 }], reputation: { resilience: 92, speed: 88, authenticity: 95, completedCommitments: 47, thanks: 89, expired: 2, disputesLost: 0 }, badges: ['Top Mentor', 'Speed Responder'], projectProofs: [], isPremium: true, connections: 523, profileViews: 1247, postImpressions: 8456, about: 'Passionate about building products that make a difference. 8+ years of experience in full-stack development.', experience: [{ id: 'e1', title: 'Senior Developer', company: 'Neon Dynamics', location: 'Bangalore', startDate: '2020-01', current: true, description: 'Leading frontend architecture' }], education: [{ id: 'ed1', school: 'IIT Delhi', degree: 'B.Tech', field: 'Computer Science', startDate: '2012', endDate: '2016' }], certifications: [], languages: ['English', 'Hindi'], email: 'afifa@example.com', phone: '+91 98765 43210' },
  { id: '2', name: 'Abzal', role: 'Seeker', title: 'DS Student', headline: 'Aspiring Data Scientist | Python Enthusiast', company: 'Delhi University', location: 'Delhi, India', avatar: 'https://i.pravatar.cc/150?img=5', skills: ['Python', 'Data Science', 'Machine Learning'], endorsements: [{ skill: 'Python', count: 12 }], reputation: { resilience: 78, speed: 82, authenticity: 90, completedCommitments: 12, thanks: 18, expired: 1, disputesLost: 0 }, badges: ['Quick Learner'], projectProofs: [], connections: 89, profileViews: 234, postImpressions: 1205, about: 'Final year CS student passionate about data science.', experience: [], education: [{ id: 'ed1', school: 'Delhi University', degree: 'B.Sc', field: 'Computer Science', startDate: '2021', endDate: '2025' }], certifications: [], languages: ['English', 'Hindi'], email: 'apsara@example.com' },
  { id: '3', name: 'Sadiya', role: 'Mentor', title: 'DevOps Engineer', headline: 'Cloud Infrastructure Expert | DevOps Advocate', company: 'Chitin Labs', location: 'Hyderabad, India', avatar: 'https://i.pravatar.cc/150?img=9', skills: ['DevOps', 'AWS', 'Kubernetes', 'Docker', 'CI/CD'], endorsements: [{ skill: 'DevOps', count: 67 }], reputation: { resilience: 95, speed: 90, authenticity: 88, completedCommitments: 63, thanks: 112, expired: 1, disputesLost: 1 }, badges: ['Top Mentor', 'DevOps Expert'], projectProofs: [], isPremium: true, connections: 789, profileViews: 2341, postImpressions: 15678, about: 'DevOps engineer with 6+ years of experience.', experience: [{ id: 'e1', title: 'DevOps Engineer', company: 'Chitin Labs', location: 'Hyderabad', startDate: '2019-03', current: true, description: 'Managing cloud infrastructure' }], education: [{ id: 'ed1', school: 'JNTU Hyderabad', degree: 'B.Tech', field: 'IT', startDate: '2012', endDate: '2016' }], certifications: [], languages: ['English', 'Hindi', 'Telugu'], email: 'sadiya@example.com', phone: '+91 87654 32109' },
  { id: '4', name: 'Afreen', role: 'Seeker', title: 'UI/UX Designer', headline: 'Creating delightful user experiences | Figma Expert', company: 'Freelance', location: 'Mumbai, India', avatar: 'https://i.pravatar.cc/150?img=16', skills: ['UI/UX', 'Figma', 'Prototyping', 'User Research'], endorsements: [{ skill: 'Figma', count: 23 }], reputation: { resilience: 85, speed: 79, authenticity: 92, completedCommitments: 8, thanks: 14, expired: 0, disputesLost: 0 }, badges: ['Creative Mind'], projectProofs: [], connections: 156, profileViews: 567, postImpressions: 2345, about: 'UI/UX designer with a passion for creating intuitive interfaces.', experience: [{ id: 'e1', title: 'UI/UX Designer', company: 'Freelance', location: 'Mumbai', startDate: '2022-01', current: true, description: 'Designed interfaces for 20+ clients' }], education: [{ id: 'ed1', school: 'Mumbai University', degree: 'B.Des', field: 'Visual Communication', startDate: '2018', endDate: '2022' }], certifications: [], languages: ['English', 'Hindi'], email: 'afreen@example.com' },
  { id: '5', name: 'Aleem', role: 'Mentor', title: 'Backend Architect', headline: 'Building robust backend systems | Go & Python', company: 'TechCorp India', location: 'Pune, India', avatar: 'https://i.pravatar.cc/150?img=12', skills: ['Backend', 'Python', 'Go', 'PostgreSQL', 'Redis'], endorsements: [{ skill: 'Python', count: 34 }], reputation: { resilience: 88, speed: 85, authenticity: 91, completedCommitments: 35, thanks: 67, expired: 3, disputesLost: 0 }, badges: ['Backend Expert'], projectProofs: [], isPremium: true, connections: 412, profileViews: 1890, postImpressions: 9876, about: 'Backend architect with 10+ years of experience.', experience: [{ id: 'e1', title: 'Backend Architect', company: 'TechCorp India', location: 'Pune', startDate: '2018-06', current: true, description: 'Architecting microservices' }], education: [{ id: 'ed1', school: 'BITS Pilani', degree: 'M.Tech', field: 'Computer Science', startDate: '2010', endDate: '2012' }], certifications: [], languages: ['English', 'Hindi', 'Marathi'], email: 'aleem@example.com', phone: '+91 76543 21098' },
  { id: '6', name: 'Mujahira', role: 'Mentor', title: 'EE Engineer', headline: 'Power System Expert | Computer Vision', company: 'Hira Dynamics', location: 'Bangalore, India', avatar: 'https://i.pravatar.cc/150?img=23', skills: ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'Computer Vision'], endorsements: [{ skill: 'Machine Learning', count: 78 }], reputation: { resilience: 94, speed: 91, authenticity: 96, completedCommitments: 52, thanks: 98, expired: 0, disputesLost: 0 }, badges: ['Top Mentor', 'ML Expert'], projectProofs: [], isPremium: true, connections: 634, profileViews: 2890, postImpressions: 12345, about: 'ML engineer with 7+ years of experience in computer vision and NLP.', experience: [{ id: 'e1', title: 'ML Engineer', company: 'Neon Dynamics', location: 'Bangalore', startDate: '2019-08', current: true, description: 'Leading ML initiatives' }], education: [{ id: 'ed1', school: 'IISc Bangalore', degree: 'M.Tech', field: 'AI & ML', startDate: '2015', endDate: '2017' }], certifications: [], languages: ['English', 'Hindi', 'Telugu', 'Kannada'], email: 'kiran@example.com', phone: '+91 65432 10987' },
  { id: '7', name: 'Rehaman', role: 'Seeker', title: 'Electrical Engineer', headline: 'React Developer | UI Implementation', company: 'Startup Hub', location: 'Gurgaon, India', avatar: 'https://i.pravatar.cc/150?img=27', skills: ['Frontend', 'React', 'CSS', 'JavaScript', 'Next.js'], endorsements: [{ skill: 'React', count: 15 }], reputation: { resilience: 80, speed: 75, authenticity: 88, completedCommitments: 7, thanks: 12, expired: 0, disputesLost: 0 }, badges: ['Rising Star'], projectProofs: [], connections: 123, profileViews: 456, postImpressions: 1567, about: 'Frontend developer with 2 years of experience.', experience: [{ id: 'e1', title: 'Frontend Developer', company: 'Startup Hub', location: 'Gurgaon', startDate: '2022-06', current: true, description: 'Building React applications' }], education: [{ id: 'ed1', school: 'DTU Delhi', degree: 'B.Tech', field: 'Software Engineering', startDate: '2018', endDate: '2022' }], certifications: [], languages: ['English', 'Hindi'], email: 'sai@example.com' },
  { id: '8', name: 'Irfan', role: 'Seeker', title: 'EC&CS', headline: 'Learning ML & AI | TensorFlow', company: 'BarakahX', location: 'Guntur, India', avatar: 'https://i.pravatar.cc/150?img=18', skills: ['Data Science', 'Python', 'TensorFlow', 'SQL'], endorsements: [{ skill: 'Python', count: 8 }], reputation: { resilience: 72, speed: 68, authenticity: 85, completedCommitments: 5, thanks: 8, expired: 1, disputesLost: 0 }, badges: [], projectProofs: [], connections: 67, profileViews: 189, postImpressions: 876, about: 'Data science intern transitioning to full-time.', experience: [{ id: 'e1', title: 'Data Science Intern', company: 'Analytics Co', location: 'Chennai', startDate: '2024-01', current: true, description: 'Building ML models' }], education: [{ id: 'ed1', school: 'Anna University', degree: 'B.E', field: 'Computer Science', startDate: '2020', endDate: '2024' }], certifications: [], languages: ['English', 'Hindi', 'Tamil'], email: 'rehman@example.com' },
];

const createCurrentUser = (): User => ({
  id: 'current', name: 'You', role: 'Seeker', title: 'Software Developer', headline: 'Full Stack Developer | React & Node.js | Open to Opportunities', company: 'Looking for opportunities', location: 'Bangalore, India', avatar: 'https://i.pravatar.cc/150?img=33', skills: ['JavaScript', 'React', 'Python', 'Node.js', 'TypeScript'], endorsements: [{ skill: 'React', count: 12 }, { skill: 'JavaScript', count: 18 }], reputation: { resilience: 75, speed: 80, authenticity: 85, completedCommitments: 15, thanks: 28, expired: 2, disputesLost: 0 }, badges: ['Active Helper', 'Quick Responder'], projectProofs: [{ id: 'pp1', title: 'E-commerce Dashboard', whatBuilt: 'Full-stack dashboard with React and Node', whatLearned: 'State management, API design', nextGoal: 'Add real-time features', link: 'github.com/you/dashboard', type: 'github' }], connections: 234, profileViews: 890, postImpressions: 4567, about: 'Passionate full-stack developer looking to grow and help others.', experience: [{ id: 'e1', title: 'Software Developer', company: 'Freelance', location: 'Bangalore', startDate: '2023-01', current: true, description: 'Building web applications' }], education: [{ id: 'ed1', school: 'RVCE Bangalore', degree: 'B.E', field: 'Computer Science', startDate: '2019', endDate: '2023' }], certifications: [{ id: 'c1', name: 'Meta Frontend Developer', issuer: 'Meta', date: '2023' }], languages: ['English', 'Hindi', 'Kannada'], email: 'you@example.com', phone: '+91 98765 43210'
});

const createJobs = (): Job[] => [
  { id: 'job1', title: 'Senior React Developer', company: 'Neon Dynamics', companyLogo: '', location: 'Bangalore, India', type: 'Full-time', experience: 'Senior', salary: '25-35 LPA', description: 'We are looking for a Senior React Developer to join our growing team.', requirements: ['5+ years of React experience', 'Strong TypeScript skills', 'Experience with state management'], responsibilities: ['Lead frontend development projects', 'Mentor junior developers'], benefits: ['Competitive salary', 'Remote work options', 'Health insurance'], skills: ['React', 'TypeScript', 'Redux', 'Node.js'], postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), applicants: 45, isSaved: false, isApplied: false, contact: { name: 'Afifa Khan', email: 'careers@neondynamics.com', phone: '+91 98765 43210', linkedin: 'linkedin.com/company/neondynamics' } },
  { id: 'job2', title: 'DevOps Engineer', company: 'Chitin Labs', companyLogo: '', location: 'Hyderabad, India', type: 'Full-time', experience: 'Mid-Level', salary: '18-25 LPA', description: 'Join our DevOps team to build and maintain cloud infrastructure.', requirements: ['3+ years of DevOps experience', 'AWS certification preferred', 'Experience with Kubernetes'], responsibilities: ['Manage cloud infrastructure', 'Implement CI/CD pipelines'], benefits: ['Flexible working hours', 'Remote first', 'Health & dental insurance'], skills: ['DevOps', 'AWS', 'Kubernetes', 'Docker', 'Terraform'], postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), applicants: 78, isSaved: true, isApplied: false, contact: { name: 'Sadiya Begum', email: 'jobs@chitinlabs.com', phone: '+91 87654 32109', linkedin: 'linkedin.com/company/chitinlabs' } },
  { id: 'job3', title: 'UI/UX Designer', company: 'Design Studio', companyLogo: '', location: 'Mumbai, India', type: 'Full-time', experience: 'Junior', salary: '8-12 LPA', description: 'Create beautiful and intuitive user interfaces for web and mobile applications.', requirements: ['1-2 years of UI/UX experience', 'Proficiency in Figma', 'Understanding of design systems'], responsibilities: ['Design user interfaces', 'Create prototypes', 'Conduct user research'], benefits: ['Creative environment', 'Design tools provided', 'Flexible hours'], skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'], postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), applicants: 123, isSaved: false, isApplied: true, contact: { name: 'HR Team', email: 'careers@designstudio.com', phone: '+91 76543 21098', linkedin: 'linkedin.com/company/designstudio' } },
  { id: 'job4', title: 'ML Engineer Intern', company: 'Analytics Co', companyLogo: '', location: 'Chennai, India', type: 'Internship', experience: 'Entry Level', salary: '25,000/month', description: '6-month internship opportunity to work on real-world ML projects.', requirements: ['Currently pursuing B.Tech/M.Tech in CS/IT', 'Knowledge of Python', 'Basic ML concepts'], responsibilities: ['Assist in ML model development', 'Data preprocessing'], benefits: ['PPO opportunity', 'Mentorship', 'Real projects'], skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'], postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), applicants: 234, isSaved: false, isApplied: false, contact: { name: 'Kiran Reddy', email: 'intern@analyticsco.com', phone: '+91 65432 10987', linkedin: 'linkedin.com/company/analyticsco' } },
  { id: 'job5', title: 'Backend Developer', company: 'TechCorp India', companyLogo: '', location: 'Pune, India', type: 'Full-time', experience: 'Mid-Level', salary: '15-22 LPA', description: 'Build robust backend systems for our enterprise clients.', requirements: ['3+ years backend experience', 'Python or Go proficiency', 'Database design skills'], responsibilities: ['Design and develop APIs', 'Optimize database queries'], benefits: ['Health insurance', 'Provident Fund', 'Annual bonus'], skills: ['Python', 'Go', 'PostgreSQL', 'Redis'], postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), applicants: 89, isSaved: false, isApplied: false, contact: { name: 'Aleem Ahmed', email: 'careers@techcorp.com', phone: '+91 54321 09876', linkedin: 'linkedin.com/company/techcorp' } },
];

const createEvents = (): Event[] => [
  { id: 'ev1', title: 'React India Conference 2024', description: 'Annual React conference with workshops and networking', host: 'React India Community', date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), location: 'Bangalore', attendees: 1200, isVirtual: false, isRegistered: true },
  { id: 'ev2', title: 'ML Workshop: Computer Vision', description: 'Hands-on workshop on building CV applications', host: 'Kiran Reddy', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), location: 'Virtual', attendees: 234, isVirtual: true, isRegistered: false },
  { id: 'ev3', title: 'DevOps Day Bangalore', description: 'One day conference on DevOps practices', host: 'DevOps India', date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), location: 'Bangalore', attendees: 567, isVirtual: false, isRegistered: false },
];

// ---------- Interface (adds logout and makes currentUser nullable) ----------
interface AppState {
  currentUser: User | null;      // ← MADE NULLABLE
  users: User[];
  posts: FeedPost[];
  connections: Connection[];
  communities: Community[];
  jobs: Job[];
  threads: MessageThread[];
  commitments: Commitment[];
  events: Event[];
  notifications: Notification[];
  resumes: Resume[];
}

interface AppContextType extends AppState {
  addPost: (post: Omit<FeedPost, 'id' | 'author' | 'createdAt' | 'thanks' | 'likes' | 'comments' | 'shares'>) => void;
  likePost: (postId: string) => void;
  thankPost: (postId: string) => void;
  savePost: (postId: string) => void;
  sendConnectionRequest: (userId: string) => void;
  acceptConnection: (connectionId: string) => void;
  removeConnection: (connectionId: string) => void;
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  applyToJob: (jobId: string) => void;
  saveJob: (jobId: string) => void;
  sendMessage: (threadId: string, text: string) => void;
  createThread: (participantId: string) => string;
  createCommitment: (postId: string, type: CommitmentType, dueDate: Date) => void;
  completeCommitment: (commitmentId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  createResume: (name: string, template: Resume['template']) => string;
  updateResume: (resumeId: string, updates: Partial<Resume>) => void;
  deleteResume: (resumeId: string) => void;
  registerForEvent: (eventId: string) => void;
  unregisterFromEvent: (eventId: string) => void;
  addNotification: (message: string, type: Notification['type']) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  logout: () => Promise<void>;   // ← NEW
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const users = createUsers();
  const [currentUser, setCurrentUser] = useState<User | null>(createCurrentUser());   // ← nullable
  const [posts, setPosts] = useState<FeedPost[]>([
    { id: 'fp1', author: users[5], title: 'Need help with TensorFlow model optimization', description: 'I have a trained CNN model that is running slow in production. Looking for guidance on quantization.', skillTags: ['TensorFlow', 'Machine Learning', 'Python'], commitmentType: '15min_call', urgency: 'high', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), isHelpOffer: false, thanks: 0, likes: 23, comments: [], shares: 5 },
    { id: 'fp2', author: users[0], title: 'Offering React code review sessions', description: 'Happy to review your React projects and provide feedback on architecture and best practices.', skillTags: ['React', 'TypeScript', 'Frontend'], commitmentType: 'file_review', urgency: 'low', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), isHelpOffer: true, thanks: 12, likes: 45, comments: [], shares: 8 },
    { id: 'fp3', author: users[3], title: 'Portfolio review needed for job applications', description: 'I am applying for UI/UX roles and would love feedback on my portfolio.', skillTags: ['UI/UX', 'Figma', 'Portfolio'], commitmentType: 'file_review', urgency: 'medium', createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), isHelpOffer: false, thanks: 3, likes: 18, comments: [], shares: 2 },
    { id: 'fp4', author: users[2], title: 'DevOps career path guidance', description: 'I can help you understand the DevOps landscape and how to transition into this field.', skillTags: ['DevOps', 'AWS', 'Career'], commitmentType: '15min_call', urgency: 'low', createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), isHelpOffer: true, thanks: 8, likes: 67, comments: [], shares: 12 },
    { id: 'fp5', author: users[6], title: 'Struggling with CSS Grid layouts', description: 'I keep getting confused with CSS Grid. Need someone to walk me through responsive layouts.', skillTags: ['CSS', 'Frontend', 'Web Development'], commitmentType: 'shadow_task', urgency: 'medium', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), isHelpOffer: false, thanks: 2, likes: 12, comments: [], shares: 1 },
  ]);
  const [connections, setConnections] = useState<Connection[]>([
    { id: 'c1', user: users[0], mutualSkills: 3, mutualConnections: 12, status: 'accepted' },
    { id: 'c2', user: users[2], mutualSkills: 2, mutualConnections: 8, status: 'accepted' },
    { id: 'c3', user: users[4], mutualSkills: 2, mutualConnections: 5, status: 'pending' },
    { id: 'c4', user: users[5], mutualSkills: 1, mutualConnections: 15, status: 'sent' },
  ]);
  const [communities, setCommunities] = useState<Community[]>([
    { id: 'com1', name: 'React Developers Bangalore', skill: 'React', city: 'Bangalore', members: 1247, activeVoiceRooms: 2, isJoined: true, description: 'Community for React developers' },
    { id: 'com2', name: 'Python Data Science Delhi', skill: 'Python', city: 'Delhi', members: 892, activeVoiceRooms: 1, isJoined: true, description: 'Data science enthusiasts' },
    { id: 'com3', name: 'DevOps Mumbai', skill: 'DevOps', city: 'Mumbai', members: 654, activeVoiceRooms: 0, isJoined: false, description: 'DevOps practitioners' },
    { id: 'com4', name: 'ML Engineers Hyderabad', skill: 'Machine Learning', city: 'Hyderabad', members: 1089, activeVoiceRooms: 3, isJoined: false, description: 'ML engineers community' },
  ]);
  const [jobs, setJobs] = useState<Job[]>(createJobs());
  const [threads, setThreads] = useState<MessageThread[]>([
    { id: 'mt1', participant: users[0], lastMessage: 'Great! Lets schedule the call for tomorrow.', timestamp: new Date(Date.now() - 30 * 60 * 1000), status: 'active', unread: 2 },
    { id: 'mt2', participant: users[4], lastMessage: 'I have reviewed your code. Check the comments.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'completed', unread: 0 },
  ]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [events, setEvents] = useState<Event[]>(createEvents());
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', message: 'Afifa Khan accepted your connection request', type: 'connection', read: false, timestamp: new Date() },
    { id: 'n2', message: 'New job matching your profile: Senior React Developer', type: 'job', read: false, timestamp: new Date(Date.now() - 3600000) },
  ]);
  const [resumes, setResumes] = useState<Resume[]>([
    { id: 'r1', name: 'My Resume', template: 'modern', summary: 'Experienced software developer...', experience: [], education: [], skills: ['React', 'Node.js'], projects: [], certifications: [], languages: ['English'], createdAt: new Date(), updatedAt: new Date() }
  ]);

  // ---------- All your existing functions (exactly as you wrote them) ----------
  const addPost = (post: Omit<FeedPost, 'id' | 'author' | 'createdAt' | 'thanks' | 'likes' | 'comments' | 'shares'>) => {
    const newPost: FeedPost = { ...post, id: `fp${Date.now()}`, author: currentUser!, createdAt: new Date(), thanks: 0, likes: 0, comments: [], shares: 0 };
    setPosts((prev: FeedPost[]) => [newPost, ...prev]);
    addNotification('Your post has been published!', 'post');
  };
  const likePost = (postId: string) => setPosts((prev: FeedPost[]) => prev.map((p: FeedPost) => p.id === postId ? { ...p, likes: p.likes + 1, isLiked: !p.isLiked } : p));
  const thankPost = (postId: string) => setPosts((prev: FeedPost[]) => prev.map((p: FeedPost) => p.id === postId ? { ...p, thanks: p.thanks + 1, isThanked: true } : p));
  const savePost = (postId: string) => setPosts((prev: FeedPost[]) => prev.map((p: FeedPost) => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
  const sendConnectionRequest = (userId: string) => {
    const user = users.find((u: User) => u.id === userId);
    if (user) {
      setConnections((prev: Connection[]) => [...prev, { id: `c${Date.now()}`, user, mutualSkills: Math.floor(Math.random() * 5) + 1, mutualConnections: Math.floor(Math.random() * 20), status: 'sent' }]);
      addNotification(`Connection request sent to ${user.name}`, 'connection');
    }
  };
  const acceptConnection = (connectionId: string) => {
    setConnections((prev: Connection[]) => prev.map((c: Connection) => c.id === connectionId ? { ...c, status: 'accepted' } : c));
    addNotification('Connection accepted!', 'connection');
  };
  const removeConnection = (connectionId: string) => setConnections((prev: Connection[]) => prev.filter((c: Connection) => c.id !== connectionId));
  const joinCommunity = (communityId: string) => {
    setCommunities((prev: Community[]) => prev.map((c: Community) => c.id === communityId ? { ...c, isJoined: true, members: c.members + 1 } : c));
    addNotification('You joined a community!', 'connection');
  };
  const leaveCommunity = (communityId: string) => setCommunities((prev: Community[]) => prev.map((c: Community) => c.id === communityId ? { ...c, isJoined: false, members: c.members - 1 } : c));
  const applyToJob = (jobId: string) => {
    setJobs((prev: Job[]) => prev.map((j: Job) => j.id === jobId ? { ...j, isApplied: true, applicants: j.applicants + 1 } : j));
    addNotification('Application submitted!', 'job');
  };
  const saveJob = (jobId: string) => setJobs((prev: Job[]) => prev.map((j: Job) => j.id === jobId ? { ...j, isSaved: !j.isSaved } : j));
  const createThread = (participantId: string): string => {
    const existing = threads.find((t: MessageThread) => t.participant.id === participantId);
    if (existing) return existing.id;
    const user = users.find((u: User) => u.id === participantId);
    if (user) {
      const newThread: MessageThread = { id: `mt${Date.now()}`, participant: user, lastMessage: '', timestamp: new Date(), status: 'active', unread: 0 };
      setThreads((prev: MessageThread[]) => [newThread, ...prev]);
      return newThread.id;
    }
    return '';
  };
  const sendMessage = (threadId: string, text: string) => setThreads((prev: MessageThread[]) => prev.map((t: MessageThread) => t.id === threadId ? { ...t, lastMessage: text, timestamp: new Date() } : t));
  const createCommitment = (postId: string, type: CommitmentType, dueDate: Date) => {
    const post = posts.find((p: FeedPost) => p.id === postId);
    if (post) {
      const newCommitment: Commitment = { id: `ac${Date.now()}`, type, mentor: post.author, seeker: currentUser!, dueDate, status: 'in_progress', post };
      setCommitments((prev: Commitment[]) => [newCommitment, ...prev]);
      addNotification(`Commitment created with ${post.author.name}`, 'commitment');
    }
  };
  const completeCommitment = (commitmentId: string) => {
    setCommitments((prev: Commitment[]) => prev.map((c: Commitment) => c.id === commitmentId ? { ...c, status: 'completed' } : c));
    if (currentUser) {
      setCurrentUser((prev: User) => ({ ...prev, reputation: { ...prev.reputation, completedCommitments: prev.reputation.completedCommitments + 1 } }));
    }
    addNotification('Commitment completed! +10 reputation points', 'success');
  };
  const updateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      setCurrentUser((prev: User) => ({ ...prev, ...updates }));
      addNotification('Profile updated successfully', 'success');
    }
  };
  const createResume = (name: string, template: Resume['template']): string => {
    const newResume: Resume = { id: `r${Date.now()}`, name, template, summary: '', experience: [], education: [], skills: [], projects: [], certifications: [], languages: [], createdAt: new Date(), updatedAt: new Date() };
    setResumes((prev: Resume[]) => [...prev, newResume]);
    addNotification('Resume created!', 'success');
    return newResume.id;
  };
  const updateResume = (resumeId: string, updates: Partial<Resume>) => setResumes((prev: Resume[]) => prev.map((r: Resume) => r.id === resumeId ? { ...r, ...updates, updatedAt: new Date() } : r));
  const deleteResume = (resumeId: string) => { setResumes((prev: Resume[]) => prev.filter((r: Resume) => r.id !== resumeId)); addNotification('Resume deleted', 'info'); };
  const registerForEvent = (eventId: string) => { setEvents((prev: Event[]) => prev.map((e: Event) => e.id === eventId ? { ...e, isRegistered: true, attendees: e.attendees + 1 } : e)); addNotification('Registered for event!', 'event'); };
  const unregisterFromEvent = (eventId: string) => setEvents((prev: Event[]) => prev.map((e: Event) => e.id === eventId ? { ...e, isRegistered: false, attendees: e.attendees - 1 } : e));
  const addNotification = (message: string, type: Notification['type']) => setNotifications((prev: Notification[]) => [{ id: `n${Date.now()}`, message, type, read: false, timestamp: new Date() }, ...prev]);
  const markNotificationRead = (id: string) => setNotifications((prev: Notification[]) => prev.map((n: Notification) => n.id === id ? { ...n, read: true } : n));
  const clearNotifications = () => setNotifications((prev: Notification[]) => prev.map((n: Notification) => ({ ...n, read: true })));

  // ---------- LOGOUT FUNCTION (NEW) ----------
  const logout = async () => {
    // Clear any stored user token/session
    await AsyncStorage.removeItem('@cjp_user');
    await AsyncStorage.removeItem('@cjp_onboarding_complete'); // optional: reset onboarding flag
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      posts,
      connections,
      communities,
      jobs,
      threads,
      commitments,
      events,
      notifications,
      resumes,
      addPost,
      likePost,
      thankPost,
      savePost,
      sendConnectionRequest,
      acceptConnection,
      removeConnection,
      joinCommunity,
      leaveCommunity,
      applyToJob,
      saveJob,
      sendMessage,
      createThread,
      createCommitment,
      completeCommitment,
      updateProfile,
      createResume,
      updateResume,
      deleteResume,
      registerForEvent,
      unregisterFromEvent,
      addNotification,
      markNotificationRead,
      clearNotifications,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}