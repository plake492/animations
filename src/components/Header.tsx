import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-4 bg-white shadow-sm border-b border-gray-200">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            MCP Motion Demo
          </Link>
          <Link
            to="/demo"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            Animation Demo
          </Link>
          <Link
            to="/physics"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            Physics Demo
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          Powered by MCP Motion Server
        </div>
      </nav>
    </header>
  )
}
