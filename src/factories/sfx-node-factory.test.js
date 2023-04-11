
import {beforeEach, describe, it, expect} from "vitest"
import SFXNodeFactory from "../factories/sfx-node-factory";

describe('FXColorGenerator Tests', () => {
    let sfxNodeFactory = new SFXNodeFactory()

    it('should return sfxNode by type', async () => {
        const nodeName = 'BigMuff'
        const sfxNode = sfxNodeFactory.getNodeByType('BigMuff')
        expect(sfxNode.name).to.equal(nodeName)
    })

})
