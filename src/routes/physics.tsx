import { createFileRoute } from '@tanstack/react-router'
import { DragDropBallDemo } from '../components/DragDropBallDemo'

export const Route = createFileRoute('/physics')({
  component: Physics,
})

function Physics() {
  return <DragDropBallDemo />
}
