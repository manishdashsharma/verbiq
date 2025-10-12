'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  IconUser,
  IconCreditCard,
  IconTrash,
  IconLogout,
  IconCheck,
  IconCrown
} from '@tabler/icons-react'

export default function Settings() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleDeleteAccount = () => {
    // In a real app, you would implement account deletion
    console.log('Delete account requested')
    setShowDeleteConfirm(false)
  }

  const analysesUsed = session?.user?.analysesUsed || 0
  const analysesLimit = session?.user?.analysesLimit || 5

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-zinc-400">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <IconUser className="mr-2 h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
              <AvatarFallback className="bg-green-600 text-black text-xl">
                {session?.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-zinc-400">
                    Display Name
                  </Label>
                  <Input
                    id="name"
                    value={session?.user?.name || ''}
                    readOnly
                    className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-zinc-400">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={session?.user?.email || ''}
                    readOnly
                    className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
              <p className="text-sm text-zinc-400">
                Profile information is managed through your Google account and cannot be edited here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Section */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <IconCreditCard className="mr-2 h-5 w-5" />
            Subscription Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border border-zinc-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 text-black px-3 py-1 rounded-full text-sm font-semibold">
                  FREE
                </div>
                <h3 className="text-xl font-semibold text-white">Free Plan</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">$0</div>
                <div className="text-sm text-zinc-400">per month</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Plan Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-zinc-400">
                    <IconCheck className="h-4 w-4 text-green-500 mr-2" />
                    5 meeting analyses per month
                  </li>
                  <li className="flex items-center text-sm text-zinc-400">
                    <IconCheck className="h-4 w-4 text-green-500 mr-2" />
                    Basic summaries
                  </li>
                  <li className="flex items-center text-sm text-zinc-400">
                    <IconCheck className="h-4 w-4 text-green-500 mr-2" />
                    Action item extraction
                  </li>
                  <li className="flex items-center text-sm text-zinc-400">
                    <IconCheck className="h-4 w-4 text-green-500 mr-2" />
                    Export to PDF/Markdown
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Usage This Month</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Analyses Used</span>
                      <span className="text-white">{analysesUsed}/{analysesLimit}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${(analysesUsed / analysesLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Resets on the 1st of each month
                  </p>
                </div>
              </div>
            </div>

            {/* Upgrade Section */}
            <div className="mt-6 pt-6 border-t border-zinc-700">
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <IconCrown className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">Upgrade to Pro</h4>
                    <p className="text-sm text-zinc-400 mb-3">
                      Get unlimited analyses, advanced AI insights, team collaboration, and priority support.
                    </p>
                    <Button
                      disabled
                      variant="outline"
                      className="border-zinc-600 text-zinc-500"
                    >
                      Upgrade to Pro - $29/month (Coming Soon)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-white">Sign Out</h4>
              <p className="text-sm text-zinc-400">Sign out of your VerbIQ account</p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              <IconLogout className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <hr className="border-zinc-700" />

          {/* Danger Zone */}
          <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-400 mb-1">Delete Account</h4>
                <p className="text-sm text-red-300/70">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-zinc-900 border-zinc-800 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-lg text-white">Confirm Account Deletion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-400">
                Are you sure you want to delete your account? This will permanently remove all your data,
                including analyses and settings. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}