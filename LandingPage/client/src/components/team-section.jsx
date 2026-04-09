import { useEffect, useRef, useState } from "react"
import DotBackground from "./ui/dot-background.jsx"
import { Contrast, Github, Linkedin, Mail, Wrench } from "lucide-react"
import Nadeesha from "../assets/team/nadeesha.jpg"
import Vidun from "../assets/team/vidun.jpg"
import Chris from "../assets/team/chris.jpg"
import Sasni from "../assets/team/sasni.jpg"
import Shenori from "../assets/team/shenori.jpg"
import Ama from "../assets/team/ama.jpg"

export default function TeamSection() {
  const sectionRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)

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
      photo: Vidun,
      role: "Full Stack / ML Developer",
      links: {
        linkedin: "https://www.linkedin.com/in/vidun-shanuka-17276a2b4?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BolnK6%2B8OTGG217DIktPDPA%3D%3D",
        github: "https://github.com/vidun-upek",
        email: "vidun.sh@gmail.com"
      }
    },
    { 
      name: "Nadeesha Hasaranga",
      photo: Nadeesha,
      role: "Full Stack / ML Developer",
      links: {
        linkedin: "https://www.linkedin.com/in/nadeesha-hasaranga?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BuDwB4cgVTy2aEErb7Y5cVw%3D%3D",
        github: "https://github.com/hasaRanger",
        email: "nadeesha.hcs@gmail.com"
      }
    },
    { 
      name: "Chris Corteling",
      photo: Chris,
      role: "Backend / ML Developer",
      links: {
        linkedin: "https://www.linkedin.com/in/chris-corteling?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BxF6osBxAQWCmIpFX%2FNPjLw%3D%3D",
        github: "https://github.com/chriscorteling",
        email: "crcorteling@gmail.com"
      }
    },
    { 
      name: "Sasni Lasadi",
      photo: Sasni,
      role: "Backend Developer",
      links: {
        linkedin: "https://www.linkedin.com/in/sasni-lasadi-6bb1ab32a?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BoVwV4%2Bh1R6qFYOfUi5TJsQ%3D%3D",
        github: "https://github.com/SasniLasadi",
        email: "sasnilasadi410@gmail.com"
      }
    },
    { 
      name: "Shenori Perera",
      photo: Shenori,
      role: "Backend Developer",
      links: {
        linkedin: "https://www.linkedin.com/in/shenori-perera-b24476292?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BTHvTcIRxR1eH5YcMj%2FYQtg%3D%3D",
        github: "https://github.com/shenori",
        email: "shenoriperera87@gmail.com"
      }
    },
    { 
      name: "Ama Dombawela",
      photo: Ama,
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 border border-silver-500/30 rounded-full text-silver-500 text-sm font-medium mb-6">
            <Wrench className="w-4 h-4" />
            <span>Behind the Code</span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-balance tracking-tight">THE BUILDERS</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the passionate team building the future of coding education.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-3">
          {team.map((member, index) => {
            const isLeft = index % 2 === 0
            const isActive = hoveredIndex === index

            return (
              <div
                key={index}
                className={`fade-in-section opacity-0 transition-all duration-1000 ${
                  isLeft ? "translate-x-[-100px]" : "translate-x-[100px]"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`relative border-b z-10 h-full flex flex-col justify-center transition-all duration-500 ease-in-out ${
                    isActive
                      ? "bg-white/[0.03] border-purple-500/40"
                      : "bg-transparent border-purple-500/20"
                  }`}
                  style={{
                    height: isActive ? "160px" : "100px",
                    transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, border-color 0.3s ease",
                  }}
                >

                  {/* Photo — slides in from same side as name */}
                  <div
                    className={`absolute top-0 bottom-0 overflow-hidden transition-all duration-500 ease-in-out ${
                      isLeft ? "left-0" : "right-0"
                    }`}
                    style={{ width: isActive ? "120px" : "0px" }}
                  >
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                      style={{filter: "imageRendering: crisp-edges"}}
                    />
                    {/* Fade edge blending into background */}
                    <div
                      className={`absolute inset-y-0 w-10 ${
                        isLeft
                          ? "right-0 bg-gradient-to-r from-transparent to-[#050505]"
                          : "left-0 bg-gradient-to-l from-transparent to-[#050505]"
                      }`}
                    />
                  </div>

                  {/* Content — shifts away from photo on hover */}
                  <div
                    className={`absolute inset-0 z-10 flex flex-col justify-center transition-all duration-500 ease-in-out ${
                      isLeft
                        ? isActive
                          ? "pl-[136px] pr-8 items-start"
                          : "pl-8 pr-[20%] md:pr-[30%] items-start"
                        : isActive
                          ? "pr-[136px] pl-8 items-end"
                          : "pr-8 pl-[20%] md:pl-[30%] items-end"
                    }`}
                  >
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-0 text-foreground tracking-tight group-hover:text-purple-400 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-muted-foreground font-mono text-xs sm:text-sm md:text-base tracking-wider uppercase mb-1 group-hover:text-white transition-all duration-300">
                      {member.role}
                    </p>

                    {/* Social Links — fade in on hover */}
                    <div
                      className={`flex gap-3 mt-2 transition-all duration-500 ${
                        isLeft ? "justify-start" : "justify-end"
                      } ${
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2 pointer-events-none"
                      }`}
                    >
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
            )
          })}
        </div>

        <div className="flex flex-col items-center justify-center pt-10">
          <p className="text-muted-foreground mb-6">Want to know more about the platform?</p>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 text-silver-400 hover:text-gray-300 transition-colors font-medium"
          >
            Reach Out to Us
            <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
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