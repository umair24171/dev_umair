'use client';

import { motion } from 'framer-motion';
import { useForm, ValidationError } from '@formspree/react';

export default function Contact() {
  const [state, handleSubmit] = useForm("xykywokz");

  return (
    <section id="contact" className="min-h-screen px-6 md:px-12 lg:px-24 py-20 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Let's <span className="text-primary">Work Together</span>
          </h2>
          <p className="text-lg text-foreground opacity-80 max-w-2xl mx-auto">
            Have a project in mind? Let's build something amazing together.
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Get in Touch</h3>
              <p className="text-foreground opacity-80 leading-relaxed mb-8">
                I'm currently available for freelance work and new projects. 
                Whether you need a mobile app, web application, or technical consultation, 
                I'd love to hear from you.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <motion.a
                href="mailto:umairbilal207@gmail.com"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 bg-[#1A1F3A] rounded-lg border-2 border-primary border-opacity-30 hover:border-opacity-60 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <div className="text-sm text-foreground opacity-60">Email</div>
                  <div className="font-semibold text-primary">umairbilal207@gmail.com</div>
                </div>
              </motion.a>

              <motion.a
                href="https://www.linkedin.com/in/umair-bilal-/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 bg-[#1A1F3A] rounded-lg border-2 border-primary border-opacity-30 hover:border-opacity-60 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <div className="text-sm text-foreground opacity-60">LinkedIn</div>
                  <div className="font-semibold text-primary">Connect with me</div>
                </div>
              </motion.a>

              <motion.a
                href="https://github.com/umair24171"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 bg-[#1A1F3A] rounded-lg border-2 border-primary border-opacity-30 hover:border-opacity-60 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                  <span className="text-2xl">💻</span>
                </div>
                <div>
                  <div className="text-sm text-foreground opacity-60">GitHub</div>
                  <div className="font-semibold text-primary">Check my code</div>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Side - Quick Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[#1A1F3A] backdrop-blur-sm border-2 border-primary border-opacity-30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Send a Message</h3>
              
             {/* Success Message */}
             {state.succeeded && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-[#1A1F3A] border-2 border-primary border-opacity-60 rounded-lg text-foreground text-sm font-medium"
                >
                  ✅ Message sent successfully! 🚀 I'll reply soon.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground opacity-80">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-background border-2 border-primary border-opacity-30 rounded-lg focus:border-opacity-60 focus:outline-none transition-all text-foreground"
                    placeholder="John Doe"
                  />
                  <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-400 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground opacity-80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-background border-2 border-primary border-opacity-30 rounded-lg focus:border-opacity-60 focus:outline-none transition-all text-foreground"
                    placeholder="john@example.com"
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-400 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground opacity-80">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-background border-2 border-primary border-opacity-30 rounded-lg focus:border-opacity-60 focus:outline-none transition-all resize-none text-foreground"
                    placeholder="Tell me about your project..."
                  ></textarea>
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-400 text-sm mt-1" />
                </div>

                <motion.button
                  type="submit"
                  disabled={state.submitting}
                  whileHover={{ scale: state.submitting ? 1 : 1.02 }}
                  whileTap={{ scale: state.submitting ? 1 : 0.98 }}
                  className="w-full px-8 py-4 bg-cta text-background font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.submitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}