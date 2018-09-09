
class ResMgr {
    constructor() {
        this.names= [
            'door',
            'fence',
            'milk',
            'drink',
            'catched',
            'mom-run',
            'child-roll',
            'sky',
            'grassland',
            'warrior',
            'ball',
            'hole',
            'eye',
            'shield',
        ]
        this.images = {}
    }

    loadRes(callback){
        this.loadImgs( callback)
    }

    loadImgs(callback) {
        let loadNum = 0
        this.names.forEach(name => {
            const img = wx.createImage()
            const path = `images/${name}.png`
            img.onload = () => {
                this.images[name] = img
                loadNum++
                if(loadNum === this.names.length)
                    callback()
            }
            img.src = path
        })
    }

    getImg(name){
        return this.images[name]
    }
}

export default ResMgr