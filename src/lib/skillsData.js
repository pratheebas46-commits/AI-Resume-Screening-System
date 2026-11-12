export const JOB_ROLES = [
  "Software Engineer",
  "Data Scientist",
  "Web Developer",
  "ML Engineer",
  "DevOps Engineer",
  "Cybersecurity Analyst",
  "Cloud Engineer",
  "AI Engineer",
  "Data Analyst",
  "Backend Developer",
  "Frontend Developer",
  "Mobile Developer"
];

export const ROLE_SKILLS = {
  "Software Engineer": ["Python", "Java", "C++", "Git", "SQL", "Algorithms", "Data Structures", "OOP", "REST APIs", "Agile", "Linux", "Docker", "Testing", "CI/CD", "System Design"],
  "Data Scientist": ["Python", "R", "SQL", "Machine Learning", "Deep Learning", "Statistics", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Data Visualization", "Jupyter", "Feature Engineering", "NLP", "Big Data"],
  "Web Developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "TypeScript", "REST APIs", "Git", "SQL", "MongoDB", "Responsive Design", "Webpack", "Tailwind CSS", "Next.js", "GraphQL"],
  "ML Engineer": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Deep Learning", "NLP", "Computer Vision", "MLOps", "Docker", "Kubernetes", "Feature Engineering", "Model Deployment", "Data Pipelines", "SQL", "Statistics"],
  "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure", "Terraform", "Ansible", "Linux", "Git", "Jenkins", "Monitoring", "Bash", "Python", "Networking", "Security"],
  "Cybersecurity Analyst": ["Network Security", "Firewalls", "SIEM", "Penetration Testing", "Vulnerability Assessment", "Incident Response", "Linux", "Python", "Encryption", "Compliance", "Risk Assessment", "Forensics", "IDS/IPS", "Security Frameworks", "Malware Analysis"],
  "Cloud Engineer": ["AWS", "Azure", "GCP", "Terraform", "Docker", "Kubernetes", "Networking", "Linux", "CI/CD", "Serverless", "IAM", "CloudFormation", "Monitoring", "Python", "Security"],
  "AI Engineer": ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Deep Learning", "Machine Learning", "LLMs", "Transformers", "MLOps", "Data Pipelines", "Docker", "REST APIs", "Mathematics", "Statistics"],
  "Data Analyst": ["SQL", "Excel", "Python", "Tableau", "Power BI", "Statistics", "Data Visualization", "Pandas", "R", "ETL", "Data Cleaning", "Reporting", "Google Analytics", "A/B Testing", "Dashboard Design"],
  "Backend Developer": ["Python", "Java", "Node.js", "SQL", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL", "Docker", "Redis", "Microservices", "Git", "Linux", "Testing", "Security"],
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Next.js", "Vue.js", "Responsive Design", "Accessibility", "Git", "Testing", "Webpack", "State Management", "Performance Optimization"],
  "Mobile Developer": ["React Native", "Flutter", "Swift", "Kotlin", "Java", "Dart", "iOS", "Android", "REST APIs", "Firebase", "Git", "UI/UX", "App Store Deployment", "State Management", "Testing"]
};

export const ROLE_COURSES = {
  "Software Engineer": [
    { title: "CS50: Introduction to Computer Science", platform: "Harvard/edX", url: "https://cs50.harvard.edu/" },
    { title: "System Design Interview Prep", platform: "educative.io", url: "https://www.educative.io/courses/grokking-the-system-design-interview" },
    { title: "The Complete Python Bootcamp", platform: "Udemy", url: "https://www.udemy.com/course/complete-python-bootcamp/" }
  ],
  "Data Scientist": [
    { title: "Data Science Specialization", platform: "Johns Hopkins/Coursera", url: "https://www.coursera.org/specializations/jhu-data-science" },
    { title: "Machine Learning by Andrew Ng", platform: "Coursera", url: "https://www.coursera.org/learn/machine-learning" },
    { title: "Applied Data Science with Python", platform: "University of Michigan/Coursera", url: "https://www.coursera.org/specializations/data-science-python" }
  ],
  "Web Developer": [
    { title: "The Odin Project", platform: "Free", url: "https://www.theodinproject.com/" },
    { title: "Full Stack Open", platform: "University of Helsinki", url: "https://fullstackopen.com/" },
    { title: "React - The Complete Guide", platform: "Udemy", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/" }
  ],
  "ML Engineer": [
    { title: "Deep Learning Specialization", platform: "Coursera", url: "https://www.coursera.org/specializations/deep-learning" },
    { title: "MLOps Specialization", platform: "Coursera", url: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops" },
    { title: "Fast.ai Practical Deep Learning", platform: "Fast.ai", url: "https://course.fast.ai/" }
  ],
  "DevOps Engineer": [
    { title: "Docker & Kubernetes: The Practical Guide", platform: "Udemy", url: "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/" },
    { title: "AWS Certified Solutions Architect", platform: "A Cloud Guru", url: "https://acloudguru.com/" },
    { title: "Terraform Up & Running", platform: "O'Reilly", url: "https://www.oreilly.com/" }
  ],
  "Cybersecurity Analyst": [
    { title: "Google Cybersecurity Certificate", platform: "Coursera", url: "https://www.coursera.org/professional-certificates/google-cybersecurity" },
    { title: "CompTIA Security+", platform: "CompTIA", url: "https://www.comptia.org/certifications/security" },
    { title: "Ethical Hacking", platform: "Udemy", url: "https://www.udemy.com/course/learn-ethical-hacking-from-scratch/" }
  ],
  "Cloud Engineer": [
    { title: "AWS Cloud Practitioner Essentials", platform: "AWS", url: "https://aws.amazon.com/training/" },
    { title: "Google Cloud Professional Engineer", platform: "Google Cloud", url: "https://cloud.google.com/certification" },
    { title: "Azure Fundamentals", platform: "Microsoft", url: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/" }
  ],
  "AI Engineer": [
    { title: "AI for Everyone by Andrew Ng", platform: "Coursera", url: "https://www.coursera.org/learn/ai-for-everyone" },
    { title: "Generative AI with LLMs", platform: "Coursera", url: "https://www.coursera.org/learn/generative-ai-with-llms" },
    { title: "Hugging Face NLP Course", platform: "Hugging Face", url: "https://huggingface.co/learn/nlp-course" }
  ],
  "Data Analyst": [
    { title: "Google Data Analytics Certificate", platform: "Coursera", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
    { title: "SQL for Data Science", platform: "Coursera", url: "https://www.coursera.org/learn/sql-for-data-science" },
    { title: "Tableau Training", platform: "Tableau", url: "https://www.tableau.com/learn/training" }
  ],
  "Backend Developer": [
    { title: "Node.js - The Complete Guide", platform: "Udemy", url: "https://www.udemy.com/course/nodejs-the-complete-guide/" },
    { title: "Database Engineering", platform: "Udemy", url: "https://www.udemy.com/course/database-engines-crash-course/" },
    { title: "Microservices with Node.js and React", platform: "Udemy", url: "https://www.udemy.com/course/microservices-with-node-js-and-react/" }
  ],
  "Frontend Developer": [
    { title: "Frontend Masters Learning Path", platform: "Frontend Masters", url: "https://frontendmasters.com/" },
    { title: "CSS for JavaScript Developers", platform: "Josh Comeau", url: "https://css-for-js.dev/" },
    { title: "Testing JavaScript", platform: "Kent C. Dodds", url: "https://testingjavascript.com/" }
  ],
  "Mobile Developer": [
    { title: "React Native - The Practical Guide", platform: "Udemy", url: "https://www.udemy.com/course/react-native-the-practical-guide/" },
    { title: "Flutter & Dart Complete Guide", platform: "Udemy", url: "https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/" },
    { title: "iOS & Swift Bootcamp", platform: "Udemy", url: "https://www.udemy.com/course/ios-13-app-development-bootcamp/" }
  ]
};

export const ROLE_VIDEOS = {
  "Software Engineer": [
    { title: "How to Become a Software Engineer", channel: "TechLead", url: "https://www.youtube.com/watch?v=Software-Engineer-Guide" },
    { title: "Data Structures Easy to Advanced", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=RBSGKlAvoiM" }
  ],
  "Data Scientist": [
    { title: "Data Science Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=ua-CiDNNj30" },
    { title: "Statistics for Data Science", channel: "StatQuest", url: "https://www.youtube.com/c/joshstarmer" }
  ],
  "Web Developer": [
    { title: "Web Development Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg" },
    { title: "JavaScript Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c" }
  ],
  "ML Engineer": [
    { title: "Machine Learning Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=GwIo3gDZCVQ" },
    { title: "MLOps Explained", channel: "DataTalks.Club", url: "https://www.youtube.com/c/DataTalksClub" }
  ],
  "DevOps Engineer": [
    { title: "DevOps Engineering Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=j5Zsa_eOXeY" },
    { title: "Kubernetes Tutorial", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=X48VuDVv0do" }
  ],
  "Cybersecurity Analyst": [
    { title: "Cybersecurity Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=U_P23SqJaDc" },
    { title: "Ethical Hacking in 12 Hours", channel: "The Cyber Mentor", url: "https://www.youtube.com/watch?v=fNzpcB7ODxQ" }
  ],
  "Cloud Engineer": [
    { title: "AWS Certified Cloud Practitioner", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=SOTamWNgDKc" },
    { title: "Cloud Computing Full Course", channel: "Edureka", url: "https://www.youtube.com/watch?v=EN4fEbcFZ_E" }
  ],
  "AI Engineer": [
    { title: "AI Engineering Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=mEsleV16qdo" },
    { title: "LLMs Explained", channel: "3Blue1Brown", url: "https://www.youtube.com/watch?v=wjZofJX0v4M" }
  ],
  "Data Analyst": [
    { title: "Data Analyst Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8" },
    { title: "SQL Tutorial - Full Database Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" }
  ],
  "Backend Developer": [
    { title: "Backend Web Development", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=XBu54nfzxAQ" },
    { title: "REST API Design Best Practices", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=fgTGADljAeg" }
  ],
  "Frontend Developer": [
    { title: "React Course - Beginner to Advanced", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
    { title: "CSS Grid & Flexbox Tutorial", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=0xMQfnTU6oo" }
  ],
  "Mobile Developer": [
    { title: "React Native Tutorial", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=0-S5a0eXPoc" },
    { title: "Flutter Course for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=VPvVD8t02U8" }
  ]
};