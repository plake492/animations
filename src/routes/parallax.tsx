import { createFileRoute } from '@tanstack/react-router'
import { ParallaxDemo } from '../components/ParallaxDemo'

export const Route = createFileRoute('/parallax')({
  component: Parallax,
})

function Parallax() {
  return <ParallaxDemo />
}
