/**
 * @vitest-environment happy-dom
 */

import {describe, it, expect} from "vitest"
import {mount, shallowMount} from '@vue/test-utils'
import AssetSelector from "./AssetSelector.vue";
import {defineComponent, nextTick, reactive} from "vue";

describe('AssetSelector Tests', () => {
    it('should filter type', async () => {
        const TestComponent = defineComponent({
            components: {AssetSelector},
            template: '<suspense><asset-selector></asset-selector></suspense>'
        })

        const state = reactive({
            globalKey: 'c',
        })

        const wrapper = mount(TestComponent, {
            global: {
                provide: {
                    store: {
                        state: state,
                    }
                }
            }
        })


    })
})