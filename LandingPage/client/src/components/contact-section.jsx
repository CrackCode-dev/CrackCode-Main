



// import React, { useState } from "react"
// import { Button } from "./ui/button.jsx"
// import { Input } from "./ui/input.jsx"
// import { Textarea } from "./ui/textarea.jsx"
// import DotBackground from "./ui/dot-background.jsx"
// import { Mail, Send, Linkedin, Instagram, Loader2 } from "lucide-react"
// import logo from "../assets/CrackCode-Logo.png"

// export default function ContactSection() {
//   const [formData, setFormData] = useState({
//     email: "",
//     message: "",
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [status, setStatus] = useState(null) // null | 'success' | 'error'

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setStatus(null)

//     try {
//       const response = await fetch('http://localhost:3001/api/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       })

//       const data = await response.json()

//       if (data.success) {
//         setStatus('success')
//         setFormData({ email: "", message: "" })
//         // Reset success message after 3 seconds
//         setTimeout(() => setStatus(null), 3000)
//       } else {
//         setStatus('error')
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error)
//       setStatus('error')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <section id="contact" className="relative py-32 bg-[#050505] overflow-hidden">
//       {/* Orange Dots Animation */}
//       <DotBackground color="#f97316" />

//       <div className="container mx-auto px-4 relative z-10">
//         <div className="max-w-2xl mx-auto">
//           <div className="text-center mb-12">
//             <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-sm font-medium mb-6">
//               Get In Touch
//             </div>
//             <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
//               Let&apos;s Start Your <span className="text-orange-500">Journey</span>
//             </h2>
//             <p className="text-xl text-muted-foreground text-balance leading-relaxed">
//               Have questions? Want to learn more? Send us a message!
//             </p>
//           </div>

//           <div className="bg-card border border-border rounded-2xl p-8 shadow-xl relative overflow-hidden">
            
//             {/* Success Overlay */}
//             {status === 'success' && (
//               <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in zoom-in duration-300">
//                 <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
//                   <Send className="h-8 w-8 text-green-500" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
//                 <p className="text-muted-foreground mt-2">We'll get back to you soon.</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium mb-2 text-card-foreground">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="your.email@example.com"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className="pl-10 bg-background border-border focus-visible:ring-orange-500"
//                     required
//                     disabled={isSubmitting}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label htmlFor="message" className="block text-sm font-medium mb-2 text-card-foreground">
//                   Message
//                 </label>
//                 <Textarea
//                   id="message"
//                   placeholder="Tell us about your interest in CrackCode..."
//                   value={formData.message}
//                   onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//                   className="min-h-32 bg-background border-border resize-none focus-visible:ring-orange-500"
//                   required
//                   disabled={isSubmitting}
//                 />
//               </div>
              
//               {status === 'error' && (
//                 <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
//               )}

//               <Button
//                 type="submit"
//                 size="lg"
//                 className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                     Sending...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="mr-2 h-5 w-5" />
//                     Send Message
//                   </>
//                 )}
//               </Button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <footer className="mt-24 border-t border-border relative z-10 bg-[#050505]/50 backdrop-blur-sm">
//         <div className="container mx-auto px-4 py-12">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
//             {/* 1. Logo - Click to scroll to top */}
//             <a href="#home" className="block group transition-transform hover:scale-105 cursor-pointer">
//                <img 
//                  src={logo} 
//                  alt="CrackCode Logo" 
//                  className="h-12 w-auto object-contain" 
//                />
//             </a>

//             {/* 2. Copyright Text */}
//             <p className="text-sm text-muted-foreground text-center md:text-left">
//               © 2025 CrackCode. All rights reserved. Built for learners.
//             </p>

//             {/* 3. Social Media & Legal Links */}
//             <div className="flex flex-col md:flex-row items-center gap-6">
//                {/* Social Icons with sample links */}
//                <div className="flex gap-4">
//                   <a 
//                     href="https://www.linkedin.com/" 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     className="text-muted-foreground hover:text-orange-500 transition-colors p-2 hover:bg-orange-500/10 rounded-full"
//                     aria-label="LinkedIn"
//                   >
//                     <Linkedin className="h-5 w-5" />
//                   </a>
//                   <a 
//                     href="https://www.instagram.com/" 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     className="text-muted-foreground hover:text-orange-500 transition-colors p-2 hover:bg-orange-500/10 rounded-full"
//                     aria-label="Instagram"
//                   >
//                     <Instagram className="h-5 w-5" />
//                   </a>
//                </div>

//                {/* Divider (visible on desktop) */}
//                <div className="hidden md:block h-5 w-px bg-border"></div>

//                {/* Legal Links */}
//               <div className="flex gap-6">
//                 <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors text-sm">Privacy</a>
//                 <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors text-sm">Terms</a>
//                 <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors text-sm">Support</a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </section>
//   )
// }
