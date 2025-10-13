'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconBrandGoogle, IconBrandGithub, IconSparkles, IconLock, IconTrendingUp } from '@tabler/icons-react'
import Link from 'next/link'

export default function SignIn() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState(null)

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleSignIn = async (provider) => {
    setLoading(true)
    setLoadingProvider(provider)
    try {
      const result = await signIn(provider, {
        callbackUrl: '/dashboard',
        redirect: false,
      })

      if (result?.error) {
        console.error('Sign in error:', result.error)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setLoading(false)
      setLoadingProvider(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-transparent to-green-600/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_70%)]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-600/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-600/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-green-600/8 rounded-full blur-lg animate-pulse delay-500"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl mb-3 shadow-lg">
            <IconSparkles className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent mb-1">
            VerbIQ
          </h1>
          <p className="text-zinc-400 text-base">
            AI-Powered Meeting Intelligence
          </p>
        </div>

        {/* Main Sign In Card */}
        <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800/50 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-bold text-white mb-1">
              Welcome Back
            </CardTitle>
            <p className="text-zinc-400 text-sm">
              Sign in to unlock powerful meeting insights
            </p>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            <Button
              onClick={() => handleSignIn('google')}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] group"
            >
              <IconBrandGoogle className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              {loadingProvider === 'google' ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-500">Or</span>
              </div>
            </div>

            <Button
              onClick={() => handleSignIn('github')}
              disabled={loading}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] group border border-zinc-700/50"
            >
              <IconBrandGithub className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              {loadingProvider === 'github' ? 'Signing in...' : 'Continue with GitHub'}
            </Button>

            <div className="text-center pt-1">
              <Link
                href="/"
                className="text-zinc-400 hover:text-green-400 transition-colors text-sm font-medium inline-flex items-center"
              >
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-lg p-2 border border-zinc-800/50">
            <IconSparkles className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-zinc-400">AI Analysis</p>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-lg p-2 border border-zinc-800/50">
            <IconTrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-zinc-400">Smart Insights</p>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-lg p-2 border border-zinc-800/50">
            <IconLock className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-zinc-400">Secure</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-4 text-center">
          <p className="text-xs text-zinc-500 mb-2">Trusted by professionals worldwide</p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}