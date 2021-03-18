import checkPointInPolygon from "robust-point-in-polygon";

export class Lasso {
    constructor(netv, configs) {
        this.$_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        this.$_core = netv
        netv.$_container.prepend(this.$_svg)
        this.$_svg.setAttribute('id', 'lasso-svg')
        this.$_svg.setAttribute('width', netv.$_configs.width)
        this.$_svg.setAttribute('height', netv.$_configs.height)
        netv.$_container.style.position = 'relative'
        netv.$_container.style.overflow = 'hidden'
        netv.$_container.style.width = netv.$_configs.width
        netv.$_container.style.height = netv.$_configs.height
        this.$_svg.style.position = 'absolute'
        this.$_svg.style.zIndex = '20'
        this.$_svg.style.overflow = 'visible'
        this.$_svg.style.pointerEvents = 'none' // initially disabled

        this._multiSelectKey = (configs && configs.multiSelectKey) || 'Shift'
        this._multiSelect = false

        this._width = netv.$_configs.width
        this._height = netv.$_configs.height
        this._closeDistance = 100

        this._paths = []
        this._pathPoints = []
        this._selectedItems = []

        this._selectedCallback = null

        this._keyDownListener = this._onKeyDown.bind(this)
        this._keyUpListener = this._onKeyUp.bind(this)
        window.addEventListener('keydown', this._keyDownListener)
        window.addEventListener('keyup', this._keyUpListener)

        this.$_svg.addEventListener('mousedown', this._onMouseDown.bind(this))
        this.$_svg.addEventListener('mousemove', this._onMouseMove.bind(this))
        this.$_svg.addEventListener('mouseup', this._onMouseUp.bind(this))

        // check config to decide enable it or not
        if (configs && configs.enable === true) {
            this.enable()
        }
    }

    dispose() {
        window.removeEventListener('keydown', this._keyDownListener)
        window.removeEventListener('keyup', this._keyUpListener)
        this.$_svg.remove()
    }

    enable() {
        this.$_svg.style.pointerEvents = 'visible'
    }

    disable() {
        this.$_svg.style.pointerEvents = 'none'
    }

    closeDistance(distance) {
        this._closeDistance = distance
    }

    onSelected(callback) {
        this._selectedCallback = callback
    }

    _onMouseDown(evt) {
        this._selecting = true
        this._path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this._path.setAttribute('fill', 'rgba(200, 200, 200, 0.2)'); // TODO: fill
        this._path.setAttribute('stroke', 'black');
        this._path.setAttribute('stroke-width', 2);
        this._path.setAttribute('stroke-linejoin', 'round');
        this._path.setAttribute('stroke-linecap', 'round');
        this.$_svg.appendChild(this._path);

        const x = evt.offsetX
        const y = evt.offsetY
        this._pathPoints = [[x, y]]
        this._pathD = `M${x},${y}L${x},${y}`
        this._path.setAttribute('d', this._pathD);
    }

    _onMouseMove(evt) {
        if (!this._selecting) return
        // TODO: need smooth
        const x = evt.offsetX
        const y = evt.offsetY
        this._pathPoints.push([x, y])
        this._pathD += ` ${x},${y}`
        this._path.setAttribute('d', this._pathD);
    }

    _onMouseUp(evt) {
        this._selecting = false
        this._getSelectedItems()
        if (this._multiSelect) {
            this._paths.push(this._path)
        } else {
            this._path.remove()
            this._selectedCallback && this._selectedCallback(this._selectedItems)
            this._selectedItems = []
        }
    }

    _onKeyDown(evt) {
        if (evt.key === this._multiSelectKey) {
            this._multiSelect = true
        }
    }

    _onKeyUp(evt) {
        if (evt.key === this._multiSelectKey) {
            this._multiSelect = false

            this._paths.forEach(path => path.remove())
            this._selectedCallback && this._selectedCallback(this._selectedItems)
            this._selectedItems = []
        }
    }

    _getSelectedItems() {
        const start = this._pathPoints[0]
        const end = this._pathPoints[this._pathPoints.length - 1]
        const distanceSqare = (start[0] - end[0]) ** 2 + (start[1] - end[1]) ** 2
        if (distanceSqare > this._closeDistance * this._closeDistance) {
            return
        }

        const items = this.$_core.nodes()
        const dataTransform = this.$_core.transform()
        // TODO: consider on border condition
        this._selectedItems.push(...items.filter(item => {
            const x = item.x() * dataTransform.k + dataTransform.x
            const y = item.y() * dataTransform.k + dataTransform.y
            return (checkPointInPolygon(this._pathPoints, [x, y]) < 0)
        }))
    }
}