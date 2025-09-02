import { createFileRoute } from '@tanstack/react-router'
import { AnimationDemo } from '../components/AnimationDemo'

export const Route = createFileRoute('/demo')({
  component: Demo,
})

function Demo() {
  return <AnimationDemo />
}
