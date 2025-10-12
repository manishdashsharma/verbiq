'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  IconHome,
  IconFileText,
  IconSettings,
  IconLogout,
  IconUser,
  IconPlus
} from '@tabler/icons-react'

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [analysesUsed, setAnalysesUsed] = useState(0)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    if (session?.user) {
      setAnalysesUsed(session.user.analysesUsed || 0)
    }
  }, [session, status, router])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: IconHome,
    },
    {
      name: 'Analyses',
      href: '/dashboard/analyses',
      icon: IconFileText,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: IconSettings,
    },
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b border-zinc-800 px-6">
            <h1 className="text-xl font-bold text-white">VerbIQ</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-600 text-black'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-black' : 'text-zinc-400 group-hover:text-white'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Usage Counter */}
          <div className="border-t border-zinc-800 px-4 py-4">
            <div className="rounded-md bg-zinc-900 p-3">
              <div className="text-sm font-medium text-white mb-1">Usage</div>
              <div className="text-xs text-zinc-400">
                {analysesUsed}/5 analyses used
              </div>
              <div className="mt-2 w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(analysesUsed / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="border-t border-zinc-800 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2 py-2 h-auto hover:bg-zinc-800"
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={session.user.image} alt={session.user.name} />
                    <AvatarFallback className="bg-green-600 text-black">
                      {session.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <div className="text-sm font-medium text-white">
                      {session.user.name}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {session.user.email}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800" align="end">
                <DropdownMenuItem
                  onClick={() => router.push('/dashboard/settings')}
                  className="hover:bg-zinc-800 focus:bg-zinc-800"
                >
                  <IconUser className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="hover:bg-zinc-800 focus:bg-zinc-800"
                >
                  <IconLogout className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-black border-b border-zinc-800">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-white">
                {pathname === '/dashboard' && 'Dashboard'}
                {pathname === '/dashboard/analyses' && 'Analyses'}
                {pathname === '/dashboard/new' && 'New Analysis'}
                {pathname === '/dashboard/settings' && 'Settings'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {analysesUsed < 5 && (
                <Button
                  onClick={() => router.push('/dashboard/new')}
                  className="bg-green-600 hover:bg-green-700 text-black font-semibold"
                >
                  <IconPlus className="mr-2 h-4 w-4" />
                  New Analysis
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}