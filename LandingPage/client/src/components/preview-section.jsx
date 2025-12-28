import { useEffect, useRef, useState } from "react"
import { Button } from "./ui/button.jsx"
import DotBackground from "./ui/dot-background.jsx"
import { Terminal, Bot, Play, AlertTriangle, FileCode, ChevronDown, ChevronRight, Send, CheckCircle2, XCircle, Lightbulb, Code2 } from "lucide-react"

export default function PreviewSection() {
  const sectionRef = useRef(null)
  const [isHintOpen, setIsHintOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('error')
  const [codeOutput, setCodeOutput] = useState(null)

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

  return (
    <section 
      id="preview" 
      ref={sectionRef} 
      className="relative py-24 md:py-32 bg-[#050505] overflow-hidden"
    >
      <DotBackground color="#06b6d4" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 fade-in-section opacity-0 transition-all duration-1000 translate-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-500 text-sm font-medium mb-6">
            <Code2 className="w-4 h-4" />
            <span>Inside The Platform</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Code Like a <span className="text-cyan-500">Detective</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed max-w-2xl mx-auto">
            Solve mysteries with code. Our intelligent editor guides you through every clue with AI-powered hints and narrative error messages.
          </p>
        </div>

        {/* The IDE Mockup */}
        <div className="max-w-7xl mx-auto fade-in-section opacity-0 transition-all duration-1000 translate-y-10 delay-200">
          <div className="rounded-2xl border border-border bg-card/95 backdrop-blur shadow-2xl overflow-hidden ring-1 ring-cyan-500/20">
            
            {/* IDE Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">CrackCode IDE v2.0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded border border-cyan-500/20">Case #089</span>
                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded border border-yellow-500/20">Intermediate</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 min-h-[650px]">
              
              {/* LEFT PANEL: Problem Statement */}
              <div className="relative border-r border-border bg-slate-950/30 flex flex-col">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">The Midnight Robbery</h3>
                      <p className="text-xs text-muted-foreground">Chapter 3 of "The Array Detective"</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    "Detective, a thief has stashed the stolen jewels in one of the abandoned row houses on Elm Street. We need you to search every house one by one until you find the loot. But be careful—don't search past the end of the street!"
                  </p>
                </div>
                
                <div className="p-6 flex-1 space-y-6 overflow-y-auto">
                  {/* Objectives */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Your Objectives
                    </h4>
                    <ul className="space-y-3">
                      {[
                        { done: true, text: "Define the row of houses (array)" },
                        { done: true, text: "Create a loop to search each house" },
                        { done: false, text: "Fix the loop limit to prevent errors" }
                      ].map((obj, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          {obj.done ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                          )}
                          <span className={obj.done ? "text-slate-400 line-through" : "text-slate-300"}>
                            {obj.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills Learned */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Skills You'll Learn</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Arrays', 'For Loops', 'Index Bounds', 'Iteration'].map((skill) => (
                        <span key={skill} className="px-2.5 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Collapsible Hints */}
                  <div className="relative border border-border rounded-xl bg-slate-900/50 overflow-hidden">
                    <button 
                      onClick={() => setIsHintOpen(!isHintOpen)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                        <Bot className="w-5 h-5 text-cyan-500" />
                        <span>Request a Clue from AI</span>
                      </div>
                      {isHintOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${isHintOpen ? 'max-h-40' : 'max-h-0'}`}>
                      <div className="p-4 pt-0 border-t border-border bg-cyan-950/30">
                        <p className="text-sm text-cyan-200/80 leading-relaxed">
                          🔍 Detective, remember that street addresses (array indices) always start at 0. To search every house without trespassing into the void, ensure your patrol stops <em className="text-cyan-300">before</em> the counter equals the total number of houses.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Example */}
                  <div className="border border-border rounded-xl bg-slate-900/50 overflow-hidden">
                    <div className="p-3 border-b border-border bg-slate-800/30">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Expected Output</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-xs text-slate-500">Input:</span>
                        <code className="block mt-1 p-2 bg-slate-800/50 rounded text-xs text-emerald-400 font-mono">
                          houses = ["Empty", "Empty", "Loot", "Empty"]
                        </code>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Output:</span>
                        <code className="block mt-1 p-2 bg-slate-800/50 rounded text-xs text-emerald-400 font-mono">
                          🎉 Detective! Loot found at House #3!
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: Editor & Console */}
              <div className="flex flex-col bg-slate-950/80 relative">
                  
                {/* Floating AI Helper */}
                <div className="absolute -top-12 right-6 z-20 animate-float hidden lg:block">
                  <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl rounded-br-none shadow-lg shadow-cyan-500/30 relative">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <span>Need a lead, Detective?</span>
                    </div>
                    <div className="absolute -bottom-2 right-0 w-4 h-4 bg-cyan-600 [clip-path:polygon(100%_0,0_0,100%_100%)]"></div>
                  </div>
                </div>

                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-border text-xs text-muted-foreground font-mono">
                      <FileCode className="w-3.5 h-3.5 text-cyan-500" />
                      robbery_investigation.js
                    </div>
                    <span className="text-xs text-muted-foreground">Line 5, Col 28</span>
                  </div>
                  <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-2 px-4">
                    <Play className="w-3.5 h-3.5" /> Run Code
                  </Button>
                </div>

                {/* Code Editor */}
                <div className="flex-1 p-6 font-mono text-sm relative group overflow-hidden">
                  <div className="space-y-1 text-slate-300 leading-7">
                    <div className="flex gap-4 hover:bg-slate-800/30 px-2 -mx-2 rounded transition-colors">
                      <span className="text-slate-600 select-none w-6 text-right">1</span>
                      <span><span className="text-purple-400">const</span> <span className="text-blue-400">houses</span> = [<span className="text-emerald-400">"Empty"</span>, <span className="text-emerald-400">"Empty"</span>, <span className="text-emerald-400">"Loot"</span>];</span>
                    </div>
                    <div className="flex gap-4 hover:bg-slate-800/30 px-2 -mx-2 rounded transition-colors">
                      <span className="text-slate-600 select-none w-6 text-right">2</span>
                      <span></span>
                    </div>
                    <div className="flex gap-4 hover:bg-slate-800/30 px-2 -mx-2 rounded transition-colors">
                      <span className="text-slate-600 select-none w-6 text-right">3</span>
                      <span className="text-slate-500">// Search every house on Elm Street</span>
                    </div>
                    <div className="flex gap-4 bg-red-500/10 px-2 -mx-2 rounded border-l-2 border-red-500">
                      <span className="text-slate-600 select-none w-6 text-right">4</span>
                      <span><span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = <span className="text-orange-400">0</span>; i &lt;= <span className="text-orange-400 bg-red-500/30 px-1 rounded">5</span>; i++) {"{"}</span>
                    </div>
                    <div className="flex gap-4 hover:bg-slate-800/30 px-2 -mx-2 rounded transition-colors">
                      <span className="text-slate-600 select-none w-6 text-right">5</span>
                      <span className="pl-6 flex items-center"><span className="text-yellow-300">inspect</span>(<span className="text-blue-400">houses</span>[i]);<div className="w-0.5 h-5 bg-cyan-500 animate-pulse ml-0.5 inline-block" /></span>
                    </div>
                    <div className="flex gap-4 hover:bg-slate-800/30 px-2 -mx-2 rounded transition-colors">
                      <span className="text-slate-600 select-none w-6 text-right">6</span>
                      <span>{"}"}</span>
                    </div>
                    <div className="flex gap-4 hover:bg-slate-800/30 px-2 -mx-2 rounded transition-colors">
                      <span className="text-slate-600 select-none w-6 text-right">7</span>
                      <span></span>
                    </div>
                  </div>

                  {/* Error Indicator */}
                  <div className="absolute right-6 top-[108px] flex items-center gap-2">
                    <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">Error on line 4</span>
                  </div>
                </div>

                {/* Bottom Console Section */}
                <div className="h-[260px] bg-slate-900 border-t border-border flex flex-col">
                  {/* Tabs */}
                  <div className="flex border-b border-border">
                    <button 
                      onClick={() => setActiveTab('error')}
                      className={`px-4 py-2.5 text-xs font-semibold border-r border-border flex items-center gap-2 transition-colors ${
                        activeTab === 'error' ? 'text-red-400 bg-red-500/10' : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Case Error Log
                    </button>
                    <button 
                      onClick={() => setActiveTab('ai')}
                      className={`px-4 py-2.5 text-xs font-semibold border-r border-border flex items-center gap-2 transition-colors ${
                        activeTab === 'ai' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5" /> AI Detective
                    </button>
                    <button 
                      onClick={() => setActiveTab('output')}
                      className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-colors ${
                        activeTab === 'output' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5" /> Output
                    </button>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto">
                    {activeTab === 'error' && (
                      <div className="bg-red-950/30 border border-red-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-red-400 text-sm font-bold mb-2">🚨 Search Warrant Invalid</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                              "Detective! You wandered off the map. You tried to search <span className="text-red-400 font-mono">House #5</span>, but the street only has 3 houses! You're knocking on thin air."
                            </p>
                            <div className="mt-3 pt-3 border-t border-red-500/20">
                              <code className="text-xs text-red-400/70 font-mono">
                                TypeError: Cannot read property of undefined (houses[5])
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'ai' && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div className="bg-slate-800/80 rounded-xl rounded-tl-none p-3 text-sm text-slate-300 max-w-[85%]">
                            It looks like your loop went too far, Detective. The <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">houses</code> array has only 3 elements, but you're trying to access index 5. Try using <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">houses.length</code> to set your loop boundary.
                          </div>
                        </div>
                        
                        <div className="relative mt-4">
                          <input 
                            type="text" 
                            placeholder="Ask AI for help..." 
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                          />
                          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-all">
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'output' && (
                      <div className="font-mono text-sm text-slate-400">
                        <div className="text-slate-600">$ Running robbery_investigation.js...</div>
                        <div className="mt-2 text-slate-300">Searching House #0... Empty</div>
                        <div className="text-slate-300">Searching House #1... Empty</div>
                        <div className="text-emerald-400">Searching House #2... 🎉 LOOT FOUND!</div>
                        <div className="text-red-400 mt-2">❌ Error: Index out of bounds at House #3</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature highlights below IDE */}
        <div className="max-w-5xl mx-auto mt-16 grid md:grid-cols-3 gap-6 fade-in-section opacity-0 transition-all duration-1000 translate-y-10" style={{ transitionDelay: '400ms' }}>
          {[
            { icon: Bot, title: "AI-Powered Hints", desc: "Get contextual help without spoiling solutions" },
            { icon: AlertTriangle, title: "Narrative Errors", desc: "Error messages that tell a story, not just codes" },
            { icon: CheckCircle2, title: "Progress Tracking", desc: "See your objectives and celebrate wins" }
          ].map((feature, i) => (
            <div key={i} className="text-center p-6">
              <div className="inline-flex p-3 bg-cyan-500/10 rounded-xl mb-4">
                <feature.icon className="w-6 h-6 text-cyan-500" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

function Target(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  )
}