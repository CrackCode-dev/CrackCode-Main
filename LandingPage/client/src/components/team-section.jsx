import { useEffect, useRef } from "react"
import DotBackground from "./ui/dot-background.jsx"
import { Github, Linkedin, Mail } from "lucide-react"

export default function TeamSection() {
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

  const team = [
    { 
      name: "Vidun Shanuka", 
      role: "Full Stack / ML Developer",
      links: {
        linkedin: "https://www.linkedin.com/in/vidun-shanuka-17276a2b4?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BolnK6%2B8OTGG217DIktPDPA%3D%3D",
        github: "https://github.com/vidun-upek",
        email: "vidun.sh@gmail.com"
      }
    },
    { 
      name: "Nadeesha Hasaranga", 
      role: "Full Stack / ML Developer",
      links: {
        linkedin: "https://www.linkedin.com/in/nadeesha-hasaranga?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BuDwB4cgVTy2aEErb7Y5cVw%3D%3D",
        github: "https://github.com/hasaRanger",
        email: "nadeesha.hcs@gmail.com"
      }
    },
    { 
      name: "Chris Corteling", 
      role: "Backend / ML Developer",
      links: {
        linkedin: "https://www.linkedin.com/in/chris-corteling?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BxF6osBxAQWCmIpFX%2FNPjLw%3D%3D",
        github: "https://github.com/chriscorteling",
        email: "crcorteling@gmail.com"
      }
    },
    { 
      name: "Sasni Lasadi", 
      role: "Backend Developer",
      links: {
        linkedin: "https://www.linkedin.com/in/sasni-lasadi-6bb1ab32a?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BoVwV4%2Bh1R6qFYOfUi5TJsQ%3D%3D",
        github: "https://github.com/SasniLasadi",
        email: "sasnilasadi410@gmail.com"
      }
    },
    { 
      name: "Shenori Perera", 
      role: "Backend Developer",
      links: {
        linkedin: "https://www.linkedin.com/in/shenori-perera-b24476292?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BTHvTcIRxR1eH5YcMj%2FYQtg%3D%3D",
        github: "https://github.com/shenori",
        email: "shenoriperera87@gmail.com"
      }
    },
    { 
      name: "Ama Dombawela", 
      role: "Frontend Developer",
      links: {
        linkedin: "https://www.linkedin.com/in/amadombawela?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BBx6HhO0xQM6wOtPHO%2Brx2g%3D%3D",
        github: "https://github.com/Ama-Dombawela",
        email: "amadombawela@gmail.com"
      }
    },
  ]

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#050505] overflow-hidden"
    >
      {/* Purple Dots */}
      <DotBackground color="#a855f7" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-20 fade-in-section opacity-0 transition-all duration-1000 translate-y-10">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-balance tracking-tight">THE BUILDERS</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the passionate team building the future of coding education.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-1">
          {team.map((member, index) => (
            <div
              key={index}
              className={`fade-in-section opacity-0 transition-all duration-1000 ${
                index % 2 === 0 ? "translate-x-[-100px]" : "translate-x-[100px]"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`group relative py-8 border-b border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 ${
                  index % 2 === 0 ? "text-left pl-0 pr-[20%] md:pr-[30%]" : "text-right pr-0 pl-[20%] md:pl-[30%]"
                }`}
              >
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-foreground tracking-tight group-hover:text-purple-400 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground font-mono text-xs sm:text-sm md:text-base tracking-wider uppercase mb-4 group-hover:text-white transition-all duration-300">
                    {member.role}
                  </p>
                  
                  {/* Social Links */}
                  <div className={`flex pl-5 gap-10 ${index % 2 === 0 ? 'justify-start' : 'pr-5 justify-end'}`}>
                    <a 
                      href={member.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a 
                      href={member.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-slate-300 hover:bg-slate-500/10 transition-all duration-300"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a 
                      href={`mailto:${member.links.email}`}
                      className="p-2 rounded-lg text-muted-foreground hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-300"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[200px] pointer-events-none" />

      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>
    </section>
  )
}