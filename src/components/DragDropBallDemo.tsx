import { useState, useRef, useCallback, useEffect } from 'react'

interface Position {
  x: number
  y: number
}

interface Velocity {
  x: number
  y: number
}

export const DragDropBallDemo: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 200, y: 150 })
  const [velocity, setVelocity] = useState<Velocity>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })
  const [lastPosition, setLastPosition] = useState<Position>({ x: 200, y: 150 })
  const [lastTime, setLastTime] = useState<number>(Date.now())

  // Physics parameters as state for real-time control
  const [friction, setFriction] = useState(0.995)
  const [bounceDamping, setBounceDamping] = useState(0.8)
  const [velocityScale, setVelocityScale] = useState(0.15)
  const [velocityMultiplier, setVelocityMultiplier] = useState(10)
  const [randomThrowPower, setRandomThrowPower] = useState(8)

  const containerRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Physics constants
  const BALL_SIZE = 40 // Get boundary dimensions
  const getBoundary = useCallback(() => {
    if (!containerRef.current) return { width: 400, height: 300 }
    const rect = containerRef.current.getBoundingClientRect()
    return { width: rect.width, height: rect.height }
  }, [])

  // Physics simulation
  const updatePhysics = useCallback(() => {
    if (isDragging) return

    setPosition((prevPos) => {
      setVelocity((prevVel) => {
        const boundary = getBoundary()
        let newVel = { ...prevVel }
        let newPos = {
          x: prevPos.x + newVel.x,
          y: prevPos.y + newVel.y,
        }

        // Boundary collision detection and response
        if (newPos.x <= BALL_SIZE / 2) {
          newPos.x = BALL_SIZE / 2
          newVel.x = Math.abs(newVel.x) * bounceDamping
        } else if (newPos.x >= boundary.width - BALL_SIZE / 2) {
          newPos.x = boundary.width - BALL_SIZE / 2
          newVel.x = -Math.abs(newVel.x) * bounceDamping
        }

        if (newPos.y <= BALL_SIZE / 2) {
          newPos.y = BALL_SIZE / 2
          newVel.y = Math.abs(newVel.y) * bounceDamping
        } else if (newPos.y >= boundary.height - BALL_SIZE / 2) {
          newPos.y = boundary.height - BALL_SIZE / 2
          newVel.y = -Math.abs(newVel.y) * bounceDamping
        }

        // Apply friction
        newVel.x *= friction
        newVel.y *= friction // Stop very small movements
        if (Math.abs(newVel.x) < 0.01) newVel.x = 0 // Even lower threshold for more gradual stopping
        if (Math.abs(newVel.y) < 0.01) newVel.y = 0

        return newVel
      })

      return {
        x: Math.max(
          BALL_SIZE / 2,
          Math.min(getBoundary().width - BALL_SIZE / 2, prevPos.x + velocity.x),
        ),
        y: Math.max(
          BALL_SIZE / 2,
          Math.min(
            getBoundary().height - BALL_SIZE / 2,
            prevPos.y + velocity.y,
          ),
        ),
      }
    })
  }, [isDragging, velocity, getBoundary])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updatePhysics()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [updatePhysics])

  // Mouse/Touch event handlers
  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const startPos = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      }

      setIsDragging(true)
      setDragStart(startPos)
      setLastPosition(position)
      setLastTime(Date.now())
      setVelocity({ x: 0, y: 0 })
    },
    [position],
  )

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const currentPos = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      }

      const newPosition = {
        x: currentPos.x - dragStart.x + lastPosition.x,
        y: currentPos.y - dragStart.y + lastPosition.y,
      }

      // Calculate velocity for inertia
      const currentTime = Date.now()
      const deltaTime = currentTime - lastTime

      if (deltaTime > 0) {
        const newVelocity = {
          x:
            ((newPosition.x - position.x) / deltaTime) *
            velocityMultiplier *
            velocityScale,
          y:
            ((newPosition.y - position.y) / deltaTime) *
            velocityMultiplier *
            velocityScale,
        }
        setVelocity(newVelocity)
      }

      setPosition(newPosition)
      setLastTime(currentTime)
    },
    [isDragging, dragStart, lastPosition, position, lastTime],
  )

  const handleEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    },
    [handleMove],
  )

  const handleMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    },
    [handleMove],
  )

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      handleEnd()
    },
    [handleEnd],
  )

  // Global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
      document.addEventListener('touchend', handleTouchEnd, { passive: false })

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ])

  // Reset ball position
  const resetBall = () => {
    setPosition({ x: 200, y: 150 })
    setVelocity({ x: 0, y: 0 })
    setIsDragging(false)
  }

  // Add some random velocity for fun
  const throwBall = () => {
    setVelocity({
      x: (Math.random() - 0.5) * randomThrowPower,
      y: (Math.random() - 0.5) * randomThrowPower,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Drag & Drop Ball Physics Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Drag the ball around and release to see inertia in action. The ball
            bounces off boundaries with realistic physics.
          </p>
          <div className="space-x-4">
            <button
              onClick={resetBall}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Reset Position
            </button>
            <button
              onClick={throwBall}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Random Throw
            </button>
          </div>
        </div>

        {/* Physics Controls */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Physics Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Friction Control */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Friction: {(1 - friction).toFixed(4)} (
                {((1 - friction) * 100).toFixed(2)}% loss/frame)
              </label>
              <input
                type="range"
                min="0.9"
                max="0.999"
                step="0.001"
                value={friction}
                onChange={(e) => setFriction(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>High Friction</span>
                <span>Low Friction</span>
              </div>
            </div>

            {/* Bounce Damping Control */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Bounce Energy: {(bounceDamping * 100).toFixed(0)}% retained
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={bounceDamping}
                onChange={(e) => setBounceDamping(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Dead Bounce</span>
                <span>Perfect Bounce</span>
              </div>
            </div>

            {/* Velocity Scale Control */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sensitivity: {velocityScale.toFixed(2)}x
              </label>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={velocityScale}
                onChange={(e) => setVelocityScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            {/* Velocity Multiplier Control */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Response: {velocityMultiplier}x
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={velocityMultiplier}
                onChange={(e) =>
                  setVelocityMultiplier(parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Sluggish</span>
                <span>Responsive</span>
              </div>
            </div>

            {/* Random Throw Power Control */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Throw Power: {randomThrowPower}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={randomThrowPower}
                onChange={(e) => setRandomThrowPower(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Gentle</span>
                <span>Powerful</span>
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quick Presets
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setFriction(0.995)
                    setBounceDamping(0.8)
                    setVelocityScale(0.15)
                    setVelocityMultiplier(10)
                    setRandomThrowPower(8)
                  }}
                  className="w-full text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded transition-colors"
                >
                  Default
                </button>
                <button
                  onClick={() => {
                    setFriction(0.99)
                    setBounceDamping(0.6)
                    setVelocityScale(0.1)
                    setVelocityMultiplier(8)
                    setRandomThrowPower(5)
                  }}
                  className="w-full text-xs bg-green-100 hover:bg-green-200 text-green-800 py-1 px-2 rounded transition-colors"
                >
                  Realistic
                </button>
                <button
                  onClick={() => {
                    setFriction(0.999)
                    setBounceDamping(0.95)
                    setVelocityScale(0.3)
                    setVelocityMultiplier(15)
                    setRandomThrowPower(15)
                  }}
                  className="w-full text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 py-1 px-2 rounded transition-colors"
                >
                  Bouncy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            ref={containerRef}
            className="relative w-[500px] h-[400px] bg-gray-900 rounded-lg shadow-lg border-4 border-gray-700 overflow-hidden"
            style={{
              userSelect: 'none',
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '25px 25px',
            }}
          >
            {/* Corner grid markers */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-white opacity-30" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-white opacity-30" />
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-white opacity-30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-white opacity-30" />

            {/* Boundary indicators */}
            <div className="absolute inset-2 border border-dashed border-white border-opacity-20 pointer-events-none" />

            {/* Ball */}
            <div
              ref={ballRef}
              className={`absolute w-10 h-10 rounded-full cursor-grab transition-shadow duration-200 ${
                isDragging
                  ? 'cursor-grabbing shadow-lg scale-110'
                  : 'shadow-md hover:shadow-lg'
              }`}
              style={{
                left: position.x - BALL_SIZE / 2,
                top: position.y - BALL_SIZE / 2,
                background: `radial-gradient(circle at 30% 30%, #ff6b6b, #ee5a52)`,
                transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                transition: isDragging ? 'none' : 'transform 0.2s ease',
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {/* Ball highlight */}
              <div className="absolute top-1 left-1 w-3 h-3 bg-white opacity-40 rounded-full" />
            </div>

            {/* Velocity indicator */}
            {(velocity.x !== 0 || velocity.y !== 0) && !isDragging && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: position.x - 2,
                  top: position.y - 2,
                  width: 4,
                  height: 4,
                }}
              >
                <div
                  className="absolute bg-cyan-400 opacity-80 shadow-lg"
                  style={{
                    width: 3,
                    height: Math.abs(velocity.y) * 8, // Scaled up for visibility
                    left: 0.5,
                    top: velocity.y > 0 ? 2 : -Math.abs(velocity.y) * 8,
                    transformOrigin: 'bottom',
                  }}
                />
                <div
                  className="absolute bg-cyan-400 opacity-80 shadow-lg"
                  style={{
                    height: 3,
                    width: Math.abs(velocity.x) * 8, // Scaled up for visibility
                    top: 0.5,
                    left: velocity.x > 0 ? 2 : -Math.abs(velocity.x) * 8,
                    transformOrigin: 'left',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Physics Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Drag & Drop</h3>
              <p>
                Click and drag the ball around the boundary. Works with mouse
                and touch.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Inertia</h3>
              <p>
                Release the ball while moving to see realistic momentum and
                continuation of motion.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Boundary Collision
              </h3>
              <p>
                Ball bounces off walls with energy loss, creating realistic
                physics behavior.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Friction</h3>
              <p>
                Motion gradually slows down due to friction, eventually coming
                to rest.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Current Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                Position: ({Math.round(position.x)}, {Math.round(position.y)})
              </div>
              <div>
                Velocity: ({velocity.x.toFixed(1)}, {velocity.y.toFixed(1)})
              </div>
              <div>State: {isDragging ? 'Dragging' : 'Free'}</div>
              <div>
                Speed: {Math.sqrt(velocity.x ** 2 + velocity.y ** 2).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
