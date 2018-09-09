import macro from './macro'

const resizeCanvas = (ScreenW, canvas, gridInRow=12) => {
    let gw, gh
    gw = ScreenW
    gh = gw / macro.WidthHeightRatio
    const size = gw / gridInRow
    gh -= gh % size

    canvas.width = gw
    canvas.height = gh
}

const grid2coord = (row, col) => {
    const x = gridSize() / 2 + col * gridSize()
    const y = gridSize() / 2 + row * gridSize()
    return { x, y }
}

const maxRow = () => {
    const size = gridSize()
    return gameHeight() / size - 1
}

const maxCol = () => {
    const size = gridSize()
    return gameWidth() / size - 1
}

const distance = (obj1, obj2) => {
    const dis = Math.sqrt(
        Math.pow((obj1.x - obj2.x), 2) + Math.pow((obj1.y - obj2.y), 2)
    )
    return dis
}

const distancePos = (pos1, pos2) => {
    const dis = Math.sqrt(
        Math.pow((pos1.x - pos2.x), 2) + Math.pow((pos1.y - pos2.y), 2)
    )
    return dis
}

const gridSize = () => {
    return GameGlobal.g.map.gridSize
}

const viewUnit = () => {
    const context = GameGlobal.g.context
    return context.canvas.height / 8
}

const gameWidth = () => {
    const context = GameGlobal.g.context
    return context.canvas.width
}

const gameHeight = () => {
    const context = GameGlobal.g.context
    return context.canvas.height
}

const isSmartPhone = () => {
    return (typeof GameGlobal.orientation !== 'undefined') 
}

export default {
    resizeCanvas,
    grid2coord,
    maxRow,
    maxCol,
    distance,
    distancePos,
    gridSize,
    viewUnit,
    gameWidth,
    gameHeight,
    isSmartPhone,
}