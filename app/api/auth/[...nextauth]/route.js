import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB()

        
        const existingUser = await User.findOne({ email: user.email })

        if (existingUser) {
          
          if (!existingUser.providers.includes(account.provider)) {
      
            existingUser.providers.push(account.provider)
            await existingUser.save()
          }
          return true
        } else {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            providers: [account.provider],
            analysesUsed: 0,
            analysesLimit: 5
          })
          return true
        }
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        await connectDB()
        const dbUser = await User.findOne({ email: user.email })
        if (dbUser) {
          token.id = dbUser._id.toString()
          token.analysesUsed = dbUser.analysesUsed
          token.analysesLimit = dbUser.analysesLimit
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.analysesUsed = token.analysesUsed || 0
        session.user.analysesLimit = token.analysesLimit || 5
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  }
})

export { handler as GET, handler as POST }