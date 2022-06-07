/**
 * @vitest-environment happy-dom
 */

import {describe, it, expect} from "vitest"
import {mount, shallowMount} from '@vue/test-utils'
import AssetSelector from "./AssetSelector.vue";
import {defineComponent, nextTick, reactive} from "vue";

describe('AssetSelector Tests', () => {
    it('should filter type', async () => {
        const state = reactive({
            globalKey: 'c',
        })

        const wrapper = mount(AssetSelector, {
            global: {
                provide: {
                    store: {
                        state: state,
                    }
                }
            }
        })

        // nextTick()
        //
        // const text = wrapper.text()
        // expect(text).toContain('dm:c:e:fm')
    })
})