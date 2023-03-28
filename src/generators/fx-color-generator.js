export default class FXColorGenerator {

    constructor() {
        this.fxToColorMap = {}
        this.tailwindColors = [
            'red',
            'pink',
            'purple',
            'orange',
            'amber',
            'yellow',
            'lime',
            'green',
            'emerald',
            'teal',
            'cyan',
            'sky',
            'blue',
            'indigo',
            'violet',
            'fuchsia',
            'rose',
        ]
    }

    getFxColor = (fxId) => {

        const color = this.fxToColorMap[fxId]
        if (color) {
            return color
        }

        const newColor = `bg-${this.generateColorName()}-${this.generateColorNumber()}`
        this.fxToColorMap[fxId] = newColor

        return newColor
    }

    generateColorName = () => {
        return this.tailwindColors[Math.floor(Math.random() * this.tailwindColors.length)];
    }

    generateColorNumber = () => {
        return (Math.floor(Math.random() * 5) + 2) * 100
    }
}