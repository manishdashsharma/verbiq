'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react'
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Welcome to VerbIQ
          </CardTitle>
          <p className="text-zinc-400">
            Sign in to start analyzing your meeting transcripts
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleSignIn('google')}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 text-base"
          >
            <IconBrandGoogle className="mr-3 h-5 w-5" />
            {loadingProvider === 'google' ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <Button
            onClick={() => handleSignIn('github')}
            disabled={loading}
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 text-base"
          >
            <IconBrandGithub className="mr-3 h-5 w-5" />
            {loadingProvider === 'github' ? 'Signing in...' : 'Sign in with GitHub'}
          </Button>

          <div className="text-center">
            <Link
              href="/"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}