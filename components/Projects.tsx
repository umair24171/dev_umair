'use client';

import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Muslifie',
    description: 'Muslim travel marketplace connecting travelers with local guides. Full booking system with Stripe payments, real-time chat, and multi-language support.',
    tech: ['Flutter', 'Next.js', 'Node.js', 'MongoDB', 'Firebase', 'Stripe'],
    links: {
      live: 'https://muslifie.com',
      appStore: 'https://apps.apple.com/us/app/muslifie/id6749224199',
      playStore: 'https://play.google.com/store/apps/details?id=com.app.muslifie&hl=en',
    },
    highlights: ['Live on iOS & Android', 'Thousands of active users', '70+ languages'],
  },
  {
    title: 'MyAiPal',
    description: 'AI-powered wellness companion helping users with mental health support, journaling, and personalized guidance through advanced AI conversations.',
    tech: ['Flutter', 'Firebase', 'RevenueCat', 'Stripe', 'AI/ML'],
    links: {
      appStore: 'https://apps.apple.com/us/app/myaipal/id6753610068',
      playStore:'https://play.google.com/store/apps/details?id=com.app.myaipal&hl=en'
    },
    highlights: ['Subscription-based', 'AI-driven insights', 'Cross-platform'],
  },
  {
    title: 'FarahGPT',
    description: 'Educational AI platform providing personalized learning experiences and intelligent tutoring for students across multiple subjects.',
    tech: ['Flutter', 'Firebase', 'OpenAI', 'Next.js'],
    links: {
      appStore: 'https://apps.apple.com/pk/app/farahgpt/id6746275409',
      playStore:'https://play.google.com/store/apps/details?id=com.app.farahgpt'
    },
    highlights: ['AI Education', 'Personalized learning', 'Real-time assistance'],
  },
  {
    title: 'Voisbe',
    description: 'Voisbe is a voice-first social network where users share posts and comments entirely through audio, paired with rich photo and video backgrounds. Built with Flutter and Firebase, it delivers an Instagram-style experience with profiles, follows, likes, voice comments, and real-time feeds. Features a robust audio infrastructure for recording, storage, and playback, creating a seamless, media-rich social platform designed around voice instead of text.',
    tech: ['Flutter', 'Firebase', 'Node.js', 'Stripe','RevenueCat'],
    links: {
      appStore: 'https://apps.apple.com/us/app/voisbe/id6702029635',
      playStore:'https://play.google.com/store/search?q=Voisbe&c=apps&hl=en'
    },
    highlights: ['Social', 'Voice Sharing', 'Real-time assistance'],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="min-h-screen px-6 md:px-12 lg:px-24 py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-lg text-foreground opacity-80 max-w-2xl">
            Production apps live in the App Store and Play Store, serving real users with real impact.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-[#1A1F3A] backdrop-blur-sm border-2 border-primary border-opacity-30 rounded-2xl p-6 hover:border-opacity-60 transition-all duration-300 hover:scale-105 group"
            >
              {/* Project Title */}
              <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-foreground opacity-80 mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="text-xs bg-primary text-background font-medium px-3 py-1 rounded-full"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-accent text-white font-medium px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3 flex-wrap">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View Live →
                  </a>
                )}
                {project.links.appStore && (
                  <a
                    href={project.links.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    App Store →
                  </a>
                )}
                {project.links.playStore && (
                  <a
                    href={project.links.playStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Play Store →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}