import tool from './tool'
import macro from './macro';

class PageReady {
    constructor() {
        this.fontSize = 36
        this.text = 'Start Game'
        this.onTouchStart = this.onTouchStart.bind(this)
        GameGlobal.g.gameEventListener.register(macro.EventTouchStart, this, this.onTouchStart)

    }

    initPos(context) {
        const tw = context.measureText(this.text).width + 50
        this.startRect = {
            x: tool.gameWidth() / 2 - tw / 2,
            y: tool.gameHeight() / 2 - this.fontSize / 2,
            w: tw,
            h: this.fontSize + 20
        }

    }


    draw(context) {
        context.save()
        context.beginPath()
        context.fillStyle = 'white'
        context.font = `${this.fontSize}px Arial`
        context.textAlign = 'center'
        context.fillText(this.text, tool.gameWidth() / 2, tool.gameHeight() / 2 + this.fontSize / 2)

        this.initPos(context)
        context.beginPath()
        context.strokeStyle = 'white'
        context.rect(this.startRect.x, this.startRect.y, this.startRect.w, this.startRect.h)
        context.stroke()
        context.restore()
    }

    onTouchStart(args) {
        if(GameGlobal.g.gameState != macro.StateReady) return
        const pos = args.pos
        if (pos && this.startRect) {
            if (pos.x < this.startRect.x + this.startRect.w
                && pos.x > this.startRect.x
                && pos.y < this.startRect.y + this.startRect.h
                && pos.y > this.startRect.y) {
                GameGlobal.g.gameEventListener.dispatch(macro.EventRestart)
            }
        }
    }

}

export default PageReady