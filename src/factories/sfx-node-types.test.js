import {beforeEach, describe, it, expect} from "vitest"
import SFXNodeTypes from "./sfx-node-types";

describe('SFXNodeTypes Tests', () => {
    let sfxNodeFactory = new SFXNodeTypes()

    it('should find node type by name', async () => {
        const nodeName = 'BigMuff'
        const sfxNode = sfxNodeFactory.getNodeTypeByName('BigMuff')
        expect(sfxNode.name).to.equal(nodeName)
    })

    it('should not find node type by name', async () => {
        const nodeName = 'FakeNodeName'
        const sfxNode = sfxNodeFactory.getNodeTypeByName(nodeName)
        expect(sfxNode).to.equal(undefined)
    })
})