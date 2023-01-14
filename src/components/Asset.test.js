/**
 * @vitest-environment happy-dom
 */

import {describe, it, expect} from "vitest"
import {mount} from '@vue/test-utils'
import Asset from "./Asset.vue";

describe('Asset Tests', () => {
    it('should display chords', async () => {
        const wrapper = mount(Asset, {
            global: {
                provide: {
                    store: {
                        state: {
                            staticUrl : 'http://localhost:8080',
                        },
                        isMobile: false,
                    }
                }
            },
            props: {
                stem: {
                    type: 'hi',
                    waveform: 'xxx.wav',
                    chords: 'dm:c:e:fm',
                }
            }
        })

        const text = wrapper.text()
        expect(text).to.contain('dm:c:e:fm')
    })

    it('should not display chords for drum', async () => {
        console.log('STEM TEXT START')

        const wrapper = mount(Asset, {
            global: {
                provide: {
                    store: {
                        state: {
                            staticUrl : 'http://localhost:8080',
                        },
                        isMobile: false,
                    }
                }
            },
            props: {
                stem: {
                    type: 'drum',
                    waveform: 'xxx.wav',
                    chords: 'dm:c:e:fm',
                }
            }
        })

        const text = wrapper.text()
        console.log('STEM TEXT', text)
        expect(text).to.contain('drum')
        expect(text).to.not.contain('dm:c:e:fm')
    })


    it('should work for units', () => {
        let valueone = 5
        let valuetwo = 5

        expect(valueone).equals(valuetwo)
    })
})