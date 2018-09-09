import Global from './src/global'
import MainScene from './src/mainScene'
import macro from './src/macro'
import tool from './src/tool'

const initContext = () => {
    //screen canvas
    const screenCanvas = wx.createCanvas()
    const screenContext = screenCanvas.getContext('2d')
    const W = Math.max(screenCanvas.width, screenCanvas.height)
    const H = Math.min(screenCanvas.width, screenCanvas.height)
    screenCanvas.width = Math.max(W, H)
    screenCanvas.height = Math.min(W, H)

    //game canvas
    const gameCanvas = wx.createCanvas()
    tool.resizeCanvas(W, gameCanvas)
    const gameContext = gameCanvas.getContext('2d')
    return {screenContext, gameContext}
}

const start = () => {
    const {screenContext, gameContext} = initContext()
    const marginTop = (screenContext.canvas.height - gameContext.canvas.height)/2

    const global = new Global(screenContext, gameContext)
    GameGlobal.g = global
    global.setMarginTop(marginTop)
    global.initMap()


    global.resMgr.loadRes(() => {
        const mainScene = new MainScene(gameContext)
        mainScene.readyForGame()
    })

    wx.onTouchStart(event => {
        const touch = event.touches[0]
        const pos = { x: touch.clientX, y: touch.clientY - marginTop}
        global.gameEventListener.dispatch(macro.EventTouchStart, { pos: pos })
    })
}

start()