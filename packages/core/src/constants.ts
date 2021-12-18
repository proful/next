/* eslint-disable @typescript-eslint/no-explicit-any */
import { TLResizeCorner, TLResizeEdge, TLSelectionHandle, TLCursor, TLRotateCorner } from '~types'

export const PI = Math.PI
export const TAU = PI / 2
export const PI2 = PI * 2
export const EPSILON = Math.PI / 180

export const FIT_TO_SCREEN_PADDING = 100

export const EMPTY_OBJECT: any = {}
export const EMPTY_ARRAY: any[] = []

// export const CURSORS = {
//   canvas: 'default',
//   grab: 'grab',
//   grabbing: 'grabbing',
//   [TLResizeCorner.TopLeft]: 'resize-nwse',
//   [TLResizeCorner.TopRight]: 'resize-nesw',
//   [TLResizeCorner.BottomRight]: 'resize-nwse',
//   [TLResizeCorner.BottomLeft]: 'resize-nesw',
//   [TLResizeEdge.Top]: 'resize-ns',
//   [TLResizeEdge.Right]: 'resize-ew',
//   [TLResizeEdge.Bottom]: 'resize-ns',
//   [TLResizeEdge.Left]: 'resize-ew',
// }

export const CURSORS: Record<TLSelectionHandle, TLCursor> = {
  [TLResizeEdge.Bottom]: TLCursor.NsResize,
  [TLResizeEdge.Top]: TLCursor.NsResize,
  [TLResizeEdge.Left]: TLCursor.EwResize,
  [TLResizeEdge.Right]: TLCursor.EwResize,
  [TLResizeCorner.BottomLeft]: TLCursor.NeswResize,
  [TLResizeCorner.BottomRight]: TLCursor.NwseResize,
  [TLResizeCorner.TopLeft]: TLCursor.NwseResize,
  [TLResizeCorner.TopRight]: TLCursor.NeswResize,
  [TLRotateCorner.BottomLeft]: TLCursor.SwneRotate,
  [TLRotateCorner.BottomRight]: TLCursor.SenwRotate,
  [TLRotateCorner.TopLeft]: TLCursor.NwseRotate,
  [TLRotateCorner.TopRight]: TLCursor.NeswRotate,
  rotate: TLCursor.Rotate,
  center: TLCursor.Grab,
  background: TLCursor.Grab,
}
