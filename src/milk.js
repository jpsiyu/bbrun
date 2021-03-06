import drawing from './drawing'
import tool from './tool'
import Element from './element'

class Milk extends Element {
    constructor(x, y) {
        const radius = tool.gridSize() / 3
        super(x, y, radius)
        this.img = GameGlobal.g.resMgr.getImg('milk')
    }

    update() { }

    draw(context) {
        context.save()
        context.translate(this.x, this.y)
        drawing.drawImg(context, -this.radius, -this.radius, this.radius, this.img)
        context.restore()
    }

}

export default Milk