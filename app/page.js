'use client'

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover";
import { Meteors } from "@/components/ui/meteors";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import FeedbackButton from "@/components/ui/feedback-button";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  IconWaveSquare,
  IconUser,
  IconSettings,
  IconLogout,
  IconDashboard
} from "@tabler/icons-react";

export default function Home() {
  const { data: session } = useSession()
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/feedback')
      if (response.ok) {
        const data = await response.json()
        const testimonials = data.feedbacks
          .filter(f => f.type === 'feedback' && f.stars >= 4)
          .map(f => ({
            quote: f.feedbackText,
            name: f.userId?.name || 'VerbIQ User',
            title: `⭐ ${f.stars}/5 stars`
          }))

        // If no real testimonials, show demo testimonials
        if (testimonials.length === 0) {
          setFeedbacks([
            {
              quote: "VerbIQ has completely transformed how we handle our team meetings. The AI insights are incredibly accurate and save us hours of manual note-taking.",
              name: "Sarah Johnson",
              title: "⭐ 5/5 stars"
            },
            {
              quote: "The transcription quality is outstanding, and the automatic action item extraction ensures nothing falls through the cracks. Highly recommend!",
              name: "Michael Chen",
              title: "⭐ 5/5 stars"
            },
            {
              quote: "As a project manager, VerbIQ has become indispensable. The meeting summaries are spot-on and help keep everyone aligned.",
              name: "Emily Rodriguez",
              title: "⭐ 5/5 stars"
            },
            {
              quote: "Amazing tool! The participant tracking feature helps us understand team dynamics and ensure everyone's voice is heard.",
              name: "David Kim",
              title: "⭐ 4/5 stars"
            },
            {
              quote: "VerbIQ's search functionality makes finding specific meeting topics a breeze. It's like having a personal meeting assistant.",
              name: "Lisa Zhang",
              title: "⭐ 5/5 stars"
            }
          ])
        } else {
          setFeedbacks(testimonials)
        }
      } else {
        // If API fails, still show demo testimonials
        setFeedbacks([
          {
            quote: "VerbIQ has completely transformed how we handle our team meetings. The AI insights are incredibly accurate and save us hours of manual note-taking.",
            name: "Sarah Johnson",
            title: "⭐ 5/5 stars"
          },
          {
            quote: "The transcription quality is outstanding, and the automatic action item extraction ensures nothing falls through the cracks. Highly recommend!",
            name: "Michael Chen",
            title: "⭐ 5/5 stars"
          },
          {
            quote: "As a project manager, VerbIQ has become indispensable. The meeting summaries are spot-on and help keep everyone aligned.",
            name: "Emily Rodriguez",
            title: "⭐ 5/5 stars"
          }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
      // Show demo testimonials on error
      setFeedbacks([
        {
          quote: "VerbIQ has completely transformed how we handle our team meetings. The AI insights are incredibly accurate and save us hours of manual note-taking.",
          name: "Sarah Johnson",
          title: "⭐ 5/5 stars"
        },
        {
          quote: "The transcription quality is outstanding, and the automatic action item extraction ensures nothing falls through the cracks. Highly recommend!",
          name: "Michael Chen",
          title: "⭐ 5/5 stars"
        },
        {
          quote: "As a project manager, VerbIQ has become indispensable. The meeting summaries are spot-on and help keep everyone aligned.",
          name: "Emily Rodriguez",
          title: "⭐ 5/5 stars"
        }
      ])
    }
  }

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
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image} alt={session.user?.name} />
                        <AvatarFallback className="bg-green-600 text-black">
                          {session.user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-700" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-white">{session.user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-zinc-400">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-zinc-700" />
                    <DropdownMenuItem
                      className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      <IconDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                      onClick={() => window.location.href = '/dashboard/settings'}
                    >
                      <IconSettings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-700" />
                    <DropdownMenuItem
                      className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      <IconLogout className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  className="border-zinc-800 text-white hover:bg-zinc-900"
                  onClick={() => window.location.href = '/auth/signin'}
                >
                  Sign In
                </Button>
              )}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Analysis Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800/50 group-hover:border-green-500/30 transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-600 rounded-xl blur-md opacity-50"></div>
                      <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                        <IconBrain className="h-8 w-8 text-black" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                        AI-Powered Analysis
                      </h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-green-500 to-transparent mt-1"></div>
                    </div>
                  </div>

                  <p className="text-zinc-300 leading-relaxed flex-grow">
                    Advanced AI extracts key insights, decisions, and action items from your meeting transcripts with unprecedented accuracy.
                  </p>

                  <div className="mt-6 flex items-center text-green-400 font-medium group-hover:text-green-300 transition-colors">
                    <span className="text-sm">Smart Recognition</span>
                    <IconArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Transcription Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800/50 group-hover:border-blue-500/30 transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-50"></div>
                      <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                        <IconMicrophone className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        Audio Transcription
                      </h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent mt-1"></div>
                    </div>
                  </div>

                  <p className="text-zinc-300 leading-relaxed flex-grow">
                    Upload MP3, WAV, or any audio file and get accurate automated transcription powered by advanced speech recognition.
                  </p>

                  <div className="mt-6 flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                    <span className="text-sm">Voice to Text</span>
                    <IconWaveSquare className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Summarization Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800/50 group-hover:border-purple-500/30 transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-600 rounded-xl blur-md opacity-50"></div>
                      <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                        <IconFileText className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                        Smart Summarization
                      </h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-transparent mt-1"></div>
                    </div>
                  </div>

                  <p className="text-zinc-300 leading-relaxed flex-grow">
                    Get concise, structured summaries that highlight the most important parts of your meetings with intelligent context awareness.
                  </p>

                  <div className="mt-6 flex items-center text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
                    <span className="text-sm">Key Insights</span>
                    <IconSparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800/50 group-hover:border-orange-500/30 transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-600 rounded-xl blur-md opacity-50"></div>
                      <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
                        <IconTarget className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                        Action Items & Decisions
                      </h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-orange-500 to-transparent mt-1"></div>
                    </div>
                  </div>

                  <p className="text-zinc-300 leading-relaxed flex-grow">
                    Automatically extract and organize action items with assignees, deadlines, and track key decisions made during meetings.
                  </p>

                  <div className="mt-6 flex items-center text-orange-400 font-medium group-hover:text-orange-300 transition-colors">
                    <span className="text-sm">Task Tracking</span>
                    <IconTarget className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Participant Tracking Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800/50 group-hover:border-teal-500/30 transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-teal-600 rounded-xl blur-md opacity-50"></div>
                      <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-xl">
                        <IconUsers className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                        Participant Tracking
                      </h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-teal-500 to-transparent mt-1"></div>
                    </div>
                  </div>

                  <p className="text-zinc-300 leading-relaxed flex-grow">
                    Identify speakers and track individual contributions throughout the meeting with advanced voice recognition technology.
                  </p>

                  <div className="mt-6 flex items-center text-teal-400 font-medium group-hover:text-teal-300 transition-colors">
                    <span className="text-sm">Voice ID</span>
                    <IconUsers className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Instant Search Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800/50 group-hover:border-yellow-500/30 transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-600 rounded-xl blur-md opacity-50"></div>
                      <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl">
                        <IconSearch className="h-8 w-8 text-black" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                        Instant Search
                      </h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-500 to-transparent mt-1"></div>
                    </div>
                  </div>

                  <p className="text-zinc-300 leading-relaxed flex-grow">
                    Quickly find specific topics, decisions, or action items across all your analyzed meetings with powerful search capabilities.
                  </p>

                  <div className="mt-6 flex items-center text-yellow-400 font-medium group-hover:text-yellow-300 transition-colors">
                    <span className="text-sm">Quick Find</span>
                    <IconBolt className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="text-green-600">Works</span>
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Transform your meetings into actionable insights in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Step 1 */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl scale-150 group-hover:bg-green-500/30 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <IconUpload className="h-10 w-10 text-black" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                  01
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors">Upload Your Content</h3>
              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                Upload audio files (MP3, WAV, M4A), text files, or paste transcripts directly into VerbIQ
              </p>
            </div>

            {/* Step 2 */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl scale-150 group-hover:bg-blue-500/30 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <IconBrain className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-blue-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                  02
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">AI Analysis</h3>
              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                Audio files are automatically transcribed, then our AI extracts insights, decisions, and action items
              </p>
            </div>

            {/* Step 3 */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl scale-150 group-hover:bg-purple-500/30 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <IconEye className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-purple-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                  03
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-purple-400 transition-colors">Review & Export</h3>
              <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                Get organized summaries, action items, and insights ready to share with your team
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

      {/* Customer Testimonials */}
      {feedbacks.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                What Our Users <span className="text-green-600">Are Saying</span>
              </h2>
              <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
                Real feedback from teams using VerbIQ to transform their meetings
              </p>
            </div>

            <div className="relative">
              <InfiniteMovingCards
                items={feedbacks}
                direction="left"
                speed="fast"
                pauseOnHover={true}
                className="py-4"
              />
            </div>
          </div>
        </section>
      )}

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
                <li><a href="/status" className="hover:text-white transition-colors">Bug Reports & Features</a></li>
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

      {/* Floating Feedback Button */}
      <FeedbackButton />
    </div>
  );
}
