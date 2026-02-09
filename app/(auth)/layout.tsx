
export default function AuthLayout({
  children
}: LayoutProps<'/'>) {
  return (
    <main className="min-h-screen bg-background p-4">
      {children}
    </main>
  )
}