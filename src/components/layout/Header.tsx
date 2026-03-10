import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-screen-2xl items-center px-4 md:px-8">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <img src="Logo.png" alt="logo" className="w-15 flex border rounded-lg" />
          <span className="font-bold tracking-tight text-lg">
             <span className="txt-logo"> egx </span> 
             | ProductManager
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/products"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Catálogo V0.0.1
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
