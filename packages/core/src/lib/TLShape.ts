/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  intersectLineSegmentBounds,
  intersectLineSegmentPolyline,
  intersectPolygonBounds,
} from '@tldraw/intersect'
import Vec from '@tldraw/vec'
import { action, computed, makeObservable, observable } from 'mobx'
import type { TLBounds, AnyObject, TLBoundsCorner, TLBoundsEdge } from '~types'
import type { TLHandle } from '~types/TLHandle'
import { BoundsUtils, PointUtils, assignOwnProps } from '~utils'
import { deepCopy } from '~utils/DataUtils'

export type TLSerializedShape<P = AnyObject> = TLShapeProps & {
  type: string
  nonce?: number
} & P

export interface TLShapeConstructor<S extends TLShape = TLShape> {
  new (props: any): S
  id: string
}

export interface TLShapeProps {
  id: string
  parentId: string
  point: number[]
  rotation?: number
  name?: string
  isGhost?: boolean
  isHidden?: boolean
  isLocked?: boolean
  isGenerated?: boolean
  isAspectRatioLocked?: boolean
}

export interface TLResizeInfo<P = any> {
  type: TLBoundsEdge | TLBoundsCorner
  scale: number[]
  transformOrigin: number[]
  initialShape: TLSerializedShape<P>
}

export interface TLHandleChangeInfo<P = any> {
  index: number
  delta: number[]
  initialShape: TLSerializedShape<P>
}

export type TLCustomProps<P extends AnyObject = any> = TLShapeProps & Partial<P>

export const defaultPropKeys = [
  'type',
  'nonce',
  'parentId',
  'point',
  'name',
  'rotation',
  'isGhost',
  'isHidden',
  'isLocked',
  'isGenerated',
  'isAspectRatioLocked',
]

export abstract class TLShape<P = any, M = any> implements TLShapeProps {
  constructor(props: TLShapeProps & Partial<P>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const type = this.constructor['id']
    this.type = type
    this.init(props)
    makeObservable(this)
  }

  static type: string

  protected propsKeys = new Set<string>(defaultPropKeys)

  private version = 1
  readonly stayMounted: boolean = false
  readonly showCloneHandles: boolean = false
  readonly hideResizeHandles: boolean = false
  readonly hideRotateHandle: boolean = false
  readonly hideContextBar: boolean = false
  readonly hideBoundsDetail: boolean = false
  readonly hideBounds: boolean = false
  readonly isEditable: boolean = false
  readonly isStateful: boolean = false
  readonly aspectRatio?: number
  readonly type: string
  readonly id: string = 'id'
  nonce = 0
  isDirty = false
  private lastSerialized = {} as TLSerializedShape<P>

  @observable parentId = 'parentId'
  @observable point: number[] = [0, 0]
  @observable name?: string = 'Shape'
  @observable rotation?: number
  @observable isGhost?: boolean
  @observable isHidden?: boolean
  @observable isLocked?: boolean
  @observable isGenerated?: boolean
  @observable isAspectRatioLocked?: boolean

  abstract getBounds: () => TLBounds

  protected init = (props: TLShapeProps & Partial<P>, propKeys: string[] = []) => {
    assignOwnProps(this, props)
    const keys = [...propKeys, ...Object.keys(props)]
    keys.forEach(key => this.propsKeys.add(key))
    this.lastSerialized = this.getSerialized()
    makeObservable(this)
  }

  getCenter = () => {
    return BoundsUtils.getBoundsCenter(this.bounds)
  }

  getRotatedBounds = () => {
    const { bounds, rotation } = this
    if (!rotation) return bounds
    return BoundsUtils.getBoundsFromPoints(BoundsUtils.getRotatedCorners(bounds, rotation))
  }

  hitTestPoint = (point: number[]): boolean => {
    const ownBounds = this.rotatedBounds

    if (!this.rotation) {
      return PointUtils.pointInBounds(point, ownBounds)
    }

    const corners = BoundsUtils.getRotatedCorners(ownBounds, this.rotation)

    return PointUtils.pointInPolygon(point, corners)
  }

  hitTestLineSegment = (A: number[], B: number[]): boolean => {
    const box = BoundsUtils.getBoundsFromPoints([A, B])
    const { rotatedBounds, rotation = 0 } = this

    return BoundsUtils.boundsContain(rotatedBounds, box) || rotation
      ? intersectLineSegmentPolyline(A, B, BoundsUtils.getRotatedCorners(this.bounds)).didIntersect
      : intersectLineSegmentBounds(A, B, rotatedBounds).length > 0
  }

  hitTestBounds = (bounds: TLBounds): boolean => {
    const { rotatedBounds, rotation = 0 } = this
    const corners = BoundsUtils.getRotatedCorners(this.bounds, rotation)
    return (
      BoundsUtils.boundsContain(bounds, rotatedBounds) ||
      intersectPolygonBounds(corners, bounds).length > 0
    )
  }

  onResize = (bounds: TLBounds, info: TLResizeInfo<P>) => {
    this.update({ point: [bounds.minX, bounds.minY] })
    return this
  }

  onResizeStart?: () => void

  @computed get center(): number[] {
    return this.getCenter()
  }

  @computed get bounds(): TLBounds {
    return this.getBounds()
  }

  @computed get rotatedBounds(): TLBounds {
    return this.getRotatedBounds()
  }

  getSerialized = (): TLSerializedShape<P> => {
    const propKeys = Array.from(this.propsKeys.values()) as (keyof TLShapeProps & P)[]
    return deepCopy(
      Object.fromEntries(propKeys.map(key => [key, this[key]]))
    ) as TLSerializedShape<P>
  }

  protected getCachedSerialized = (): TLSerializedShape<P> => {
    if (this.isDirty) {
      this.nonce++
      this.isDirty = false
      this.lastSerialized = this.getSerialized()
    }
    return this.lastSerialized
  }

  get serialized(): TLSerializedShape<P> {
    return this.getCachedSerialized()
  }

  validateProps = (
    props: Partial<TLShapeProps> & Partial<P>
  ): Partial<TLShapeProps> & Partial<P> => {
    return props
  }

  @action update = (props: Partial<TLShapeProps> | Partial<P>, isDeserializing = false) => {
    if (!(isDeserializing || this.isDirty)) this.isDirty = true
    Object.assign(this, this.validateProps(props as Partial<TLShapeProps> & Partial<P>))
    return this
  }

  clone = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new this.constructor(this.serialized)
  }
}

export abstract class TLShapeWithHandles<
  P extends { handles: TLHandle[] } = any,
  H extends TLHandle = TLHandle,
  M = any
> extends TLShape<P, M> {
  protected propsKeys = new Set<string>([
    'type',
    'nonce',
    'parentId',
    'point',
    'name',
    'rotation',
    'handles',
    'isGhost',
    'isHidden',
    'isLocked',
    'isGenerated',
    'isAspectRatioLocked',
  ])

  @observable handles: TLHandle[] = []

  onHandleChange = ({ initialShape, delta, index }: TLHandleChangeInfo<P>) => {
    const nextHandles = [...initialShape.handles]
    nextHandles[index] = {
      ...nextHandles[index],
      point: Vec.add(delta, initialShape.handles[index].point),
    }
    const topLeft = BoundsUtils.getCommonTopLeft(nextHandles.map(h => h.point))
    this.update({
      point: Vec.add(initialShape.point, topLeft),
      handles: nextHandles.map(h => ({ ...h, point: Vec.sub(h.point, topLeft) })),
    })

    // const { shape, initialShape, handles } = this
    // handles[index].point = Vec.add(delta, initialHandles[index].point)
    // const topLeft = BoundsUtils.getCommonTopLeft(handles.map((h) => h.point))
    // shape.update({
    //   point: Vec.add(initialTopLeft, topLeft),
    //   handles: handles.map((h) => ({ ...h, point: Vec.sub(h.point, topLeft) })),
    // })
  }
}

export abstract class TLShapeWithChildren<
  P extends { children: TLShape[] } = any,
  M = any
> extends TLShape<P, M> {
  protected propsKeys = new Set<string>([
    'type',
    'nonce',
    'parentId',
    'point',
    'name',
    'rotation',
    'children',
    'isGhost',
    'isHidden',
    'isLocked',
    'isGenerated',
    'isAspectRatioLocked',
  ])

  @observable children: TLShape[] = []
}
