import {beforeEach, describe, it, expect} from "vitest"
import FXColorGenerator from "./fx-color-generator";

describe('FXColorGenerator Tests', () => {
    let fxColorGenerator = new FXColorGenerator()

    it('should return the same color for the same ID', async () => {
        let fxId = 14

        const color1 = fxColorGenerator.getFxColor(fxId)
        const color2 = fxColorGenerator.getFxColor(fxId)

        expect(color1).to.not.equals(undefined)
        expect(color1).to.equals(color2)
    })

    it('should return a color in the correct format', async () => {
        let fxId = 1

        const color1 = fxColorGenerator.getFxColor(fxId)

        expect(color1).to.contain('bg-')
    })
})
