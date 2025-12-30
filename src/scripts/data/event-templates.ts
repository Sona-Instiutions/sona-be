export const EVENT_TEMPLATES = [
  {
    keywords: ["workshop", "ai", "artificial intelligence", "machine learning"],
    excerpt:
      "Join our hands-on workshop to explore the latest in Artificial Intelligence and Machine Learning. Perfect for students and professionals looking to build practical AI skills.",
    content: `
## Unlock the Power of AI

Artificial Intelligence is transforming every industry. This comprehensive workshop provides a deep dive into practical AI applications, from neural networks to generative models.

### Watch the Workshop Introduction
https://www.youtube.com/watch?v=R9OHn5ZF4Uo

### What You'll Learn

*   Foundations of Machine Learning and Deep Learning
*   Hands-on experience with popular AI frameworks
*   Building and deploying your first AI model
*   Ethical considerations in AI development

### Learning Environment
![Workshop Setup](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200)
![Collaborative Learning](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200)

### Agenda

The session will cover theory followed by extensive lab sessions. We'll start with basic concepts and move towards advanced implementation strategies.

### Who Should Attend?

Computer science students, software developers, and tech enthusiasts who want to stay ahead of the curve in the rapidly evolving tech landscape.
    `,
    categories: [{ name: "Technology", slug: "technology", color: "blue" }],
    tags: [
      { name: "AI", slug: "ai" },
      { name: "Machine Learning", slug: "ml" },
      { name: "Workshop", slug: "workshop" },
    ],
    comments: [
      {
        authorName: "Sarah Chen",
        authorEmail: "sarah.c@example.com",
        content:
          "I attended the last session and it was brilliant! The hands-on part with neural networks was particularly helpful.",
        status: "approved",
      },
      {
        authorName: "David Miller",
        authorEmail: "david.m@example.com",
        content: "Will there be any prerequisites for this workshop? I'm relatively new to Python.",
        status: "approved",
      },
    ],
  },
  {
    keywords: ["hackathon", "coding", "competition"],
    excerpt:
      "Gear up for the ultimate 24-hour coding challenge! Build innovative solutions, network with peers, and win exciting prizes in our annual flagship hackathon.",
    content: `
## 24 Hours of Innovation

Our annual hackathon brings together the brightest minds to solve real-world problems through technology. Whether you're a designer, developer, or idea-generator, there's a place for you here.

### The Challenge

This year's theme focuses on **"Sustainability through Tech"**. Participants are encouraged to develop applications that address environmental challenges or promote sustainable living.

### Prizes and Recognition

1.  **Grand Prize**: $2,000 and Internship Opportunities
2.  **Runner up**: $1,000 and Tech Gadgets
3.  **Special Mention**: Most Innovative Design

### Support and Mentorship

Industry experts will be available throughout the event to provide guidance and feedback on your projects.
    `,
    categories: [{ name: "Competition", slug: "competition", color: "red" }],
    tags: [
      { name: "Hackathon", slug: "hackathon" },
      { name: "Coding", slug: "coding" },
      { name: "Innovation", slug: "innovation" },
    ],
    comments: [
      {
        authorName: "Alex Rivera",
        authorEmail: "alex.r@example.com",
        content: "Looking for a team! I'm a frontend dev with React experience. Any backend devs interested?",
        status: "approved",
      },
    ],
  },
  {
    keywords: ["career", "fair", "job", "recruitment"],
    excerpt:
      "Connect with top-tier employers and discover exciting career opportunities. Our Career Fair is the bridge between talented students and industry leaders.",
    content: `
## Shape Your Future

The SONA Career Fair is one of the most anticipated events of the year, hosting over 50 companies across various sectors including Finance, Tech, and Manufacturing.

### Why Attend?

*   Direct interaction with recruitment managers
*   On-the-spot resume reviews and feedback
*   Opportunity for preliminary interviews
*   Insight into current industry trends and requirements

### Preparation Tips

Make sure to bring multiple copies of your updated resume, dress professionally, and research the participating companies in advance.
    `,
    categories: [{ name: "Career", slug: "career", color: "green" }],
    tags: [
      { name: "Jobs", slug: "jobs" },
      { name: "Recruitment", slug: "recruitment" },
      { name: "Networking", slug: "networking" },
    ],
    comments: [
      {
        authorName: "Priya Sharma",
        authorEmail: "priya.s@example.com",
        content: "Are there any slots for international companies this time?",
        status: "approved",
      },
    ],
  },
  {
    keywords: ["seminar", "guest", "lecture", "industry talk"],
    excerpt:
      "Gain valuable insights from industry veterans in our exclusive guest lecture series. Learn about the latest trends and challenges in the modern business world.",
    content: `
## Learning from the Best

We are honored to host global leaders who share their journeys, successes, and failures. These sessions provide a unique perspective beyond textbooks.

### Key Highlights

*   Insights into global market dynamics
*   Personal leadership philosophies
*   Future of work in a post-digital era
*   Q&A session with the guest speaker

This seminar is designed to inspire and equip students with the mindset needed to navigate complex professional environments.
    `,
    categories: [{ name: "Education", slug: "education", color: "purple" }],
    tags: [
      { name: "Seminar", slug: "seminar" },
      { name: "Leadership", slug: "leadership" },
      { name: "Industry", slug: "industry" },
    ],
    comments: [
      {
        authorName: "Michael Brown",
        authorEmail: "michael.b@example.com",
        content: "The last seminar with the CEO of TechCorp was life-changing. Highly recommend!",
        status: "approved",
      },
    ],
  },
  {
    keywords: ["web", "development", "react", "javascript"],
    excerpt:
      "Master the art of modern web development. Learn React, Node.js, and best practices for building scalable, high-performance web applications.",
    content: `
## Build the Web of Tomorrow

This intensive web development series takes you from fundamentals to advanced concepts in the modern JavaScript ecosystem.

### Modules Covered

*   **Frontend mastery** with React and Next.js
*   **Backend development** with Node.js and Express
*   **Database management** and optimization
*   **Responsive design** and accessibility

By the end of this course, you will have built a full-stack application from scratch, ready for production deployment.
    `,
    categories: [{ name: "Technology", slug: "technology", color: "blue" }],
    tags: [
      { name: "Web Dev", slug: "web-dev" },
      { name: "React", slug: "react" },
      { name: "JavaScript", slug: "javascript" },
    ],
    comments: [],
  },
];

export const DEFAULT_TEMPLATE = {
  excerpt:
    "A signature SONA event designed to foster growth, innovation, and community engagement within our institution.",
  content: `
## About This Event

Welcome to another hallmark event at SONA. We pride ourselves on creating environments where learning meets practice, and students meet industry.

### What to Expect

Attendees can look forward to a mix of insightful presentations, hands-on activities, and ample networking opportunities. Our goal is to ensure every participant leaves with new knowledge and connections.

*   Expert-led sessions
*   Collaborative workshops
*   Interactive Q&A
*   Networking lunch

Don't miss out on this opportunity to be part of our vibrant community!
  `,
  categories: [{ name: "General", slug: "general", color: "gray" }],
  tags: [
    { name: "Community", slug: "community" },
    { name: "Growth", slug: "growth" },
  ],
  comments: [
    {
      authorName: "Student Alpha",
      authorEmail: "alpha@sona.edu",
      content: "Can't wait for this event!",
      status: "approved",
    },
  ],
};
