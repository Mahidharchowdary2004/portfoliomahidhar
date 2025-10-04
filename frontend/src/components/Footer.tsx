import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { fetchContactInfo } from "@/lib/api"

const Footer = () => {
  const { data: contactInfo } = useQuery({
    queryKey: ["contactInfo"],
    queryFn: fetchContactInfo,
    initialData: { github: "", linkedin: "", email: "" },
  })

  const quickLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#certifications", label: "Certifications" },
    { href: "#achievements", label: "Achievements" },
    { href: "#services", label: "Services" },
    { href: "#projects", label: "Projects" },
    { href: "/admin", label: "Manage" },
  ]

  return (
    <footer className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
      </div>

      <div className="relative container mx-auto px-6 py-20 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Brand Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-5">
              <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-balance text-white">
                Mahidhar
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
            </div>
            <p className="text-white/70 leading-relaxed text-lg max-w-md text-pretty">
              Computer Science student passionate about data science, AI, and building innovative solutions that shape
              the future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-8">
              Navigation
            </h3>
            <nav className="grid grid-cols-2 gap-x-8 gap-y-4">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-1 text-white/70 hover:text-white transition-all duration-300 ease-out"
                >
                  <span className="text-sm font-medium">{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                </a>
              ))}
            </nav>
          </div>

          {/* Connect Section */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-8">Connect</h3>
            <div className="flex gap-4">
              <a
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 rounded-full border-2 border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 ease-out hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-all duration-300" />
              </a>
              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 rounded-full border-2 border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 ease-out hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-all duration-300" />
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="group relative w-14 h-14 rounded-full border-2 border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 ease-out hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-all duration-300" />
              </a>
            </div>
            <div className="pt-6 space-y-2">
              <p className="text-xs text-white/40 uppercase tracking-wider">Email</p>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-sm text-white/70 hover:text-white transition-colors duration-300 block"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-white/50 font-medium">
            &copy; {new Date().getFullYear()} Mahidhar. All rights reserved.
          </p>
          <p className="text-xs text-white/40 font-mono tracking-wide">Crafted with precision</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer