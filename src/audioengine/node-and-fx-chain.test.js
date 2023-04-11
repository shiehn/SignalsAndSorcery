
import {beforeEach, describe, it, expect} from "vitest"
import NodeAndFxChain from "./node-and-fx-chain";

describe('NodeAndFxChain Tests', () => {
    const nodeAndFxChain = new NodeAndFxChain()

    it('should add root node', async () => {
        nodeAndFxChain.addRootNode({})
        expect(nodeAndFxChain).to.not.equal(undefined)
    })

})