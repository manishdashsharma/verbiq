'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { IconArrowLeft } from '@tabler/icons-react'

export default function Privacy() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-zinc-400 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-zinc-300 leading-relaxed">
                VerbIQ (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data.
                This privacy policy explains how we collect, use, and protect your information when you use our
                AI-powered meeting intelligence platform at verbiq.manishdashsharma.site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-green-400 mb-2">Account Information</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    When you create an account, we collect your email address, name, and profile information
                    from your chosen authentication provider (GitHub, Google).
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-400 mb-2">Meeting Data</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    We process and store the meeting transcripts and audio files you upload for analysis.
                    This includes the original content and the AI-generated insights, summaries, and action items.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-400 mb-2">Usage Information</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    We collect information about how you use VerbIQ, including features accessed,
                    analysis requests, and general usage patterns to improve our service.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Provide and improve our AI-powered meeting analysis services
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Process your meeting transcripts and generate insights
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Authenticate and manage your account
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Communicate with you about your account and our services
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Monitor and analyze usage to improve our platform
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Processing and AI</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Your meeting transcripts are processed using OpenAI&apos;s GPT-4 and our self-hosted Whisper
                transcription service. We implement appropriate technical and organizational measures to
                protect your data during processing.
              </p>
              <p className="text-zinc-300 leading-relaxed">
                Audio files are transcribed on our secure infrastructure and are not shared with third
                parties beyond the necessary AI processing services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties,
                except in the following circumstances:
              </p>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  With your explicit consent
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  To comply with legal obligations or respond to lawful requests
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  To protect our rights, property, or safety, or that of our users
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  With trusted service providers who assist in operating our platform (under strict confidentiality agreements)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Security</h2>
              <p className="text-zinc-300 leading-relaxed">
                We implement industry-standard security measures to protect your data, including encryption
                in transit and at rest, secure authentication, and regular security assessments. However,
                no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
              <p className="text-zinc-300 leading-relaxed">
                We retain your account information and meeting data for as long as your account is active
                or as needed to provide you services. You may delete your data at any time through your
                account settings or by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">You have the right to:</p>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Access and review your personal data
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Correct inaccurate or incomplete information
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Delete your account and associated data
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Export your data in a portable format
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Opt out of certain data processing activities
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Cookies and Tracking</h2>
              <p className="text-zinc-300 leading-relaxed">
                We use essential cookies for authentication and session management. We do not use tracking
                cookies for advertising purposes. You can control cookie settings through your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Updates to This Policy</h2>
              <p className="text-zinc-300 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any material
                changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p className="text-zinc-300 leading-relaxed">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <p className="text-zinc-300">
                  <strong className="text-white">Email:</strong> mdashsharma95@gmail.com<br />
                  <strong className="text-white">Website:</strong> https://verbiq.manishdashsharma.site
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}