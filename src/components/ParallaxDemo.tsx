import { useEffect, useState } from 'react'

export const ParallaxDemo: React.FC = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Parallax image URLs from Unsplash (free to use)
  const images = {
    mountains: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    forest: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    lake: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2006&q=80',
    desert: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    ocean: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }

  return (
    <div className="relative">
      {/* Hero Section - Classic Parallax */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url(${images.mountains})`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center">
          <div>
            <h1 className="text-6xl font-bold mb-6">Parallax Demo</h1>
            <p className="text-xl mb-8">Exploring Various Parallax Effects</p>
            <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors">
              Scroll to Explore
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">Classic Fixed Background</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The hero section above uses a classic parallax effect with CSS `background-attachment: fixed`. 
            The background image moves slower than the content, creating a depth effect. This is the most 
            traditional parallax technique and works well for hero sections.
          </p>
        </div>
      </section>

      {/* Multi-Layer Parallax */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${images.forest})`,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        
        {/* Middle Layer */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-900 to-transparent" />
        </div>
        
        {/* Foreground Layer */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        >
          <div className="text-white text-center z-10">
            <h2 className="text-5xl font-bold mb-4">Multi-Layer Parallax</h2>
            <p className="text-xl">Different layers moving at different speeds</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">Multi-Layer Depth</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            This section demonstrates multi-layer parallax where different elements move at varying speeds. 
            The background forest moves slowly, the gradient overlay moves at medium speed, and the text 
            moves slowly, creating a layered depth effect that mimics natural perspective.
          </p>
        </div>
      </section>

      {/* Reveal Parallax */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${images.lake})`,
            transform: `translateY(${scrollY * -0.3}px)`,
          }}
        />
        <div className="absolute inset-0 bg-blue-900 bg-opacity-50" />
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center">
          <div
            style={{
              transform: `translateY(${Math.max(0, scrollY - window.innerHeight) * 0.5}px)`,
              opacity: Math.min(1, Math.max(0, (scrollY - window.innerHeight * 1.5) / 300))
            }}
          >
            <h2 className="text-5xl font-bold mb-4">Reveal Effect</h2>
            <p className="text-xl">Content reveals as you scroll</p>
          </div>
        </div>
      </section>

      {/* Horizontal Parallax */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Horizontal Parallax</h2>
          <div className="relative h-96 overflow-hidden rounded-lg shadow-lg">
            {/* Background slides horizontally */}
            <div
              className="absolute inset-0 bg-cover bg-center flex"
              style={{
                transform: `translateX(${scrollY * -0.2}px)`,
                width: '150%'
              }}
            >
              <div 
                className="w-1/3 bg-cover bg-center"
                style={{ backgroundImage: `url(${images.desert})` }}
              />
              <div 
                className="w-1/3 bg-cover bg-center"
                style={{ backgroundImage: `url(${images.ocean})` }}
              />
              <div 
                className="w-1/3 bg-cover bg-center"
                style={{ backgroundImage: `url(${images.mountains})` }}
              />
            </div>
            
            {/* Foreground content */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <div className="text-white text-center">
                <h3 className="text-3xl font-bold mb-2">Horizontal Movement</h3>
                <p className="text-lg">Landscapes slide as you scroll</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scale Parallax */}
      <section className="relative h-screen overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${images.forest})`,
            transform: `scale(${1 + scrollY * 0.0005}) translateY(${scrollY * 0.3}px)`,
            transformOrigin: 'center center'
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center">
          <div
            style={{
              transform: `scale(${1 + scrollY * 0.0002})`,
            }}
          >
            <h2 className="text-5xl font-bold mb-4">Scale Effect</h2>
            <p className="text-xl">Image and text scale with scroll</p>
          </div>
        </div>
      </section>

      {/* Rotation Parallax */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">Rotation Parallax</h2>
          <div className="flex justify-center">
            <div
              className="w-64 h-64 rounded-full bg-cover bg-center shadow-lg"
              style={{
                backgroundImage: `url(${images.lake})`,
                transform: `rotate(${scrollY * 0.1}deg)`,
              }}
            />
          </div>
          <p className="text-lg text-gray-600 mt-8 max-w-2xl mx-auto">
            This circular element rotates based on scroll position, creating a dynamic spinning effect 
            that adds movement and interest to the page.
          </p>
        </div>
      </section>

      {/* Opacity Parallax */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${images.ocean})`,
          }}
        />
        <div 
          className="absolute inset-0 bg-black"
          style={{
            opacity: Math.min(0.7, scrollY * 0.0005)
          }}
        />
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center">
          <div
            style={{
              opacity: Math.max(0.3, 1 - scrollY * 0.0008)
            }}
          >
            <h2 className="text-5xl font-bold mb-4">Fade Effect</h2>
            <p className="text-xl">Content fades as you scroll</p>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="bg-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Parallax Techniques Demonstrated</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Fixed Background</h3>
              <p className="text-gray-300">Classic CSS parallax with background-attachment: fixed</p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Multi-Layer</h3>
              <p className="text-gray-300">Multiple elements moving at different speeds</p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Reveal Effect</h3>
              <p className="text-gray-300">Content appears and fades based on scroll position</p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Horizontal</h3>
              <p className="text-gray-300">Elements move sideways instead of vertically</p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Scale Transform</h3>
              <p className="text-gray-300">Elements grow or shrink with scroll</p>
            </div>
            <div className="p-6 bg-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Rotation & Opacity</h3>
              <p className="text-gray-300">Spinning and fading effects</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
