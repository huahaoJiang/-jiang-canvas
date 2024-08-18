import NotFound from '@/assets/images/404.png'
import Logo from '@/assets/images/logo.png'

export const animateTime = 15

export const opacityStep = 1 / animateTime

export const Radius = 14

export const Inten = 0.98

export const IMAGE_VIEW_HEIGHT = 300

export const DEFAULT_IMAGE_LIST = [
  { label: 'jianghh', url: Logo },
  { label: 'notFound', url: NotFound }
]

export function genRandom(min: number, max: number) {
  return ~~(Math.random() * (max - min + 1)) + min
}
