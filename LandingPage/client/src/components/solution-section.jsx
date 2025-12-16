

import { useEffect, useRef } from "react"
import { Card } from "./ui/card.jsx"
import DotBackground from "./ui/dot-background.jsx"
import { BookText, Trophy, ShoppingBag, MapPin, Sparkles, Target } from "lucide-react"

export default function SolutionSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll(".fade-in-section")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: BookText,
      title: "Narrative-Driven Learning",
      description: "Learn Python, JavaScript, and more through compelling detective stories where you solve cases using code.",
      color: "from-emerald-500/20 to-emerald-500/5",
    },
    {
      icon: Target,
      title: "Story-Based Challenges",
      description: "Each coding concept is embedded in engaging narratives - use for loops to search houses, arrays to track clues.",
      color: "from-green-500/20 to-green-500/5",
    },
    {
      icon: Trophy,
      title: "Competitive Leaderboards",
      description: "Compete with peers globally, earn ranks, and showcase your problem-solving skills on dynamic leaderboards.",
      color: "from-emerald-400/20 to-emerald-400/5", 
    },
    {
      icon: ShoppingBag,
      title: "Rewards & Customization",
      description: "Earn tokens to unlock themes, avatars, and exclusive content. Use real currency for premium features.",
      color: "from-green-400/20 to-green-400/5",
    },
    {
      icon: MapPin,
      title: "Career Path Maps",
      description: "Choose your journey: Frontend, Backend, Full-Stack. Get personalized roadmaps and skill assessments.",
      color: "from-emerald-600/20 to-emerald-600/5",
    },
    {
      icon: Sparkles,
      title: "Professional UI/UX",
      description: "Designed for students and university learners with clean, modern interfaces that keep you focused.",
      color: "from-green-600/20 to-green-600/5",
    },
  ]

  return (
    <section 
      id="solution" 
      ref={sectionRef} 
      className="relative py-32 bg-[#050505] overflow-hidden"
    >
      {/* Green Dots Animation */}
      <DotBackground color="#10b981" /> 

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 fade-in-section opacity-0 transition-all duration-1000 translate-y-10">
          <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-sm font-medium mb-6">
            Our Solution
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Learning That Feels Like <span className="text-emerald-500">Playing</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance leading-relaxed">
            CrackCode transforms coding education into an addictive, story-driven adventure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="fade-in-section opacity-0 transition-all duration-1000 translate-y-10"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="group relative p-8 h-full bg-card border-border hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 overflow-hidden cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="mb-6 inline-block p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-card-foreground group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  )
}