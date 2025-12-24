export interface CaseStudyTemplate {
  title: string;
  content: string;
  excerpt: string;
  categories: Array<{
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
    order: number;
  }>;
  tags: Array<{
    name: string;
    slug: string;
  }>;
  author: {
    name: string;
    role: string;
    bio: string;
    email: string;
    linkedin?: string;
    twitter?: string;
  };
  featured: boolean;
  comments: Array<{
    content: string;
    authorName: string;
    authorEmail: string;
    likes?: number;
  }>;
  metaTitle?: string;
  metaDescription?: string;
  readTime?: number;
}

export const CASE_STUDY_TEMPLATES: CaseStudyTemplate[] = [
  {
    title: 'Digital Transformation for Manufacturing Excellence',
    excerpt: 'How a leading automotive manufacturer reduced downtime by 30% through predictive maintenance using IoT and AI solutions developed by our engineering team.',
    content: `
# Digital Transformation in Manufacturing

## Challenge
The client, a major automotive parts manufacturer, was facing significant production losses due to unplanned machinery downtime. Their legacy systems lacked real-time monitoring capabilities, leading to reactive maintenance strategies that were both costly and inefficient. They needed a solution to predict failures before they occurred and optimize their maintenance schedules.

## Solution
Our team implemented a comprehensive Industrial IoT (IIoT) solution combined with machine learning algorithms.

### Key Components:
1. **Sensor Integration:** We installed vibration, temperature, and acoustic sensors on critical machinery.
2. **Data Pipeline:** A real-time data ingestion pipeline was built to collect and process sensor data.
3. **Predictive Models:** We developed custom ML models to identify anomaly patterns indicative of potential failures.
4. **Dashboard & Alerts:** An intuitive dashboard for operators and a real-time alert system for maintenance crews.

## Results
The implementation yielded impressive results within the first six months:
- **30% Reduction** in unplanned downtime.
- **15% Increase** in overall equipment effectiveness (OEE).
- **20% Decrease** in maintenance costs.

> "The predictive maintenance solution has completely transformed our operations. We can now schedule maintenance during planned shutdowns, ensuring uninterrupted production." - Plant Manager

## Conclusion
This project demonstrates the power of Industry 4.0 technologies in solving real-world manufacturing challenges. By leveraging data, we empowered the client to move from reactive to proactive decision-making.
    `,
    categories: [
      {
        name: 'Industry 4.0',
        slug: 'industry-4-0',
        description: 'Smart manufacturing and industrial automation',
        color: 'blue',
        icon: 'Factory',
        order: 1,
      },
      {
        name: 'AI & ML',
        slug: 'ai-ml',
        description: 'Artificial Intelligence and Machine Learning applications',
        color: 'purple',
        icon: 'Brain',
        order: 2,
      },
    ],
    tags: [
      { name: 'IoT', slug: 'iot' },
      { name: 'Manufacturing', slug: 'manufacturing' },
      { name: 'Predictive Maintenance', slug: 'predictive-maintenance' },
    ],
    author: {
      name: 'Dr. Sarah Chen',
      role: 'Head of Industrial Innovation',
      bio: 'Dr. Chen specializes in IIoT systems and has over 15 years of experience in manufacturing technology.',
      email: 'sarah.chen@sona.edu.in',
      linkedin: 'sarah-chen-iiot',
    },
    featured: true,
    comments: [
      {
        content: 'This is a fantastic example of practical AI application. Great work!',
        authorName: 'Michael Ross',
        authorEmail: 'mross@techcorp.com',
        likes: 12,
      },
      {
        content: 'Could you share more details about the sensors used?',
        authorName: 'David Lee',
        authorEmail: 'dlee@eng-solutions.com',
        likes: 5,
      },
    ],
  },
  {
    title: 'AI-Powered Student Success Platform',
    excerpt: 'Developing a personalized learning recommendation engine that improved student engagement and course completion rates by 25%.',
    content: `
# Revolutionizing Education with AI

## The Problem
Educational institutions often struggle to provide personalized attention to every student. With large class sizes, identifying students who are falling behind or need more challenging material is difficult. Our goal was to create a platform that adapts to each student's learning pace and style.

## Our Approach
We designed an AI-driven Student Success Platform that integrates with the existing Learning Management System (LMS).

### Features:
- **Learning Analytics:** Tracking student progress and engagement in real-time.
- **Personalized Recommendations:** Suggesting resources, practice problems, and study schedules based on performance.
- **Early Warning System:** Alerting faculty and advisors about students at risk of dropping out.

## Impact
After a pilot program with 500 students:
- **25% Improvement** in course completion rates.
- **40% Increase** in student engagement with course materials.
- **High Satisfaction:** 90% of students reported that the recommendations were helpful.

## Future Plans
We are planning to expand the platform to include peer-to-peer tutoring matching and career path recommendations based on academic performance and interests.
    `,
    categories: [
      {
        name: 'EdTech',
        slug: 'edtech',
        description: 'Technology solutions for education',
        color: 'green',
        icon: 'GraduationCap',
        order: 3,
      },
      {
        name: 'Software Development',
        slug: 'software-development',
        description: 'Custom software engineering projects',
        color: 'indigo',
        icon: 'Code',
        order: 4,
      },
    ],
    tags: [
      { name: 'Education', slug: 'education' },
      { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
      { name: 'Student Success', slug: 'student-success' },
    ],
    author: {
      name: 'Prof. James Wilson',
      role: 'Director of EdTech Research',
      bio: 'Prof. Wilson leads the EdTech initiative, focusing on adaptive learning technologies.',
      email: 'james.wilson@sona.edu.in',
      twitter: '@jwilson_edtech',
    },
    featured: true,
    comments: [
      {
        content: 'Personalized learning is definitely the future. Exciting results!',
        authorName: 'Emily Clark',
        authorEmail: 'eclark@edu-innovate.org',
        likes: 8,
      },
    ],
  },
  {
    title: 'Sustainable Urban Planning with Geospatial Data',
    excerpt: 'Leveraging GIS and satellite imagery to help city planners optimize green spaces and reduce urban heat islands.',
    content: `
# Greener Cities through Data

## Overview
Rapid urbanization often leads to the reduction of green spaces and the formation of urban heat islands. We partnered with the city planning department to develop a tool that uses geospatial data to identify optimal locations for new parks and green roofs.

## Methodology
We utilized satellite imagery, topographic maps, and demographic data.

1. **Data Collection:** Aggregating multi-spectral satellite images.
2. **Analysis:** Using GIS software to analyze vegetation cover and surface temperatures.
3. **Modeling:** Simulating the impact of adding green spaces in different locations.

## Outcome
The tool identified 50 priority locations for green interventions. The city has already begun implementing green roofs on 10 public buildings based on our recommendations, projected to reduce local temperatures by up to 2°C.

## Technologies Used
- ArcGIS
- Python (GeoPandas, Rasterio)
- Remote Sensing Data

This project highlights the crucial role of technology in building sustainable and resilient cities.
    `,
    categories: [
      {
        name: 'Sustainability',
        slug: 'sustainability',
        description: 'Green technology and environmental solutions',
        color: 'teal',
        icon: 'Leaf',
        order: 5,
      },
      {
        name: 'Research',
        slug: 'research',
        description: 'Academic and applied research projects',
        color: 'orange',
        icon: 'Flask',
        order: 6,
      },
    ],
    tags: [
      { name: 'GIS', slug: 'gis' },
      { name: 'Urban Planning', slug: 'urban-planning' },
      { name: 'Environment', slug: 'environment' },
    ],
    author: {
      name: 'Dr. Anita Roy',
      role: 'Senior Researcher, Civil Engineering',
      bio: 'Dr. Roy is an expert in urban planning and geospatial analysis.',
      email: 'anita.roy@sona.edu.in',
    },
    featured: false,
    comments: [],
  },
  {
    title: 'Blockchain for Secure Academic Credentials',
    excerpt: 'Implementing a tamper-proof system for issuing and verifying digital diplomas and transcripts using blockchain technology.',
    content: `
# Trust in Credentials

## Challenge
Credential fraud is a growing concern. Verifying academic records is often a slow, manual process for employers and other institutions. We needed a secure, instant, and immutable way to issue and verify degrees.

## Solution
We built a decentralized application (dApp) on a permissioned Ethereum-based blockchain.

### How it Works:
1. **Issuance:** When a student graduates, the institution issues a digital certificate signed with its private key.
2. **Storage:** A hash of the certificate is stored on the blockchain.
3. **Verification:** Employers can upload the digital certificate to a verification portal, which checks the hash against the blockchain record.

## Benefits
- **Security:** Impossible to forge or alter records.
- **Efficiency:** Verification takes seconds instead of weeks.
- **Ownership:** Students own their digital credentials and can share them easily.

This system is now being used to issue all new degrees, setting a standard for digital trust in academia.
    `,
    categories: [
      {
        name: 'Software Development',
        slug: 'software-development',
        description: 'Custom software engineering projects',
        color: 'indigo',
        icon: 'Code',
        order: 4,
      },
    ],
    tags: [
      { name: 'Blockchain', slug: 'blockchain' },
      { name: 'Security', slug: 'security' },
      { name: 'FinTech', slug: 'fintech' },
    ],
    author: {
      name: 'Rajiv Kumar',
      role: 'Lead Blockchain Developer',
      bio: 'Rajiv is a blockchain enthusiast and lead developer at the innovation center.',
      email: 'rajiv.kumar@sona.edu.in',
      twitter: '@rajiv_chain',
    },
    featured: false,
    comments: [
      {
        content: 'This solves a real pain point in recruitment verification.',
        authorName: 'HR Manager',
        authorEmail: 'hr@recruitment.com',
        likes: 3,
      },
    ],
  },
  {
    title: 'Smart Grid Energy Management System',
    excerpt: 'Designing an intelligent energy management system for the campus to optimize consumption and integrate renewable energy sources.',
    content: `
# Smart Energy Campus

## Objective
To reduce the campus's carbon footprint and energy costs by optimizing energy consumption and effectively managing solar power generation.

## Implementation
We deployed smart meters across all campus buildings and developed a central control system.

### Key Features:
- **Demand Response:** Automatically adjusting HVAC and lighting based on occupancy and peak load pricing.
- **Solar Integration:** Managing the flow of energy from rooftop solar panels to the grid or battery storage.
- **Real-time Monitoring:** Providing facility managers with detailed insights into energy usage patterns.

## Achievements
- **20% Reduction** in energy bills.
- **15% Reduction** in carbon emissions.
- **Peak Load Shifting:** Successfully reduced peak demand by 10%.

The Smart Grid project serves as a living lab for our electrical engineering students and a model for sustainable campus management.
    `,
    categories: [
      {
        name: 'Sustainability',
        slug: 'sustainability',
        description: 'Green technology and environmental solutions',
        color: 'teal',
        icon: 'Leaf',
        order: 5,
      },
      {
        name: 'Industry 4.0',
        slug: 'industry-4-0',
        description: 'Smart manufacturing and industrial automation',
        color: 'blue',
        icon: 'Factory',
        order: 1,
      },
    ],
    tags: [
      { name: 'Energy', slug: 'energy' },
      { name: 'Smart Grid', slug: 'smart-grid' },
      { name: 'Sustainability', slug: 'sustainability' },
    ],
    author: {
      name: 'Dr. Sarah Chen',
      role: 'Head of Industrial Innovation',
      bio: 'Dr. Chen specializes in IIoT systems and has over 15 years of experience in manufacturing technology.',
      email: 'sarah.chen@sona.edu.in',
      linkedin: 'sarah-chen-iiot',
    },
    featured: true,
    comments: [],
  },
];

export const DEFAULT_CASE_STUDY_TEMPLATE: CaseStudyTemplate = {
  title: 'Innovative Tech Solution Case Study',
  excerpt: 'A detailed look at how we solved a complex problem using cutting-edge technology and collaborative innovation.',
  content: `
# Case Study Title

## Introduction
Brief introduction to the project, the client, and the context.

## Challenge
Description of the specific problem or challenge that needed to be addressed.

## Solution
Detailed explanation of the solution provided, including technologies used and methodology.

## Results
- Quantitative result 1
- Quantitative result 2
- Qualitative outcome

## Conclusion
Summary of the project's success and its broader implications.
  `,
  categories: [
    {
      name: 'Technology',
      slug: 'technology',
      description: 'General technology projects',
      color: 'gray',
      icon: 'Cpu',
      order: 99,
    },
  ],
  tags: [{ name: 'Innovation', slug: 'innovation' }],
  author: {
    name: 'Sona Research Team',
    role: 'R&D Department',
    bio: 'The Sona Research Team is dedicated to solving complex problems through innovation.',
    email: 'research@sona.edu.in',
  },
  featured: false,
  comments: [],
};

