import { ToolOptions, ToolType } from '..'

import { Cursor } from './Cursor'
import { Pen } from './Pen'
import { Marker } from './Marker'
import { Erase } from './Erase'
import { Line } from './Line'
import { Rect } from './Rect'
import { Arc } from './Arc'

export let tools: Record<string, ToolOptions> = { Cursor, Pen, Marker, Erase, Line, Rect, Arc }
