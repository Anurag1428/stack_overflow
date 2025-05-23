import React from 'react';
// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from 'next/font/google';
import type { Metadata } from 'next';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  // UserButton
} from '@clerk/nextjs'
import './globals.css';
import '../styles/prism.css';

import { ThemeProvider } from '@/context/ThemeProvider'
// import Layout from './(root)/layout'
import { Toaster } from 'react-hot-toast'
import { UserProvider } from '@/components/providers/UserProvider'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk'
})

export const metadata: Metadata = {
  title: 'DevFlow',
  description: 'A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more',
  icons: {
    icon: '/assets/images/site-logo.svg'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: 'primary-gradient',
              footerActionLink: 'primary-text-gradient hover:text-primary-500'
            }
          }}
        >
          <ThemeProvider>
            <UserProvider>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                {/* <UserButton /> */}
              </SignedIn>
              {/* <Layout> */}
              {children}
              {/* </Layout>  */}
              <Toaster position="top-center" />
            </UserProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}