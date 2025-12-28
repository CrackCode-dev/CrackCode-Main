import { useEffect, useRef, useState } from "react"
import DotBackground from "./ui/dot-background.jsx"
import { Star, Quote, ChevronLeft, ChevronRight, GraduationCap, Briefcase, Code2 } from "lucide-react"

export default function TestimonialsSection() {
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

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

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      university: "University of Colombo",
      avatar: "SC",
      rating: 5,
      text: "CrackCode completely changed how I approach coding. The detective stories made learning loops and arrays actually fun! I went from struggling with basic syntax to building my own projects in just 3 months.",
      highlight: "from struggling to building projects"
    },
    {
      name: "Amal Fernando",
      role: "Self-taught Developer",
      university: "Now at WSO2",
      avatar: "AF",
      rating: 5,
      text: "As someone who tried and failed multiple online courses, CrackCode's narrative approach finally made programming click. The AI tutor helped me when I was stuck without giving away answers.",
      highlight: "finally made programming click"
    },
    {
      name: "Priya Sharma",
      role: "IT Graduate",
      university: "SLIIT",
      avatar: "PS",
      rating: 5,
      text: "The career path feature helped me realize I wanted to focus on backend development. The structured roadmap and real coding challenges prepared me for technical interviews better than any textbook.",
      highlight: "prepared me for technical interviews"
    },
    {
      name: "Kevin Perera",
      role: "High School Student",
      university: "Royal College",
      avatar: "KP",
      rating: 5,
      text: "I started learning Python through CrackCode when I was 16. The gamification kept me motivated, and now I've already completed 50+ detective cases. My friends can't believe I'm coding!",
      highlight: "completed 50+ detective cases"
    }
  ]

  const stats = [
    { value: "2,500+", label: "Active Learners", icon: GraduationCap },
    { value: "150+", label: "Coding Challenges", icon: Code2 },
    { value: "92%", label: "Completion Rate", icon: Briefcase },
    { value: "4.9/5", label: "Average Rating", icon: Star }
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section 
      id="testimonials" 
      ref={sectionRef} 
      className="relative py-24 md:py-32 bg-[#050505] overflow-hidden"
    >
      <DotBackground color="#f59e0b" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Stats Row */}
        <div className="max-w-5xl mx-auto mb-20 fade-in-section opacity-0 transition-all duration-1000 translate-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="relative p-6 bg-card/50 border border-border rounded-2xl text-center group hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative z-10">
                  <stat.icon className="w-6 h-6 text-amber-500 mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 fade-in-section opacity-0 transition-all duration-1000 translate-y-10" style={{ transitionDelay: '100ms' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-500 text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-amber-500" />
            <span>Student Stories</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Loved by <span className="text-amber-500">Learners</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed max-w-2xl mx-auto">
            Join thousands of students who transformed their coding journey with CrackCode's story-driven approach.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto fade-in-section opacity-0 transition-all duration-1000 translate-y-10" style={{ transitionDelay: '200ms' }}>
          <div className="relative">
            {/* Main Testimonial Card */}
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 relative overflow-hidden">
              {/* Quote Icon */}
              <Quote className="absolute top-8 right-8 w-16 h-16 text-amber-500/10" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-8">
                  "{testimonials[activeIndex].text}"
                </blockquote>

                {/* Highlighted part */}
                <div className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-8">
                  ✨ {testimonials[activeIndex].highlight}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[activeIndex].avatar}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-foreground">{testimonials[activeIndex].name}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[activeIndex].role}</div>
                    <div className="text-xs text-amber-500">{testimonials[activeIndex].university}</div>
                  </div>
                </div>
              </div>

              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 pointer-events-none" />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button 
                onClick={prevTestimonial}
                className="p-3 rounded-full border border-border hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              
              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? 'bg-amber-500 w-8' 
                        : 'bg-border hover:bg-amber-500/50'
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={nextTestimonial}
                className="p-3 rounded-full border border-border hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="max-w-3xl mx-auto mt-16 text-center fade-in-section opacity-0 transition-all duration-1000 translate-y-10" style={{ transitionDelay: '300ms' }}>
          <p className="text-sm text-muted-foreground mb-6">Trusted by students from</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {['University of Colombo', 'SLIIT', 'University of Moratuwa', 'NSBM', 'IIT'].map((uni) => (
              <span key={uni} className="text-sm text-muted-foreground font-medium">{uni}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  )
}