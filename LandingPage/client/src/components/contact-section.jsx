import React, { useState } from "react"
import { Button } from "./ui/button.jsx"
import DotBackground from "./ui/dot-background.jsx"
import { Linkedin, Instagram, ChevronDown, HelpCircle, Rocket, Heart, Github, Mail, MessageSquare, ExternalLink, Sparkles } from "lucide-react"
import logo from "../assets/CrackCode-Logo.png"

export default function ContactSection() {
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    {
      question: "Is CrackCode free to use?",
      answer: "CrackCode offers a free tier with access to introductory detective cases and basic features. Premium plans unlock advanced storylines, exclusive challenges, AI tutor sessions, and competitive leaderboard features."
    },
    {
      question: "What programming languages can I learn?",
      answer: "We support C++, Python, Java, JavaScript, PHP, HTML, CSS, and React. Each language has detective-themed stories and challenges using our Monaco code editor with Judge0 API integration for real code execution."
    },
    {
      question: "Do I need prior coding experience?",
      answer: "Not at all! CrackCode is designed for learners aged 12 and up, from complete beginners to undergraduates. Our narrative-driven approach makes complex concepts accessible and fun."
    },
    {
      question: "How does the AI error diagnosis work?",
      answer: "When you submit code with errors, our AI analyzes the issue and explains it in detective narrative style - making debugging feel like solving a mystery rather than a frustrating task."
    },
    {
      question: "What are XP and tokens used for?",
      answer: "XP (experience points) track your progress and ranking on the leaderboard. Tokens are earned by completing challenges and can be spent in the shop to unlock avatars, UI themes, and exclusive content."
    },
    {
      question: "What is the Career Map feature?",
      answer: "The Career Map helps you explore different development paths with quizzes and brownfield questions. It guides you through skills needed for roles like Frontend, Backend, Full-Stack, or ML Developer."
    }
  ]

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-[#050505] overflow-hidden">
      <DotBackground color="#f97316" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-500 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Have <span className="text-orange-500">Questions</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed max-w-2xl mx-auto">
            Find answers below or connect with us on social media. We're here to help you start your coding detective journey!
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* FAQ Section - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <HelpCircle className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-card/80 border border-border rounded-xl overflow-hidden hover:border-orange-500/30 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/20 transition-colors"
                  >
                    <span className="font-medium text-foreground pr-4 text-sm md:text-base">{faq.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-orange-500 shrink-0 transition-transform duration-300 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - CTA & Social Links - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main CTA Card */}
            <div className="bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent border border-orange-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="p-3 bg-orange-500/20 rounded-xl w-fit mb-5">
                  <Rocket className="w-7 h-7 text-orange-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Crack the Code?</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                  Join learners solving mysteries and mastering programming. Your detective journey starts now!
                </p>

                <Button 
                  size="lg" 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-base rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Learning Free
                </Button>
              </div>
            </div>

            {/* Connect Card */}
            <div className="bg-card/80 border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-5">Connect With Us</h3>
              
              <div className="space-y-3">
                <a 
                  href="https://www.linkedin.com/in/crack-code-619461396" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-all duration-300 group"
                >
                  <div className="p-2.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Linkedin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">LinkedIn</div>
                    <div className="text-xs text-muted-foreground">Follow for updates</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </a>
                
                <a 
                  href="https://www.instagram.com/crackcodelk" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-pink-500/10 border border-transparent hover:border-pink-500/30 transition-all duration-300 group"
                >
                  <div className="p-2.5 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                    <Instagram className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">Instagram</div>
                    <div className="text-xs text-muted-foreground">@crackcodelk</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-pink-500 transition-colors" />
                </a>
                
                <a 
                  href="#" 
                  // target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-slate-500/10 border border-transparent hover:border-slate-500/30 transition-all duration-300 group"
                >
                  <div className="p-2.5 bg-slate-500/10 rounded-lg group-hover:bg-slate-500/20 transition-colors">
                    <Github className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">GitHub</div>
                    <div className="text-xs text-muted-foreground">View our code</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-slate-400 transition-colors" />
                </a>

                <a 
                  href="mailto:info.crackcode@gmail.com" 
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-orange-500/10 border border-transparent hover:border-orange-500/30 transition-all duration-300 group"
                >
                  <div className="p-2.5 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                    <Mail className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">Email Us</div>
                    <div className="text-xs text-muted-foreground">info.crackcode@gmail.com</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER - Clean without duplicate socials */}
      <footer className="mt-24 border-t border-border relative z-10">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Logo */}
            <a href="#home" className="block group transition-transform hover:scale-105 cursor-pointer">
              <img 
                src={logo} 
                alt="CrackCode Logo" 
                className="h-10 w-auto object-contain" 
              />
            </a>

            {/* Nav Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {["Home", "Problem", "Solution", "Preview", "Team"].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-muted-foreground hover:text-orange-500 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">Terms</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 CrackCode. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for learners everywhere
            </p>
          </div>
        </div>
      </footer>
    </section>
  )
}