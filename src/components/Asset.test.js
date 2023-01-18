/**
 * @vitest-environment happy-dom
 */

import {describe, it, expect} from "vitest"
import {mount} from '@vue/test-utils'
import Asset from "./Asset.vue";

describe('Asset Tests', () => {

    it('should work for units', () => {
        let valueone = 5
        let valuetwo = 5

        expect(valueone).equals(valuetwo)
    })
})