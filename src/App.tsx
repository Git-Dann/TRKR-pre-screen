import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Briefcase, Building2, GraduationCap, Mail, Phone, MapPin, Award, Clock, Code, FileText, Laptop, Globe, MessageSquare, Filter, RefreshCw } from 'lucide-react';

// Sample data
const applications = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Frontend Developer",
    company: "Tech Solutions Inc",
    experience: "5 years",
    education: "M.S. Computer Science",
    location: "San Francisco, CA",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    languages: ["English (Native)", "Spanish (Intermediate)"],
    achievements: ["Led team of 5 developers", "Reduced build time by 40%"],
    portfolio: "github.com/sarahj",
    availability: "2 weeks notice",
    salary: "$120,000 - $150,000",
    workPreference: "Hybrid (3 days remote)",
    applicationQuestions: {
      motivation: "I'm passionate about creating efficient and scalable frontend solutions. My experience with performance optimization and team leadership makes me confident I can contribute significantly to your engineering team.",
      biggestAchievement: "Successfully led the migration of a monolithic frontend to a micro-frontend architecture, reducing deployment times by 60% and improving team autonomy.",
      whyCompany: "Your company's focus on innovative solutions and commitment to work-life balance aligns perfectly with my career goals. I'm particularly excited about your recent work on distributed systems.",
      challengingSituation: "When faced with a critical production bug affecting user authentication, I coordinated with multiple teams to implement a fix within 2 hours while maintaining clear communication with stakeholders.",
      improvementSuggestion: "Based on my research of your product, I believe implementing a component library and design system could significantly improve development efficiency and consistency."
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Full Stack Engineer",
    company: "Innovation Labs",
    experience: "3 years",
    education: "B.S. Software Engineering",
    location: "New York, NY",
    email: "m.chen@example.com",
    phone: "+1 (555) 987-6543",
    skills: ["JavaScript", "Python", "Docker", "MongoDB", "React"],
    languages: ["English (Fluent)", "Mandarin (Native)"],
    achievements: ["Developed microservices architecture", "Improved API performance by 60%"],
    portfolio: "github.com/mchen",
    availability: "Immediate",
    salary: "$100,000 - $130,000",
    workPreference: "Remote",
    applicationQuestions: {
      motivation: "I thrive in full-stack development where I can work on both frontend and backend challenges. Your company's tech stack perfectly matches my expertise.",
      biggestAchievement: "Built and deployed a microservices architecture that handles 1M+ daily requests, improving system reliability and scalability.",
      whyCompany: "Your company's commitment to technological innovation and the opportunity to work on cutting-edge projects greatly appeals to me.",
      challengingSituation: "During a major system outage, I quickly identified the root cause in our database queries and implemented a caching solution that prevented future incidents.",
      improvementSuggestion: "I noticed potential for improving your API response times through implementation of a caching layer and query optimization."
    }
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "UX Developer",
    company: "Design Co",
    experience: "4 years",
    education: "B.A. Interactive Design",
    location: "Austin, TX",
    email: "e.rodriguez@example.com",
    phone: "+1 (555) 456-7890",
    skills: ["React", "Figma", "UI/UX", "SASS", "JavaScript"],
    languages: ["English (Native)", "Portuguese (Fluent)"],
    achievements: ["Redesigned core product UI", "Increased user engagement by 45%"],
    portfolio: "github.com/erodriguez",
    availability: "1 month notice",
    salary: "$90,000 - $120,000",
    workPreference: "On-site",
    applicationQuestions: {
      motivation: "I'm passionate about creating intuitive user experiences that bridge the gap between design and development. Your focus on user-centered design aligns perfectly with my approach.",
      biggestAchievement: "Led a complete redesign of our core product's UI, resulting in a 45% increase in user engagement and positive feedback from key stakeholders.",
      whyCompany: "Your company's reputation for innovative design solutions and collaborative culture makes it an ideal place for me to grow and contribute.",
      challengingSituation: "When user testing revealed major usability issues just before launch, I quickly organized workshops with stakeholders to identify and implement solutions within a tight deadline.",
      improvementSuggestion: "Based on my analysis, implementing a more consistent design system across your products could improve user experience and development efficiency."
    }
  }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('');
  const [decisions, setDecisions] = useState<Record<number, boolean>>({});
  const [filters, setFilters] = useState({
    role: '',
    experience: '',
    location: '',
    skills: '',
  });
  const [reviewFilter, setReviewFilter] = useState<'all' | 'accepted' | 'rejected'>('all');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reReviewApplications, setReReviewApplications] = useState<number[]>([]);

  // Get unique values for filters
  const uniqueRoles = Array.from(new Set(applications.map(app => app.role)));
  const uniqueLocations = Array.from(new Set(applications.map(app => app.location)));
  const uniqueExperience = Array.from(new Set(applications.map(app => app.experience)));

  const filteredApplications = isReviewing
    ? applications.filter(app => reReviewApplications.includes(app.id))
    : applications.filter(app => {
        return (
          (!filters.role || app.role === filters.role) &&
          (!filters.experience || app.experience === filters.experience) &&
          (!filters.location || app.location === filters.location)
        );
      });

  const currentApplication = filteredApplications[currentIndex];

  const handleDecision = (accepted: boolean) => {
    if (!currentApplication || currentIndex >= filteredApplications.length) return;

    setDirection(accepted ? 'right' : 'left');
    setDecisions({ ...decisions, [currentApplication.id]: accepted });

    setTimeout(() => {
      setDirection('');
      if (isReviewing) {
        const newReReviewApplications = reReviewApplications.filter(id => id !== currentApplication.id);
        setReReviewApplications(newReReviewApplications);
        if (newReReviewApplications.length === 0) {
          setIsReviewing(false);
        }
      }
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const startReReview = (type: 'accepted' | 'rejected') => {
    const applicationsToReview = Object.entries(decisions)
      .filter(([_, accepted]) => type === 'accepted' ? accepted : !accepted)
      .map(([id]) => Number(id));
    
    if (applicationsToReview.length === 0) {
      return; // Don't start re-review if there are no applications to review
    }
    
    setReReviewApplications(applicationsToReview);
    setIsReviewing(true);
    setCurrentIndex(0);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentIndex(0);
  };

  // Add keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentApplication || currentIndex >= filteredApplications.length) return;
      
      if (event.key === 'ArrowLeft') {
        handleDecision(false);
      } else if (event.key === 'ArrowRight') {
        handleDecision(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredApplications.length, currentApplication]);

  if ((currentIndex >= filteredApplications.length && !isReviewing) || (isReviewing && reReviewApplications.length === 0)) {
    const totalApplications = Object.keys(decisions).length;
    const acceptedApplications = Object.values(decisions).filter(decision => decision).length;
    const acceptanceRate = totalApplications > 0 
      ? ((acceptedApplications / totalApplications) * 100).toFixed(1)
      : 0;

    const filteredDecisions = Object.entries(decisions).filter(([_, accepted]) => {
      if (reviewFilter === 'accepted') return accepted;
      if (reviewFilter === 'rejected') return !accepted;
      return true;
    });

    return (
      <div className="min-h-screen bg-[#f5f9f7] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl w-full mx-4">
          <h2 className="text-2xl font-bold mb-4 text-[#2c5344]">Review Complete!</h2>
          
          {/* Statistics Section */}
          <div className="mb-8 p-6 bg-[#f5f9f7] rounded-lg">
            <div className="text-4xl font-bold text-[#7ecfae] mb-2">{acceptanceRate}%</div>
            <p className="text-[#4a7263] mb-4">Acceptance Rate</p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#2c5344]">{acceptedApplications}</div>
                <p className="text-[#4a7263]">Accepted</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2c5344]">{totalApplications - acceptedApplications}</div>
                <p className="text-[#4a7263]">Rejected</p>
              </div>
            </div>
          </div>

          {/* Decisions List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[#2c5344] text-lg mb-4">
              {reviewFilter === 'all' 
                ? 'All Applications' 
                : reviewFilter === 'accepted' 
                  ? 'Accepted Applications' 
                  : 'Rejected Applications'}
            </h3>
            {filteredDecisions.map(([id, accepted]) => {
              const application = applications.find(app => app.id === Number(id));
              if (!application) return null;
              return (
                <div key={id} className="flex items-center justify-between p-3 bg-[#f5f9f7] rounded-md">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${accepted ? "bg-[#7ecfae]" : "bg-red-500"}`} />
                    <div>
                      <div className="font-medium text-[#2c5344]">{application.name}</div>
                      <div className="text-sm text-[#4a7263]">{application.role}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    accepted 
                      ? "bg-[#e6f5ef] text-[#2c5344]" 
                      : "bg-red-100 text-red-600"
                  }`}>
                    {accepted ? "Accepted" : "Rejected"}
                  </span>
                </div>
              );
            })}
            {filteredDecisions.length === 0 && (
              <div className="text-[#4a7263] p-4 bg-[#f5f9f7] rounded-lg">
                No applications found for the selected filter.
              </div>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-4 justify-center mt-6 mb-6">
            <button
              onClick={() => setReviewFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                reviewFilter === 'all'
                  ? 'bg-[#7ecfae] text-white'
                  : 'bg-[#f5f9f7] text-[#4a7263] hover:bg-[#e6f5ef]'
              }`}
            >
              All Applications
            </button>
            <button
              onClick={() => setReviewFilter('accepted')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                reviewFilter === 'accepted'
                  ? 'bg-[#7ecfae] text-white'
                  : 'bg-[#f5f9f7] text-[#4a7263] hover:bg-[#e6f5ef]'
              }`}
            >
              Accepted Only
            </button>
            <button
              onClick={() => setReviewFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                reviewFilter === 'rejected'
                  ? 'bg-[#7ecfae] text-white'
                  : 'bg-[#f5f9f7] text-[#4a7263] hover:bg-[#e6f5ef]'
              }`}
            >
              Rejected Only
            </button>
          </div>

          {/* Re-review Buttons */}
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => startReReview('accepted')}
              className={`flex items-center gap-2 px-4 py-2 bg-[#7ecfae] text-white rounded-lg transition-colors duration-200 ${
                acceptedApplications > 0 ? 'hover:bg-[#5ba88c]' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={acceptedApplications === 0}
            >
              <RefreshCw className="w-5 h-5" />
              Re-review Accepted
            </button>
            <button
              onClick={() => startReReview('rejected')}
              className={`flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg transition-colors duration-200 ${
                (totalApplications - acceptedApplications) > 0 ? 'hover:bg-red-600' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={totalApplications - acceptedApplications === 0}
            >
              <RefreshCw className="w-5 h-5" />
              Re-review Rejected
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show a message when there are no applications to review
  if (filteredApplications.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f9f7] flex flex-col items-center">
        <h1 className="text-2xl font-bold text-[#2c5344] mb-6 mt-4">Job Application Review</h1>
        
        {/* Filter Bar */}
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#4a7263]" />
              <span className="text-[#2c5344] font-semibold">Filters:</span>
            </div>
            
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="px-3 py-2 rounded-md border border-[#7ecfae] text-[#4a7263] focus:outline-none focus:ring-2 focus:ring-[#7ecfae]"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <select
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
              className="px-3 py-2 rounded-md border border-[#7ecfae] text-[#4a7263] focus:outline-none focus:ring-2 focus:ring-[#7ecfae]"
            >
              <option value="">All Experience</option>
              {uniqueExperience.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>

            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="px-3 py-2 rounded-md border border-[#7ecfae] text-[#4a7263] focus:outline-none focus:ring-2 focus:ring-[#7ecfae]"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-[#2c5344] mb-4">No Applications Found</h2>
          <p className="text-[#4a7263]">Try adjusting your filters to see more applications.</p>
        </div>
      </div>
    );
  }

  if (!currentApplication) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f9f7] p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-[#2c5344] mb-6 mt-4">
        {isReviewing ? 'Re-reviewing Applications' : 'Job Application Review'}
      </h1>
      
      {/* Filter Bar */}
      {!isReviewing && (
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#4a7263]" />
              <span className="text-[#2c5344] font-semibold">Filters:</span>
            </div>
            
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="px-3 py-2 rounded-md border border-[#7ecfae] text-[#4a7263] focus:outline-none focus:ring-2 focus:ring-[#7ecfae]"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <select
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
              className="px-3 py-2 rounded-md border border-[#7ecfae] text-[#4a7263] focus:outline-none focus:ring-2 focus:ring-[#7ecfae]"
            >
              <option value="">All Experience</option>
              {uniqueExperience.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>

            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="px-3 py-2 rounded-md border border-[#7ecfae] text-[#4a7263] focus:outline-none focus:ring-2 focus:ring-[#7ecfae]"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-7xl flex items-center justify-center gap-8">
        {/* Reject Button (Left) */}
        <button
          onClick={() => handleDecision(false)}
          className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors hover:scale-110 transform duration-200"
        >
          <ThumbsDown className="w-8 h-8" />
        </button>

        {/* Application Cards Container */}
        <div className="flex gap-6 w-full">
          {/* Overview Card */}
          <div className="w-2/5">
            <div
              className={`bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300
                ${direction === 'left' ? '-translate-x-full opacity-0' : ''}
                ${direction === 'right' ? 'translate-x-full opacity-0' : ''}`}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#7ecfae] to-[#5ba88c] p-6">
                <h2 className="text-3xl font-bold text-white mb-2">{currentApplication.name}</h2>
                <p className="text-[#f5f9f7] text-lg">{currentApplication.role}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#2c5344]">Professional Info</h3>
                  <div className="flex items-center gap-2 text-[#4a7263]">
                    <Building2 className="w-5 h-5" />
                    <span>{currentApplication.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4a7263]">
                    <Clock className="w-5 h-5" />
                    <span>{currentApplication.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4a7263]">
                    <MapPin className="w-5 h-5" />
                    <span>{currentApplication.location}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#2c5344]">Skills & Education</h3>
                  <div className="flex items-center gap-2 text-[#4a7263]">
                    <GraduationCap className="w-5 h-5" />
                    <span>{currentApplication.education}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4a7263]">
                    <Code className="w-5 h-5" />
                    <div className="flex flex-wrap gap-2">
                      {currentApplication.skills.map((skill, index) => (
                        <span key={index} className="bg-[#f5f9f7] text-[#2c5344] px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#2c5344]">Contact</h3>
                  <div className="flex items-center gap-2 text-[#4a7263]">
                    <Mail className="w-5 h-5" />
                    <span>{currentApplication.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4a7263]">
                    <Phone className="w-5 h-5" />
                    <span>{currentApplication.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4a7263]">
                    <Briefcase className="w-5 h-5" />
                    <span>{currentApplication.portfolio}</span>
                  </div>
                </div>

                {/* View CV Button */}
                <button
                  onClick={() => window.open('#', '_blank')}
                  className="w-full mt-4 bg-[#7ecfae] hover:bg-[#5ba88c] text-white py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  View CV
                </button>
              </div>
            </div>
          </div>

          {/* Application Questions Card */}
          <div className="w-3/5">
            <div
              className={`bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300
                ${direction === 'left' ? '-translate-x-full opacity-0' : ''}
                ${direction === 'right' ? 'translate-x-full opacity-0' : ''}`}
            >
              <div className="bg-gradient-to-r from-[#7ecfae] to-[#5ba88c] p-6">
                <h2 className="text-3xl font-bold text-white mb-2">Application Questions</h2>
                <p className="text-[#f5f9f7] text-lg">Candidate Responses</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#2c5344] flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Why are you interested in this position?
                    </h3>
                    <p className="text-[#4a7263] bg-[#f5f9f7] p-4 rounded-lg">
                      {currentApplication.applicationQuestions.motivation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#2c5344] flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      What is your biggest professional achievement?
                    </h3>
                    <p className="text-[#4a7263] bg-[#f5f9f7] p-4 rounded-lg">
                      {currentApplication.applicationQuestions.biggestAchievement}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#2c5344] flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Why do you want to work at our company?
                    </h3>
                    <p className="text-[#4a7263] bg-[#f5f9f7] p-4 rounded-lg">
                      {currentApplication.applicationQuestions.whyCompany}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#2c5344] flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Describe a challenging situation you've handled
                    </h3>
                    <p className="text-[#4a7263] bg-[#f5f9f7] p-4 rounded-lg">
                      {currentApplication.applicationQuestions.challengingSituation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#2c5344] flex items-center gap-2">
                      <Laptop className="w-5 h-5" />
                      What would you improve about our product?
                    </h3>
                    <p className="text-[#4a7263] bg-[#f5f9f7] p-4 rounded-lg">
                      {currentApplication.applicationQuestions.improvementSuggestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accept Button (Right) */}
        <button
          onClick={() => handleDecision(true)}
          className="bg-[#7ecfae] text-white p-4 rounded-full shadow-lg hover:bg-[#5ba88c] transition-colors hover:scale-110 transform duration-200"
        >
          <ThumbsUp className="w-8 h-8" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 flex justify-center">
        <span className="text-[#4a7263]">
          {currentIndex + 1} of {filteredApplications.length} applications
        </span>
      </div>
    </div>
  );
}

export default App;