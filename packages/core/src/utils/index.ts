import { nanoid } from 'nanoid'
export * from './BoundsUtils'
export * from './PointUtils'
export * from './KeyUtils'
export * from './GeomUtils'
export * from './PolygonUtils'
export * from './SvgPathUtils'
export * from './DataUtils'

export function uniqueId() {
  return nanoid()
}

export function assignOwnProps(obj: { [key: string]: any }, props: { [key: string]: any }) {
  Object.assign(obj, Object.fromEntries(Object.entries(props).filter(([key]) => key in obj)))
}

// via https://github.com/bameyrick/throttle-typescript
export function throttle<T extends (...args: any) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T> {
  let inThrottle: boolean
  let lastResult: ReturnType<T>

  return function (this: any, ...args: any[]): ReturnType<T> {
    if (!inThrottle) {
      inThrottle = true

      setTimeout(() => (inThrottle = false), limit)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      lastResult = func(...args)
    }

    return lastResult
  }
}
