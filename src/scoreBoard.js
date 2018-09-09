
class ScoreBoard {
    constructor() {
        this.maxWidth = 200
    }

    update(elapsed) {

    }

    draw(context) {
        this.drawBg(context)
        this.drawText(context)
    }

    drawText(context) {
        context.save()
        context.beginPath()
        context.fillStyle = 'white'
        const fontSize = 24
        context.font = `${fontSize}px Arial`
        const text = `lv:${GameGlobal.g.gameLv} score:${GameGlobal.g.gameScore}`
        context.fillText(text, 10, fontSize, this.maxWidth)
        context.restore()

    }

    drawBg(context) {
        context.save()
        context.beginPath()
        context.fillStyle = 'green'
        context.rect(0, 0, this.maxWidth, 30)
        context.fill()
        context.restore()
    }
}

export default ScoreBoard