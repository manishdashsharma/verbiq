'use client'

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover";
import { Meteors } from "@/components/ui/meteors";
import Image from 'next/image';
import {
  IconFileText,
  IconBrain,
  IconUsers,
  IconSearch,
  IconClock,
  IconCheck,
  IconArrowRight,
  IconUpload,
  IconEye,
  IconSparkles,
  IconBolt,
  IconTarget,
  IconMicrophone,
  IconWaveSquare
} from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">VerbIQ</h1>
            </div>
            <nav>
              <Button
                variant="outline"
                className="border-zinc-800 text-white hover:bg-zinc-900"
                onClick={() => window.location.href = '/auth/signin'}
              >
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <BackgroundBeamsWithCollision>
      <section className="sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight px-2">
            <span className="block sm:inline">Transform Meeting</span>
            <br className="hidden sm:block" />
            <span className="block sm:inline text-green-600">Audio & Transcripts</span> <span className="block sm:inline">into</span>
            <br className="hidden sm:block" />
            <Cover>Actionable Insights</Cover>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Upload audio files or transcripts and get AI-powered analysis.
            Extract key decisions, action items, and insights in seconds with automated transcription.
          </p>
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-black font-semibold px-6 sm:px-8 py-3 text-base sm:text-lg mx-4"
            onClick={() => window.location.href = '/auth/signin'}
          >
            <span className="hidden sm:inline">Start Analyzing for Free</span>
            <span className="sm:hidden">Start Free</span>
            <IconArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </section>
      </BackgroundBeamsWithCollision>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful <span className="text-green-600">AI-Powered</span> Features
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              From audio to insights - transform your meetings with automated transcription and intelligent analysis
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* AI-Powered Analysis Card */}
            <div className="relative">
              <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-green-600/20 blur-3xl" />
              <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-8 shadow-xl min-h-[280px] sm:min-h-[320px]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
                  <IconBrain className="h-6 w-6 text-green-600" />
                </div>

                <h3 className="relative z-50 mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-white">
                  AI-Powered Analysis
                </h3>

                <p className="relative z-50 mb-4 sm:mb-6 text-sm sm:text-base font-normal text-zinc-400">
                  Advanced AI extracts key insights, decisions, and action items from your meeting transcripts automatically with unprecedented accuracy.
                </p>

                <Meteors number={15} />
              </div>
            </div>

            {/* Audio Transcription Card */}
            <div className="relative">
              <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-blue-600/20 blur-3xl" />
              <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-8 shadow-xl min-h-[280px] sm:min-h-[320px]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
                  <IconMicrophone className="h-6 w-6 text-green-600" />
                </div>

                <h3 className="relative z-50 mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-white">
                  Audio Transcription
                </h3>

                <p className="relative z-50 mb-4 sm:mb-6 text-sm sm:text-base font-normal text-zinc-400">
                  Upload MP3, WAV, or any audio file and get accurate automated transcription powered by advanced speech recognition technology.
                </p>

                <Meteors number={14} />
              </div>
            </div>

            {/* Smart Summarization Card */}
            <div className="relative">
              <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-zinc-500/20 blur-3xl" />
              <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-8 shadow-xl min-h-[280px] sm:min-h-[320px]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
                  <IconFileText className="h-6 w-6 text-green-600" />
                </div>

                <h3 className="relative z-50 mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-white">
                  Smart Summarization
                </h3>

                <p className="relative z-50 mb-4 sm:mb-6 text-sm sm:text-base font-normal text-zinc-400">
                  Get concise, structured summaries that highlight the most important parts of your meetings with intelligent context awareness.
                </p>

                <Meteors number={12} />
              </div>
            </div>

            {/* Action Items Card */}
            <div className="relative">
              <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-green-600/20 blur-3xl" />
              <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-8 shadow-xl min-h-[280px] sm:min-h-[320px]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
                  <IconTarget className="h-6 w-6 text-green-600" />
                </div>

                <h3 className="relative z-50 mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-white">
                  Action Items & Decisions
                </h3>

                <p className="relative z-50 mb-4 sm:mb-6 text-sm sm:text-base font-normal text-zinc-400">
                  Automatically extract and organize action items with assignees, deadlines, and track key decisions made during meetings.
                </p>

                <Meteors number={18} />
              </div>
            </div>

            {/* Participant Tracking Card */}
            <div className="relative">
              <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-zinc-500/20 blur-3xl" />
              <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-8 shadow-xl min-h-[280px] sm:min-h-[320px]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
                  <IconUsers className="h-6 w-6 text-green-600" />
                </div>

                <h3 className="relative z-50 mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-white">
                  Participant Tracking
                </h3>

                <p className="relative z-50 mb-4 sm:mb-6 text-sm sm:text-base font-normal text-zinc-400">
                  Identify speakers and track individual contributions throughout the meeting with advanced voice recognition technology.
                </p>

                <Meteors number={10} />
              </div>
            </div>

            {/* Instant Search Card */}
            <div className="relative">
              <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-green-600/20 blur-3xl" />
              <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-8 shadow-xl min-h-[280px] sm:min-h-[320px]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
                  <IconSearch className="h-6 w-6 text-green-600" />
                </div>

                <h3 className="relative z-50 mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-white">
                  Instant Search
                </h3>

                <p className="relative z-50 mb-4 sm:mb-6 text-sm sm:text-base font-normal text-zinc-400">
                  Quickly find specific topics, decisions, or action items across all your analyzed meetings with powerful search capabilities.
                </p>


                <Meteors number={14} />
              </div>
            </div>

            {/* Time Savings Card */}
            <div className="relative">
              <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-zinc-500/20 blur-3xl" />
              <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-8 shadow-xl min-h-[280px] sm:min-h-[320px]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800">
                  <IconClock className="h-6 w-6 text-green-600" />
                </div>

                <h3 className="relative z-50 mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-white">
                  Massive Time Savings
                </h3>

                <p className="relative z-50 mb-4 sm:mb-6 text-sm sm:text-base font-normal text-zinc-400">
                  Reduce hours of manual note-taking and analysis into minutes of automated insights, saving 90% of your time.
                </p>


                <Meteors number={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 px-4">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center px-4">
              <div className="bg-green-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <IconUpload className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">1. Upload</h3>
              <p className="text-sm sm:text-base text-zinc-400">
                Upload audio files (MP3, WAV, M4A), text files, or paste transcripts directly into VerbIQ.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="bg-green-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <IconBrain className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">2. Transcribe & Analyze</h3>
              <p className="text-sm sm:text-base text-zinc-400">
                Audio files are automatically transcribed, then our AI extracts insights, decisions, and action items.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="bg-green-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <IconEye className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">3. Review</h3>
              <p className="text-sm sm:text-base text-zinc-400">
                Get organized summaries, action items, and insights ready to share with your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-4">
              Simple <span className="text-green-600">Pricing</span>
            </h2>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto px-4">
              Start for free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            {/* Free Plan */}
            <div className="relative">
              <div className="absolute inset-0 h-full w-full scale-[0.85] transform rounded-full bg-green-500/30 bg-gradient-to-r from-green-500/30 to-emerald-500/30 blur-3xl" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-green-500/50 bg-zinc-900/80 backdrop-blur-sm p-6 sm:p-8 shadow-2xl min-h-[450px] sm:min-h-[500px]">
                <div className="relative z-50">
                  <div className="bg-green-600 text-black text-sm font-bold px-4 py-2 rounded-full w-fit mb-6">
                    Currently FREE ✨
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Free Plan</h3>
                  <p className="text-zinc-400 mb-6">Perfect for getting started</p>

                  <div className="flex items-baseline mb-6 sm:mb-8">
                    <span className="text-4xl sm:text-5xl font-bold text-white">$0</span>
                    <span className="text-lg sm:text-xl text-zinc-400 ml-2">/month</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 mr-3">
                        <IconCheck className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-white font-medium">5 meeting analyses per month</span>
                    </li>
                    <li className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 mr-3">
                        <IconCheck className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-white font-medium">Audio transcription & AI summaries</span>
                    </li>
                    <li className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 mr-3">
                        <IconCheck className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-white font-medium">Action item extraction</span>
                    </li>
                    <li className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 mr-3">
                        <IconCheck className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-white font-medium">Export to PDF/Markdown</span>
                    </li>
                  </ul>

                  <Button
                    className="relative z-50 w-full bg-green-600 hover:bg-green-700 text-black font-bold py-3 text-lg"
                    onClick={() => window.location.href = '/auth/signin'}
                  >
                    <IconSparkles className="mr-2 h-5 w-5" />
                    Get Started Free
                  </Button>
                </div>

                <Meteors number={20} />
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative">
              <div className="absolute inset-0 h-full w-full scale-[0.85] transform rounded-full bg-zinc-500/20 blur-3xl" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/60 backdrop-blur-sm p-6 sm:p-8 shadow-xl min-h-[450px] sm:min-h-[500px] opacity-75">
                <div className="relative z-50">
                  <div className="bg-zinc-700 text-zinc-400 text-sm font-bold px-4 py-2 rounded-full w-fit mb-6">
                    Coming Soon 🚀
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pro Plan</h3>
                  <p className="text-zinc-400 mb-6">For power users and teams</p>

                  <div className="flex items-baseline mb-6 sm:mb-8">
                    <span className="text-4xl sm:text-5xl font-bold text-white">$29</span>
                    <span className="text-lg sm:text-xl text-zinc-400 ml-2">/month</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 mr-3">
                        <IconCheck className="h-4 w-4 text-zinc-400" />
                      </div>
                      <span className="text-zinc-300 font-medium">Unlimited analyses</span>
                    </li>
                    <li className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 mr-3">
                        <IconCheck className="h-4 w-4 text-zinc-400" />
                      </div>
                      <span className="text-zinc-300 font-medium">Advanced AI insights</span>
                    </li>
                    <li className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 mr-3">
                        <IconCheck className="h-4 w-4 text-zinc-400" />
                      </div>
                      <span className="text-zinc-300 font-medium">Team collaboration</span>
                    </li>
                    <li className="flex items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 mr-3">
                        <IconCheck className="h-4 w-4 text-zinc-400" />
                      </div>
                      <span className="text-zinc-300 font-medium">Priority support</span>
                    </li>
                  </ul>

                  <Button
                    className="relative z-50 w-full bg-zinc-700 text-zinc-400 font-bold py-3 text-lg cursor-not-allowed"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </div>

                <Meteors number={10} />
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 sm:mt-16 px-4">
            <p className="text-sm sm:text-base text-zinc-400 mb-4 sm:mb-6">
              Ready to transform your meeting productivity?
            </p>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-black font-bold px-6 sm:px-8 py-3 text-base sm:text-lg"
              onClick={() => window.location.href = '/auth/signin'}
            >
              <IconArrowRight className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Start Your Free Analysis</span>
              <span className="sm:hidden">Start Free</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold mb-4">VerbIQ</h3>
              <p className="text-zinc-400 max-w-md">
                Transform your meeting transcripts into actionable insights with AI-powered analysis.
              </p>
              <Image
                src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fverbiq.manishdashsharma.site%2F&labelColor=%2337d67a&countColor=%23555555&style=flat-square"
                alt="Visitor Count"
                width={80}
                height={20}
                className="mt-2"
                unoptimized
              />
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-400">
            <p>&copy; 2024 VerbIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
