export const site = {
  url: 'https://www.buildzn.com',
  email: 'buildznofficial@gmail.com',
  linkedin: 'https://www.linkedin.com/in/umair-bilal-/',
  github: 'https://github.com/umair24171',
  contact: '/#contact',
  whatsapp: 'https://wa.me/923067128817?text=Hi%20Umair%2C%20I%20visited%20BuildZn%20and%20would%20like%20to%20discuss%20a%20product%20or%20AI%20workflow.',
  formId: 'xykywokz',
};

export const processSteps = [
  { title: 'Understand the problem', text: 'Start with your users, the business goal and the constraints. Decide what the first useful release needs to do.' },
  { title: 'Agree on the scope', text: 'Set deliverables, dependencies, acceptance criteria, milestones and price before implementation begins.' },
  { title: 'Build and review', text: 'Review working progress at agreed milestones. Handle new requests explicitly, so changes stay visible.' },
  { title: 'Launch and hand over', text: 'Complete the agreed release work and handover. Define account ownership, documentation and post-launch support.' },
];

export const services = [
  {
    slug: 'mobile-app-development', number: '01', name: 'Mobile app development', short: 'A focused first release. A product you can build on.',
    description: 'Flutter apps for iOS and Android, with the backend, integrations and release work scoped around your actual product.',
    audience: 'Founders building a first mobile product, and teams adding a mobile experience to an existing business.',
    problem: 'The idea is clear, but the feature list keeps growing. The useful first step is deciding which user journey must work before anything else.',
    deliverables: ['Core user journeys and release scope', 'Flutter implementation for agreed platforms', 'Backend and third-party integrations', 'Device testing and store submission support'],
    boundaries: 'Store accounts, review decisions, external service fees, content and design dependencies are identified in the proposal. Submission support does not guarantee third-party approval.',
    questions: ['Who is the first release for?', 'What must a user be able to complete?', 'Which integrations or existing systems are involved?', 'What are the timeline and budget constraints?'],
  },
  {
    slug: 'saas-product-development', number: '02', name: 'SaaS & product development', short: 'Make the core workflow useful before making it bigger.',
    description: 'Web products, Node.js APIs and internal tools that connect the customer experience to the way your business operates.',
    audience: 'Small teams launching a SaaS product or replacing a manual operational workflow.',
    problem: 'A dashboard is only useful if the workflow behind it is dependable. Permissions, payments and the operational edge cases need to be designed together.',
    deliverables: ['Product workflow and permissions', 'Web interface and Node.js API scope', 'Authentication, billing or integrations as agreed', 'Deployment, documentation and handover'],
    boundaries: 'Infrastructure, email, payment processing and other third-party charges are separated from implementation. Data migration and advanced reporting are scoped explicitly.',
    questions: ['Who uses the product, and what can each role do?', 'What does the workflow replace?', 'What data needs to move between systems?', 'What does a successful first release look like?'],
  },
  {
    slug: 'ai-workflow-integration', number: '03', name: 'AI workflows & integrations', short: 'A useful workflow starts with a task worth improving.',
    description: 'AI features and agents with defined inputs, tool access, evaluation criteria and human review where it matters.',
    audience: 'Teams with a specific repetitive task, knowledge-retrieval problem or AI feature to evaluate.',
    problem: 'A convincing demo can still fail in daily use. Define the task, the cost of mistakes, the fallback and the operating cost before expanding automation.',
    deliverables: ['Task definition and evaluation examples', 'Model and tool integration', 'Permissions, fallbacks and review points', 'Cost and reliability checks on an agreed workload'],
    boundaries: 'Model usage, external subscriptions and ongoing monitoring are defined separately. Model accuracy is evaluated for the agreed task rather than promised universally.',
    questions: ['What exact task should the workflow complete?', 'What data and tools can it access?', 'Which actions need human approval?', 'How will usefulness, cost and failures be measured?'],
  },
  {
    slug: 'product-improvement', number: '04', name: 'Improve an existing product', short: 'Find the bottleneck. Fix the right part.',
    description: 'Focused work on performance, unreliable flows, difficult integrations and development bottlenecks in an existing app.',
    audience: 'Founders and product teams with a working app that needs a clear technical next step.',
    problem: 'A rewrite is a large commitment. First reproduce the problem, identify its cause and compare a focused fix with the cost of replacing the system.',
    deliverables: ['Review of the affected flow and available evidence', 'Prioritized implementation scope', 'Targeted fixes and regression checks', 'Documented changes and next-step recommendations'],
    boundaries: 'The review depends on source access and reproducible examples. A performance target needs a baseline, test conditions and an agreed measurement method.',
    questions: ['What is failing or slowing the team down?', 'Can the problem be reproduced?', 'What source, logs and metrics are available?', 'Which change would make the biggest difference?'],
  },
];

export const projects = [
  {
    slug: 'muslifie', name: 'Muslifie', category: 'Travel marketplace', image: '/muslifie-app.png', imageAlt: 'Muslifie home screen showing travel discovery, prayer information and guide categories',
    summary: 'A mobile marketplace for discovering faith-friendly travel experiences and local guides.',
    scope: 'Flutter mobile development, backend integrations and marketplace workflows.',
    features: ['Travel discovery and booking flows', 'Guide and traveler experiences', 'Messaging and payment integrations'],
    decision: 'A marketplace needs more than a discovery screen. Booking, provider workflows and payment states have to stay understandable when a reservation changes or a request fails.',
    stack: ['Flutter', 'Node.js', 'Next.js', 'Stripe'],
    ios: 'https://apps.apple.com/us/app/muslifie/id6749224199', android: 'https://play.google.com/store/apps/details?id=com.app.muslifie', web: 'https://www.muslifie.com/',
    imageSource: 'Product screenshot included in this repository.',
  },
  {
    slug: 'myaipal', name: 'MyAiPal', category: 'AI companion', image: '/myaipal-app.jpg', imageAlt: 'MyAiPal App Store screenshot showing a mood-rating journal interface',
    summary: 'An AI companion with conversations, mood tracking and voice journaling.',
    scope: 'Flutter mobile development and integrations for AI conversations, journaling and subscriptions.',
    features: ['Conversation and journaling experiences', 'Mood check-ins', 'Subscription integration'],
    decision: 'An AI feature sits inside a larger product experience. Onboarding, subscriptions and understandable error states matter alongside the generated response.',
    stack: ['Flutter', 'AI integration', 'Firebase', 'RevenueCat'],
    ios: 'https://apps.apple.com/us/app/myaipal/id6753610068', android: 'https://play.google.com/store/apps/details?id=com.app.myaipal', web: undefined,
    imageSource: 'Public App Store listing screenshot, retrieved September 30, 2026 (UTC).',
  },
  {
    slug: 'farahgpt', name: 'FarahGPT', category: 'Learning & habits', image: undefined, imageAlt: '',
    summary: 'A mobile product combining Islamic learning, AI conversations and habit-building features.',
    scope: 'Flutter product development with AI, learning flows and subscription integrations.',
    features: ['AI-assisted learning conversations', 'Habit and streak experiences', 'Subscription integration'],
    decision: 'Returning to a learning product should feel simple. The conversation experience and habit-building flows need to support the same user journey.',
    stack: ['Flutter', 'Supabase', 'AI integration', 'RevenueCat'],
    ios: 'https://apps.apple.com/pk/app/farahgpt/id6746275409', android: 'https://play.google.com/store/apps/details?id=com.app.farahgpt', web: undefined,
    imageSource: undefined,
  },
  {
    slug: 'voisbe', name: 'Voisbe', category: 'Voice-first social', image: '/voisbe-app.jpg', imageAlt: 'Voisbe public App Store promotional screenshot of its voice-first social experience',
    summary: 'A social experience built around audio posts and voice comments.',
    scope: 'Flutter mobile development for audio publishing and social interactions.',
    features: ['Audio post and comment flows', 'Rich media presentation', 'Mobile social interactions'],
    decision: 'An audio product has to make recording, publishing and playback feel dependable. Those flows need clear states before adding more social features.',
    stack: ['Flutter', 'Firebase', 'Node.js', 'Audio'],
    ios: 'https://apps.apple.com/us/app/voisbe/id6702029635', android: undefined, web: undefined,
    imageSource: 'Public App Store listing screenshot, retrieved September 30, 2026 (UTC).',
  },
];

export const faqs = [
  { question: 'Can you work on an existing app?', answer: 'Yes. Share the product, the problem and the source access available for review. The implementation scope follows that review.' },
  { question: 'Can you help decide what belongs in the MVP?', answer: 'Yes. Start with the core user journey and the smallest useful release, then agree on what belongs in the first scope.' },
  { question: 'How do pricing and timelines work?', answer: 'The proposal defines deliverables, milestones, dependencies, acceptance criteria and price. Hosting, model usage and other third-party fees are identified separately. New requirements are scoped explicitly.' },
  { question: 'How is AI work evaluated?', answer: 'Define the task, representative examples, acceptable failures and review points. Evaluate usefulness, reliability and operating cost on the agreed workload before expanding it.' },
  { question: 'What happens after launch?', answer: 'The proposal sets out documentation, account and source ownership, the support period and what counts as a defect versus new work.' },
];
