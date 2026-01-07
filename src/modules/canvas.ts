class canvas {
  strokes: Stroke[]
  backgroundColor: string

  constructor() {
    this.strokes = []
    this.backgroundColor = '#FFFFFF'
  }

  addStroke(stroke: Stroke): void {
    this.strokes.push(stroke)
  }

  clearCanvas(): void {
    this.strokes = []
  }
}

interface Stroke {
  color: string
  size: number
  points: { x: number; y: number }[]
  tool: ToolType
}

type ToolType = 'brush' | 'eraser'
