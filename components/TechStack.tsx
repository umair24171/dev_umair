'use client';

import { motion } from 'framer-motion';

const techStack = {
  'Mobile Development': ['Flutter', 'Dart', 'iOS', 'Android', 'App Store', 'Play Store'],
  'Frontend': ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML/CSS'],
  'Backend': ['Node.js', 'Express', 'MongoDB', 'Firebase', 'REST APIs', 'Cloud Functions'],
  'Tools & Services': ['Git', 'Vercel', 'Stripe', 'RevenueCat', 'Firebase Auth', 'Firestore'],
  'AI & Integration': ['OpenAI', 'AI/ML', 'Socket.IO', 'Real-time Chat', 'Payment Systems'],
};

export default function TechStack() {
  return (
    <section id="tech" className="min-h-screen px-6 md:px-12 lg:px-24 py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Tech <span className="text-primary">Stack</span>
          </h2>
          <p className="text-lg text-foreground opacity-80 max-w-2xl mx-auto">
            Technologies I use to build production-ready applications
          </p>
        </motion.div>

        {/* Tech Categories */}
        <div className="space-y-12">
          {Object.entries(techStack).map(([category, technologies], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              {/* Category Title */}
              <h3 className="text-xl font-semibold mb-4 text-primary">
                {category}
              </h3>

              {/* Technologies Grid */}
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech, techIndex) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: techIndex * 0.05 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="bg-[#1A1F3A] backdrop-blur-sm border-2 border-primary border-opacity-30 px-5 py-3 rounded-lg hover:border-opacity-70 transition-all duration-300 cursor-default"
                  >
                    <span className="text-sm font-medium text-foreground">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { number: '3+', label: 'Production Apps' },
            { number: '1000+', label: 'Active Users' },
            { number: '70+', label: 'Languages Supported' },
            { number: '100%', label: 'Client Satisfaction' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border-2 border-primary border-opacity-30"
            >
              <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-foreground opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}