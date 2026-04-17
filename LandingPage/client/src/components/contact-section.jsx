import React, { useState } from "react"
import { Button } from "./ui/button.jsx"
import DotBackground from "./ui/dot-background.jsx"
import { Modal } from "./ui/modal.jsx"
import { Linkedin, Instagram, ChevronDown, HelpCircle, Rocket, Mail, MessageSquare, ExternalLink, Sparkles, YoutubeIcon } from "lucide-react"
import logo from "../assets/logo.png"

export default function ContactSection() {
  const [openFaq, setOpenFaq] = useState(null)
  const [activeLegalModal, setActiveLegalModal] = useState(null)

  const faqs = [
    {
      question: "Is CrackCode free to use?",
      answer: "CrackCode offers a free tier with access to introductory  Questionaries and basic features. Premium plans unlock advanced storylines, exclusive challenges, AI tutor sessions, and competitive leaderboard features."
    },
    {
      question: "What programming languages can I learn?",
      answer: "We support C++, Python, Java, JavaScript, PHP, HTML, CSS, and React. Each language has stories and challenges using our Monaco code editor with Judge0 API integration for real code execution."
    },
    {
      question: "Do I need prior coding experience?",
      answer: "Not at all! CrackCode is designed for learners aged 12 and up, from complete beginners to undergraduates. Our narrative-driven approach makes complex concepts accessible and fun."
    },
    {
      question: "How does the AI error diagnosis work?",
      answer: "When you submit code with errors, our AI analyzes the issue and explains it in narrative style - making debugging feel like solving a mystery rather than a frustrating task."
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

  const openPrivacyPolicy = (e) => {
    e.preventDefault()
    setActiveLegalModal("privacy")
  }

  const openTermsAndConditions = (e) => {
    e.preventDefault()
    setActiveLegalModal("terms")
  }

  const closeLegalModal = () => {
    setActiveLegalModal(null)
  }

  const legalModalConfig = {
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-5 text-sm md:text-base">
          <p>
            CrackCode values your privacy. This policy explains what information we collect, how we use it,
            and how we protect it when you use our platform.
          </p>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">1. Information We Collect</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account details such as name, email address, and profile preferences.</li>
              <li>Learning activity including completed challenges, XP, and leaderboard progress.</li>
              <li>Technical data like browser type, device information, and usage analytics.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">2. How We Use Your Information</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and improve learning features, challenges, and career map recommendations.</li>
              <li>To personalize your experience and track your progress.</li>
              <li>To communicate important updates, support notices, and service announcements.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">3. Data Sharing and Security</h4>
            <p>
              We do not sell personal data. Information may be shared only with trusted service providers
              required to run the platform, and we apply reasonable safeguards to protect stored data.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">4. Your Rights</h4>
            <p>
              You may request to access, correct, or delete your account information by contacting us at
              <span className="text-orange-500"><a href="mailto:info.crackcode@gmail.com"> info.crackcode@gmail.com</a></span>.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">5. Data Retention</h4>
            <p>
              We retain data as long as your account is active or needed for platform functionality.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">6. Children’s Privacy</h4>
            <p>
              We do not knowingly collect personal information from children under the age of 13. If you are a parent or guardian and 
              believe your child has provided us with personal information, please contact us at 
              <span className="text-orange-500"><a href="mailto:info.crackcode@gmail.com"> info.crackcode@gmail.com</a></span>.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">7. Changes to Policy</h4>
            <p>
              We may update this policy from time to time. We will notify you of any changes by posting the new policy on our website.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">8. Contact Us</h4>
            <p>
              If you have any questions or concerns about this policy, please contact us at 
              <span className="text-orange-500"><a href="mailto:info.crackcode@gmail.com"> info.crackcode@gmail.com</a></span>.
            </p>
          </div>
        </div>
      )
    },
    terms: {
      title: "Terms & Conditions",
      content: (
        <div className="space-y-5 text-sm md:text-base">
          <p>
            By using CrackCode, you agree to the following terms to ensure a fair, safe, and effective
            learning environment for all users.
          </p>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">1. Acceptable Use</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the platform for educational purposes and lawful activities only.</li>
              <li>Do not attempt to exploit, disrupt, or reverse-engineer platform functionality.</li>
              <li>Respect other learners and avoid abusive or harmful behavior.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">2. Accounts and Content</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>Challenge content, storylines, and platform assets remain property of CrackCode.</li>
              <li>We may suspend accounts that violate these terms or misuse the system.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">3. Service Availability</h4>
            <p>
              We aim for reliable access but cannot guarantee uninterrupted service. Features may change,
              be updated, or be discontinued when necessary.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">4. Limitation of Liability</h4>
            <p>
              CrackCode is provided on an as-available basis. We are not liable for indirect or incidental
              damages arising from use of the platform.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">5. Code Execution & Submissions</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Code submitted may be executed on external systems.</li>
              <li>You retain ownership of your code.</li>
              <li>We may store submissions for analysis and improvement.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">6. Gamification & Rewards</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Points, badges, and rankings are virtual.</li>
              <li>They hold no real-world monetary value.</li>
              <li>We may modify scoring systems at any time.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">7. AI Assistance</h4>
            <p>You must not:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Attempt to hack or disrupt the platform.</li>
              <li>Use bots or automation unfairly.</li>
              <li>Reverse engineer system components.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">8. Intellectual Property</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Platform content (UI, challenges, storylines) belongs to CrackCode.</li>
              <li>You may not copy or redistribute content without permission.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">9. Termination</h4>
            <p>We may suspend or terminate accounts that violate these terms.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">10. Limitation of Liability</h4>
            <p>CrackCode is provided “as is”:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>We are not liable for errors, downtime, or data loss.</li>
              <li>We do not guarantee uninterrupted service.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">11. Changes to Terms</h4>
            <p>We may update these terms at any time. Continued use of the platform constitutes acceptance of the revised terms.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">12. Governing Law</h4>
            These Terms and Conditions shall be governed by and interpreted in accordance 
            with the laws of the <span className="font-bold">Democratic Socialist Republic of Sri Lanka</span>.
          </div>
        </div>
      )
    }
  }

  const modalData = activeLegalModal ? legalModalConfig[activeLegalModal] : null

  return (
    <section 
      id="contact" 
      className="relative py-24 md:py-32 bg-[#050505] overflow-hidden"
      aria-label="Contact and frequently asked questions"
    >
      <DotBackground color="#f97316" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-500 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
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
          <section aria-label="Frequently Asked Questions" className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/10 rounded-lg" aria-hidden="true">
                <HelpCircle className="w-5 h-5 text-orange-500" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Frequently Asked Questions</h3>
            </div>

            <dl className="space-y-3">
              {faqs.map((faq, index) => {
                const panelId  = `faq-answer-${index}`
                const buttonId = `faq-question-${index}`
                const isOpen   = openFaq === index
 
                return (
                  <div
                    key={index}
                    className="bg-card/80 border border-border rounded-xl overflow-hidden hover:border-orange-500/30 transition-all duration-300"
                  >
                    <dt>
                      <button
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/20 transition-colors"
                      >
                        <span className="font-medium text-foreground pr-4 text-sm md:text-base">
                          {faq.question}
                        </span>
                        <ChevronDown
                          aria-hidden="true"
                          className={`w-5 h-5 text-orange-500 shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </dt>
                    <dd
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </dd>
                  </div>
                )
              })}
            </dl>
          </section>

          {/* Right Side - CTA & Social Links - Takes 2 columns */}
          <div aria-label="Get started and connect with us" className="lg:col-span-2 space-y-6">

            {/* Main CTA Card */}
            <div className="bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent border border-orange-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div aria-hidden="true" className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="p-3 bg-orange-500/20 rounded-xl w-fit mb-5" aria-hidden="true">
                  <Rocket className="w-7 h-7 text-orange-500" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Crack the Code?</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                  Join learners solving mysteries and mastering programming. Your detective journey starts now!
                </p>

                <Button
                  variant="gamified"
                  size="lg"
                  aria-label="Start learning for free on CrackCode"
                  onClick={() => window.open("https://app.crackcodehq.com", "_blank")}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-base rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" aria-hidden="true"/>
                  Start Learning Free
                </Button>
              </div>
            </div>

            {/* Connect Card */}
            <div className="bg-card/80 border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-5">Connect With Us</h3>

              <nav aria-label="CrackCode Social Media Links" className="space-y-3">
                <a
                  href="https://www.linkedin.com/company/crackcode"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CrackCode on LinkedIn (opens in new tab)"
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-all duration-300 group"
                >
                  <div className="p-2.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors" aria-hidden="true">
                    <Linkedin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">LinkedIn</div>
                    <div className="text-xs text-muted-foreground">@crackcode</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </a>

                <a
                  href="https://www.instagram.com/crackcodelk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CrackCode on Instagram @crackcodelk (opens in new tab)"
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-pink-500/10 border border-transparent hover:border-pink-500/30 transition-all duration-300 group"
                >
                  <div className="p-2.5 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors" aria-hidden="true">
                    <Instagram className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">Instagram</div>
                    <div className="text-xs text-muted-foreground">@crackcodelk</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-pink-500 transition-colors" />
                </a>

                <a
                  href="https://www.youtube.com/@CrackCodelk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CrackCode on YouTube @crackcodelk (opens in new tab)"
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-300 group"
                >
                  <div className="p-2.5 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors" aria-hidden="true">
                    <YoutubeIcon className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">YouTube</div>
                    <div className="text-xs text-muted-foreground">@crackcodelk</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                </a>

                {/* <a 
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
                </a> */}

                <a
                  href="mailto:info.crackcode@gmail.com"
                  aria-label="Send an email to CrackCode at info.crackcode@gmail.com"
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-orange-500/10 border border-transparent hover:border-orange-500/30 transition-all duration-300 group"
                >
                  <div className="p-2.5 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                    <Mail className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">Email Us</div>
                    <div className="text-xs text-muted-foreground">info.crackcode@gmail.com</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-orange-500 transition-colors" aria-hidden="true" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER - Clean without duplicate socials */}
      <footer className="mt-24 border-t border-border relative z-10" aria-label="Site footer">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Logo */}
            <a href="#home" aria-label="CrackCode — back to top" className="block group transition-transform hover:scale-105 cursor-pointer">
              <img
                src={logo}
                alt="CrackCode Logo"
                aria-label="CrackCode Logo"
                loading="lazy"
                decoding="async"
                className="h-10 w-auto object-contain"
              />
            </a>

            {/* Nav Links
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
            </div> */}

            {/* Copyright */}
            <div className="p-5 text-sm text-muted-foreground">
              <p>© 2025 CrackCode. All rights reserved.</p>
            </div>

            {/* Legal Links */}
            <nav aria-label="Legal links" className="flex items-center gap-10 text-sm font-medium">
              <a onClick={openPrivacyPolicy} className="text-muted-foreground hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a onClick={openTermsAndConditions} className="text-muted-foreground hover:text-orange-500 transition-colors">Terms & Conditions</a>
            </nav>
          </div>


        </div>
      </footer>

      <Modal
        isOpen={Boolean(modalData)}
        onClose={closeLegalModal}
        title={modalData?.title || ""}
      >
        {modalData?.content}
      </Modal>
    </section>
  )
}