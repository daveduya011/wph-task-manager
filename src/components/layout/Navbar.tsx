'use client'

import { signOut, useSession } from '@/lib/auth-client'
import Link from 'next/link'
import React, { useState } from 'react'
import { Home, Plus, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload()
        },
      },
    })
  }

  return (
    <nav className="bg-background border-border z-50 border-b p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-foreground hover:text-primary text-lg font-bold"
        >
          Task Manager
        </Link>
        {session && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary z-50 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              title="Toggle Menu"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
            <div
              className={`items-center space-x-4 md:flex ${menuOpen ? 'bg-background border-border absolute inset-0 z-40 flex flex-col items-stretch justify-center space-y-2 border-b p-4' : 'hidden'}`}
            >
              <Button asChild variant="ghost">
                <Link href="/" title="Home" onClick={() => setMenuOpen(false)}>
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link
                  href="/task"
                  title="Create Task"
                  onClick={() => setMenuOpen(false)}
                >
                  <Plus className="h-4 w-4" />
                  Create Task
                </Link>
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  handleSignOut()
                  setMenuOpen(false)
                }}
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
