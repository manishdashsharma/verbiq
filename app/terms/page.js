'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IconArrowLeft } from '@tabler/icons-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-white">VerbIQ</Link>
            </div>
            <nav>
              <Button
                variant="outline"
                className="border-zinc-800 text-white hover:bg-zinc-900"
                asChild
              >
                <Link href="/">
                  <IconArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-zinc-400 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-zinc-300 leading-relaxed">
                By accessing and using VerbIQ (&quot;the Service&quot;), operated by Manish Dash Sharma (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;),
                you accept and agree to be bound by the terms and provision of this agreement. If you do not agree
                to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="text-zinc-300 leading-relaxed">
                VerbIQ is an AI-powered meeting intelligence platform that transforms meeting recordings and
                transcripts into actionable insights. Our service includes automated transcription, AI analysis,
                action item extraction, sentiment analysis, and comprehensive meeting analytics.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              <div className="space-y-4">
                <p className="text-zinc-300 leading-relaxed">
                  To use VerbIQ, you must create an account using a supported authentication provider
                  (GitHub, Google). You are responsible for:
                </p>
                <ul className="space-y-2 text-zinc-300 ml-4">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Maintaining the security of your account credentials
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    All activities that occur under your account
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Providing accurate and complete information
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Notifying us immediately of any unauthorized use
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
              <div className="space-y-4">
                <p className="text-zinc-300 leading-relaxed">
                  You agree to use VerbIQ only for lawful purposes and in accordance with these Terms.
                  You agree NOT to:
                </p>
                <ul className="space-y-2 text-zinc-300 ml-4">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Upload content that is illegal, harmful, or violates others&apos; rights
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Attempt to gain unauthorized access to our systems
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Use the service to harm, threaten, or harass others
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Reverse engineer or attempt to extract our algorithms
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Use the service for competitive intelligence or benchmarking
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    Upload recordings without proper consent from all participants
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Content and Data</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-green-400 mb-2">Your Content</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    You retain ownership of all content you upload to VerbIQ. By uploading content, you grant
                    us a limited license to process, analyze, and store your content for the purpose of
                    providing our services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-400 mb-2">AI-Generated Content</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    The insights, summaries, and analysis generated by our AI belong to you. However, you
                    acknowledge that AI-generated content may not always be accurate and should be reviewed.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-400 mb-2">Recording Consent</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    You are solely responsible for ensuring you have proper consent from all meeting
                    participants before uploading recordings to VerbIQ.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Usage Limits and Billing</h2>
              <div className="space-y-4">
                <p className="text-zinc-300 leading-relaxed">
                  VerbIQ offers a free tier with limited usage and paid plans for additional features.
                  Usage limits are clearly displayed in your account dashboard.
                </p>
                <ul className="space-y-2 text-zinc-300 ml-4">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Free plan: 5 meeting analyses per month
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    Fair use policy applies to prevent abuse
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    We reserve the right to modify pricing with 30 days notice
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Privacy and Data Protection</h2>
              <p className="text-zinc-300 leading-relaxed">
                Your privacy is important to us. Our Privacy Policy, which is incorporated into these
                Terms by reference, explains how we collect, use, and protect your information.
                By using VerbIQ, you consent to our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Service Availability</h2>
              <p className="text-zinc-300 leading-relaxed">
                We strive to maintain high availability but do not guarantee uninterrupted service.
                We may temporarily suspend service for maintenance, updates, or technical issues.
                We are not liable for any damages resulting from service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Intellectual Property</h2>
              <p className="text-zinc-300 leading-relaxed">
                VerbIQ and its original content, features, and functionality are owned by Manish Dash Sharma
                and are protected by international copyright, trademark, and other intellectual property laws.
                You may not copy, modify, or distribute our proprietary technology.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Disclaimers and Limitations</h2>
              <div className="space-y-4">
                <p className="text-zinc-300 leading-relaxed">
                  VerbIQ is provided &quot;as is&quot; without warranties of any kind. We disclaim all warranties,
                  express or implied, including but not limited to:
                </p>
                <ul className="space-y-2 text-zinc-300 ml-4">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    Accuracy of AI-generated analysis and transcriptions
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    Uninterrupted or error-free service
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    Security against unauthorized access or data loss
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    Fitness for a particular purpose
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Limitation of Liability</h2>
              <p className="text-zinc-300 leading-relaxed">
                To the maximum extent permitted by law, Manish Dash Sharma shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, including but not
                limited to loss of data, revenue, or profits, arising from your use of VerbIQ.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Termination</h2>
              <p className="text-zinc-300 leading-relaxed">
                We may terminate or suspend your account at any time for violations of these Terms.
                You may terminate your account at any time by contacting us. Upon termination,
                your right to use VerbIQ will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Changes to Terms</h2>
              <p className="text-zinc-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of
                material changes via email or through the service. Continued use after changes
                constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Governing Law</h2>
              <p className="text-zinc-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India,
                without regard to its conflict of law provisions. Any disputes will be resolved
                through binding arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">15. Contact Information</h2>
              <p className="text-zinc-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <p className="text-zinc-300">
                  <strong className="text-white">Email:</strong> mdashsharma95@gmail.com<br />
                  <strong className="text-white">Website:</strong> https://verbiq.manishdashsharma.site<br />
                  <strong className="text-white">Address:</strong> Bengaluru
                </p>
              </div>
            </section>

            <section className="border-t border-zinc-700 pt-6">
              <p className="text-zinc-400 text-sm">
                By using VerbIQ, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}