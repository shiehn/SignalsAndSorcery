/**
 * @vitest-environment happy-dom
 */

import {describe, it, expect} from "vitest"
import {mount, shallowMount} from '@vue/test-utils'
import GlobalTrackValues from "./GlobalTrackValues.vue";
import {nextTick, reactive} from "vue";

describe('GlobalTrackValues Tests', () => {

    it('should renderBuffer bpm', async () => {

        const initialBpm = 74
        const updatedBpm = 66

        const state = reactive({
            globalBpm: initialBpm,
        })

        const wrapper = mount(GlobalTrackValues, {
            global: {
                provide: {
                    store: {
                        state: state,
                    }
                }
            }
        })

        let text = wrapper.text()
        expect(text).toContain(initialBpm)

        state.globalBpm = updatedBpm

        await nextTick()

        text = wrapper.text()
        expect(text).toContain(updatedBpm)
    })

    it('should renderBuffer key', async () => {

        const initialKey = 'c'
        const updatedKey = 'f'

        const state = reactive({
            globalKey: initialKey,
        })

        const wrapper = mount(GlobalTrackValues, {
            global: {
                provide: {
                    store: {
                        state: state,
                    }
                }
            }
        })

        let text = wrapper.text()
        expect(text).toContain(initialKey)

        state.globalKey = updatedKey

        await nextTick()

        text = wrapper.text()
        expect(text).toContain(updatedKey)
    })

    it('should handle undefined', async () => {

        const initialBpm = 74
        const updatedBpm = undefined

        const initialKey = 'c'
        const updatedKey = undefined

        const state = reactive({
            globalBpm: initialBpm,
            globalKey: initialKey,
        })

        const wrapper = mount(GlobalTrackValues, {
            global: {
                provide: {
                    store: {
                        state: state,
                    }
                }
            }
        })

        let text = wrapper.text()
        expect(text).toContain(initialBpm)
        expect(text).toContain(initialKey)

        state.globalBpm = updatedBpm
        state.globalKey = updatedKey

        await nextTick()

        text = wrapper.text()
        expect(text).toContain('---')
        expect(text).toContain('---')
    })


})