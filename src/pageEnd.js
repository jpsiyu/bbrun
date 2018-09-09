import tool from './tool'
import macro from './macro'

class PageEnd {
    constructor() {
        this.bgWidth = tool.gameWidth() / 2
        this.bgHeight = tool.gameHeight() / 2
        this.btnRadius = tool.gridSize() / 1.5

        this.offset = { x: tool.gridSize(), y: 0 }
        this.btnQuitPos = { x: tool.gameWidth() / 2 - this.offset.x, y: tool.gameHeight()/2 }
        this.btnRestartPos = { x: tool.gameWidth() / 2 + this.offset.x, y: tool.gameHeight()/2 }

        this.fontSize = 34

        this.onTouchStart = this.onTouchStart.bind(this)
        GameGlobal.g.gameEventListener.register(macro.EventTouchStart, this, this.onTouchStart)
    }

    draw(context) {
        this.drawBg(context)
        this.drawBtnRestart(context)
        this.drawBtnQuit(context)
    }

    drawBg(context) {
        context.save()
        context.beginPath()
        const x = tool.gameWidth() / 2 - this.bgWidth / 2
        const y = tool.gameHeight() / 2 - this.bgHeight / 2
        context.fillStyle = 'orange'
        context.rect(x, y, this.bgWidth, this.bgHeight)
        context.fill()
        context.restore()
    }

    drawBtnRestart(context) {
        context.save()
        context.beginPath()
        context.strokeStyle = 'white'
        context.fillStyle = 'black'
        context.arc(this.btnRestartPos.x, this.btnRestartPos.y, this.btnRadius, 0, 2 * Math.PI)
        context.fill()

        context.beginPath()
        context.fillStyle = 'white'
        context.textAlign = 'center'
        context.font = `${this.fontSize}px Arial`
        context.fillText('↺',this.btnRestartPos.x, this.btnRestartPos.y + this.fontSize/2.5)
        context.fill()

        context.restore()
    }

    drawBtnQuit(context) {
        context.save()
        context.beginPath()
        context.strokeStyle = 'white'
        context.fillStyle = 'black'
        context.arc(this.btnQuitPos.x, this.btnQuitPos.y, this.btnRadius, 0, 2 * Math.PI)
        context.fill()

        context.beginPath()
        context.fillStyle = 'white'
        context.textAlign = 'center'
        context.font = `${this.fontSize}px Arial`
        context.fillText('⏎',this.btnQuitPos.x, this.btnQuitPos.y + this.fontSize/2.5)
        context.fill()

        context.restore()
    }

    onTouchStart(args){
        if(GameGlobal.g.gameState != macro.StateGameOver) return
        const pos = args.pos
        if (!pos) return

        if(tool.distancePos(pos, this.btnQuitPos) < this.btnRadius)
            GameGlobal.g.gameEventListener.dispatch(macro.EventReady)

        if(tool.distancePos(pos, this.btnRestartPos) < this.btnRadius)
            GameGlobal.g.gameEventListener.dispatch(macro.EventRestart)

    }
}

export default PageEnd