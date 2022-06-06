/**
 * @vitest-environment happy-dom
 */

import {describe, it, expect} from "vitest"
import {mount} from '@vue/test-utils'
import Asset from "./Asset.vue";

describe('Asset Tests', () => {
    it('should render', async() => {
        const wrapper = mount(Asset, {
            props: {
                stem: {
                    waveform: 'xxx.wav',
                    chords: 'dm:c:e:fm',
                }
            }
        })

        const text = wrapper.text()
        expect(text).toContain('dm:c:e:fm')
    })


    it('should work for units', () => {
        let valueone = 5
        let valuetwo = 5

        expect(valueone).equals(valuetwo)
    })
})