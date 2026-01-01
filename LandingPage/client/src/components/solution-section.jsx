import { useEffect, useRef } from "react"
import { Card } from "./ui/card.jsx"
import DotBackground from "./ui/dot-background.jsx"
import { BookText, Trophy, ShoppingBag, MapPin, Sparkles, Target, Bot, Code2 } from "lucide-react"

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
      description: "Learn Python, JavaScript, Java and more through compelling detective stories where every line of code uncovers a new clue.",
    },
    {
      icon: Target,
      title: "Story-Based Challenges",
      description: "Each coding concept is embedded in engaging narratives—use for loops to search houses, arrays to track evidence, and functions to solve mysteries.",
    },
    {
      icon: Bot,
      title: "AI Error Diagnosis",
      description: "Get personalized error explanations in detective narrative style. Our AI analyzes your code and guides you to solutions without spoiling the mystery.",
    },
    {
      icon: Trophy,
      title: "XP & Leaderboards",
      description: "Earn XP for completing challenges, climb the global leaderboard, and compete with peers to become the top detective coder.",
    },
    {
      icon: ShoppingBag,
      title: "Shop & Customization",
      description: "Spend earned tokens on avatars, UI color themes, and exclusive content. Personalize your detective office and coding environment.",
    },
    {
      icon: MapPin,
      title: "Career Path Maps",
      description: "Explore different paths with quizzes and brownfield questions. Get guidance on Frontend, Backend, Full-Stack, or ML development careers.",
    },
  ]

  const languages = [
    'C++', 'Python', 'Java', 'JavaScript', 'PHP', 'HTML', 'CSS', 'React', 'and more...'
  ]

  return (
    <section 
      id="solution" 
      ref={sectionRef} 
      className="relative py-24 md:py-32 bg-[#050505] overflow-hidden"
    >
      <DotBackground color="#10b981" /> 

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 fade-in-section opacity-0 transition-all duration-1000 translate-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-500 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Our Solution</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Learning That Feels Like <span className="text-emerald-500">Playing</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed max-w-2xl mx-auto">
            CrackCode transforms coding education into an addictive, story-driven adventure where you're the detective and code is your weapon.
          </p>
        </div>

        {/* Feature Grid - 3x2 organized layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="fade-in-section opacity-0 transition-all duration-700 translate-y-10"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <Card className="group relative h-full p-6 md:p-8 bg-card border-border hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-5 inline-flex p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-emerald-500" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-card-foreground group-hover:text-emerald-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>

                {/* Hover shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Languages Section */}
        <div className="mt-20 fade-in-section opacity-0 transition-all duration-1000 translate-y-10" style={{ transitionDelay: '500ms' }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground mb-8 text-sm uppercase tracking-widest">Languages & Technologies You'll Master</p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {languages.map((lang, i) => (
                <div 
                  key={lang}
                  className={`px-5 py-2.5 bg-card border border-border rounded-full text-sm font-medium transition-all duration-300 cursor-default ${
                    lang === 'and more...' 
                      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' 
                      : 'text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/50'
                  }`}
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Ambient glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />

      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) !important;
        }
      `}</style>
    </section>
  )
}