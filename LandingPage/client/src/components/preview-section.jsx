import { useEffect, useRef, useState } from "react"
import { Button } from "./ui/button.jsx"
import DotBackground from "./ui/dot-background.jsx"
import { Terminal, Bot, Play, AlertTriangle, FileCode, ChevronDown, ChevronRight, Send } from "lucide-react"

export default function PreviewSection() {
  const sectionRef = useRef(null)
  const [isHintOpen, setIsHintOpen] = useState(false)

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
      className="relative py-32 bg-[#050505] overflow-hidden"
    >
      {/* Cyan/Blue Dots Animation */}
      <DotBackground color="#06b6d4" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 fade-in-section opacity-0 transition-all duration-1000 translate-y-10">
          {/* Header Tag */}
          <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-500 text-sm font-medium mb-6">
            Inside The Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Code Like a <span className="text-cyan-500">Detective</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance leading-relaxed">
            Solve mysteries with code. Our intelligent editor guides you through every clue.
          </p>
        </div>

        {/* The IDE Mockup */}
        <div className="max-w-7xl mx-auto fade-in-section opacity-0 transition-all duration-1000 translate-y-10 delay-200">
          <div className="rounded-xl border border-border bg-card/95 backdrop-blur shadow-2xl overflow-hidden ring-1 ring-cyan-500/20 grid lg:grid-cols-2 min-h-[600px] overflow-hidden">
            
            {/* LEFT PANEL: Problem Statement */}
            <div className="relative border-r border-border bg-slate-950/30 flex flex-col">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-1 rounded border border-yellow-500/20">CASE #089</span>
                  <span className="text-muted-foreground text-xs font-mono">DIFFICULTY: INTERMEDIATE</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">The Midnight Robbery</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  "Detective, a thief has stashed the stolen jewels in one of the abandoned row houses on Elm Street. We need you to search every house one by one until you find the loot. But be careful—don't search past the end of the street!"
                </p>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Your Objectives</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex gap-2">
                      <span className="text-cyan-500">1.</span> Define the row of houses.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-cyan-500">2.</span> Create a loop to search each house.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-cyan-500">3.</span> Stop searching before you run out of road (Fix the Loop Limit).
                    </li>
                  </ul>
                </div>

                {/* Collapsible Hints */}
                <div className="relative border border-border rounded-lg bg-slate-900/50">
                  <button 
                    onClick={() => setIsHintOpen(!isHintOpen)}
                    className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                      <Bot className="w-4 h-4 text-cyan-500" />
                      <span>Request a Clue</span>
                    </div>
                    {isHintOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  </button>
                  
                  {isHintOpen && (
                    <div className="absolute left-0 top-full w-full z-20 bg-cyan-950/95 backdrop-blur border-t border-border p-3 shadow-lg">
                      <p className="text-xs text-cyan-200/80 leading-relaxed p-2">
                        {/* GENERAL CLUE / HINT */}
                        Detective, remember that street addresses (array indices) always start at 0. To search every house without trespassing into the void, ensure your patrol stops <em>before</em> the counter equals the total number of houses.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Example */}
                <div className="border border-border rounded-lg bg-slate-900/50 overflow-hidden p-4">
                  Example: <br />
                  <div className="text-sm text-gray-400">
                    Input
                  </div>
                  <div className="text-sm bg-gray-500 w-auto p-2">
                    houses = ["Empty", "Empty", Loot, "Empty"]
                  </div>
                  <div className="text-sm text-gray-400">
                    Output
                  </div>
                  <div className="text-sm bg-gray-500 w-auto p-2">
                    Congratulations Detective! You have found the loot at the House #3. 
                  </div>
                  
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: Editor & AI/Error Console */}
            <div className="flex flex-col bg-slate-950/80 relative">
                
                {/* Floating AI Helper - Now with Continuous Float Animation */}
                <div className="absolute -top-14 right-6 z-20 animate-float">
                    <div className="bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-2xl rounded-br-none shadow-lg shadow-cyan-500/20 relative">
                        <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 animate-pulse" />
                            <span>Need a lead, Detective?</span>
                        </div>
                        {/* Little triangle tail */}
                        <div className="absolute -bottom-2 right-0 w-4 h-4 bg-cyan-500 [clip-path:polygon(100%_0,0_0,100%_100%)]"></div>
                    </div>
                </div>

                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-2 px-3 py-1 rounded bg-background/50 border border-border text-xs text-muted-foreground font-mono">
                        <FileCode className="w-3 h-3 text-cyan-500" />
                        robbery_investigation.js
                    </div>
                    <Button size="sm" className="h-7 bg-green-600 hover:bg-green-700 text-white text-xs gap-2">
                        <Play className="w-3 h-3" /> Execute
                    </Button>
                </div>

                {/* Code Editor */}
                <div className="flex-1 p-6 font-mono text-sm relative group overflow-hidden">
                    <div className="space-y-1 text-slate-300 leading-6">
                        <div className="flex gap-4"><span className="text-slate-600 select-none w-4 text-right">1</span> <span><span className="text-purple-400">const</span> <span className="text-blue-400">houses</span> = [<span className="text-green-400">"Empty"</span>, <span className="text-green-400">"Empty"</span>, <span className="text-green-400">"Loot"</span>];</span></div>
                        <div className="flex gap-4"><span className="text-slate-600 select-none w-4 text-right">2</span> <span></span></div>
                        <div className="flex gap-4"><span className="text-slate-600 select-none w-4 text-right">3</span> <span className="text-slate-500">// Search every house</span></div>
                        <div className="flex gap-4"><span className="text-slate-600 select-none w-4 text-right">4</span> <span><span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = <span className="text-orange-400">0</span>; i &lt;= <span className="text-orange-400">5</span>; i++) {"{"}</span></div>
                        <div className="flex gap-4"><span className="text-slate-600 select-none w-4 text-right">5</span> <span className="pl-4 flex items-center"><span className="text-yellow-300">inspect</span>(<span className="text-blue-400">houses</span>[i]);<div className="w-2 h-4 bg-cyan-500 animate-pulse ml-0.5 inline-block" /></span></div>
                        <div className="flex gap-4"><span className="text-slate-600 select-none w-4 text-right">6</span> <span>{"}"}</span></div>
                        <div className="flex gap-4"><span className="text-slate-600 select-none w-4 text-right">7</span> <span></span></div>
                    </div>
                </div>

                {/* Bottom Section: Narrative Error & Ask AI */}
                <div className="h-[280px] bg-slate-900 border-t border-border flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        <button className="px-4 py-2 text-xs font-semibold text-red-400 border-r border-border bg-red-500/5 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> Case Error Log
                        </button>
                        <button className="px-4 py-2 text-xs font-semibold text-cyan-400 border-r border-border bg-cyan-500/5 flex items-center gap-2">
                            <Bot className="w-3 h-3" /> AI Assistant
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
                        {/* Narrative Error */}
                        <div className="bg-red-950/20 border border-red-500/20 rounded p-3">
                            <h4 className="text-red-400 text-xs font-bold mb-1 uppercase tracking-wider">Search Warrant Invalid</h4>
                            <p className="text-slate-300 text-xs leading-relaxed font-mono">
                                "Detective! You wandered off the map. You tried to search <span className="text-red-400">House #5</span>, but the street only has 3 houses! You're knocking on thin air."
                            </p>
                             <div className="mt-2 text-[10px] text-red-500/50 font-mono uppercase">
                                ERROR: Index Out of Bounds
                            </div>
                        </div>

                        {/* Ask AI Chat Interface */}
                        <div className="space-y-3 pt-2">
                             <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                                    <Bot className="w-3 h-3 text-cyan-400" />
                                </div>
                                <div className="bg-slate-800 rounded-lg rounded-tl-none p-2 text-xs text-slate-300">
                                    It looks like your loop went too far. Want to check the array length property?
                                </div>
                             </div>
                             
                             {/* Chat Input - Fixed Alignment */}
                             <div className="relative mt-2">
                                <input 
                                    type="text" 
                                    placeholder="Ask AI for help..." 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 pl-3 pr-10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-500 transition-colors flex items-center justify-center">
                                    <Send className="w-3 h-3" />
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
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