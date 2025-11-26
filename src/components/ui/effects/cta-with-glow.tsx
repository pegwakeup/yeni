"use client"

import { Button } from "./button"
import { Glow } from "./glow"
import { cn } from "../../lib/utils"
import { ArrowUpRight, MessageSquare, ExternalLink } from "lucide-react"

interface CTAProps {
  title: string
  description?: string
  action: {
    text: string
    href: string
    variant?: "default" | "glow"
  }
  className?: string
}

export function CTASection({ title, description, action, className }: CTAProps) {
  return (
    <section className={cn("group relative overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-slate-50/50 via-blue-50/30 to-slate-50/50 dark:from-transparent dark:via-dark-light/20 dark:to-transparent", className)}>
      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-container flex-col items-center gap-6 text-center sm:gap-8 px-4">
        <h2 className="text-3xl font-bold sm:text-5xl animate-appear text-slate-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto animate-appear delay-100 font-medium">
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 animate-appear delay-200">
          <Button 
            variant={action.variant || "default"} 
            size="lg" 
            className="group/button"
            asChild
          >
            <a href={action.href} className="flex items-center space-x-2">
              <span>{action.text}</span>
              <ArrowUpRight className="w-5 h-5 group-hover/button:rotate-45 transition-transform" />
            </a>
          </Button>

          <Button
            variant="glow"
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BD5A] text-slate-900 dark:text-white group/button"
            asChild
          >
            <a 
              href="https://wa.me/+905061523255" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Bize Ulaşın</span>
              <ExternalLink className="w-5 h-5 group-hover/button:rotate-45 transition-transform" />
            </a>
          </Button>
        </div>
      </div>

      {/* Glow Effects */}
      <div className="absolute left-0 top-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
        <Glow variant="bottom" className="animate-appear-zoom delay-300" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl opacity-20 dark:opacity-30" />
      <div className="absolute -left-40 -top-40 w-80 h-80 bg-cyan-400/15 dark:bg-cyan-500/20 rounded-full blur-3xl opacity-15 dark:opacity-25" />
    </section>
  )
}