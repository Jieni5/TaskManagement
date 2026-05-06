import Link from 'next/link'
import Button from '../components/ui/Button'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 dark:border-dark-border-subtle bg-white dark:bg-dark-base">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            Callsheet
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/features" className="text-sm font-medium hover:text-amber-500">
              Features
            </Link>
            <Link href="/signin">
              <Button variant="outline">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
