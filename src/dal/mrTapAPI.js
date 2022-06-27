export default class MrTapObjWrapper {
    constructor(mrtapJson) {
        this.mrtapJson = mrtapJson;
    }

    getBPM() {
        return this.mrtapJson['bpm'] ? Math.round(this.mrtapJson['bpm']) : this.mrtapJson['bpm']
    }

    getSectionIds() {
        return this.mrtapJson['sections'].map(section => section.id);
    }

    getSections() {
        return this.mrtapJson['sections']
    }

    getLayerTypesForSection(sectionId) {
        let section = this.mrtapJson['sections'].find(s => s.id === sectionId)
        if (!section) {
            return undefined;
        }

        if (!section.layers || section.layers.length < 1) {
            return undefined;
        }

        let layerTypes = section.layers.map(function (layer) {
            return layer['type'];
        });

        return layerTypes;
    }

    getKeyForSection(sectionId) {
        let section = this.mrtapJson['sections'].find(s => s.id === sectionId)
        if (!section) {
            return undefined;
        }

        return section['key'];
    }

    getChordsForSection(sectionId) {
        let section = this.mrtapJson['sections'].find(s => s.id === sectionId)
        if (!section) {
            return undefined;
        }

        return section['chords'];
    }

    getLayerVariationIds(sectionId, layerType) {
        let section = this.mrtapJson['sections'].find(s => s.id === sectionId)
        if (!section) {
            return undefined;
        }

        if (!section.layers || section.layers.length < 1) {
            return undefined;
        }

        let layer = section.layers.find(l => l.type === layerType)
        if (!layer) {
            return undefined;
        }

        if (!layer.variations || layer.variations < 1) {
            return undefined;
        }

        let layerVariationIds = layer.variations.map(function (variation) {
            return variation['id'];
        });

        return layerVariationIds;
    }

    getLayerVariationSource(sectionId, layerType, layerVariationId) {
        let section = this.mrtapJson['sections'].find(s => s.id === sectionId)
        if (!section) {
            return undefined;
        }

        if (!section.layers || section.layers.length < 1) {
            return undefined;
        }

        let layer = section.layers.find(l => l.type === layerType)
        if (!layer) {
            return undefined;
        }

        if (!layer.variations || layer.variations < 1) {
            return undefined;
        }

        let layerVariation = layer.variations.find(v => v.id === layerVariationId);

        return layerVariation['audio_source'].toLowerCase();
    }

    getOptions() {
        let bpms = []
        let chords = []
        let keys = []
        let types = []

        const sectionIds = this.getSectionIds()
        for (let i = 0; i < sectionIds.length; i++) {
            const layerTypes = this.getLayerTypesForSection(sectionIds[i])
            for (let j = 0; j < layerTypes.length; j++) {
                const layerVariationIds = this.getLayerVariationIds(sectionIds[i], layerTypes[j])
                for (let k = 0; k < layerVariationIds.length; k++) {
                    // const variationSource = this.getLayerVariationSource(sectionIds[i], layerTypes[j], layerVariationIds[k])

                    if (!bpms.includes(this.getBPM())) {
                        bpms.push(this.getBPM());
                    }

                    if (!chords.includes(this.getChordsForSection(sectionIds[i]))) {
                        chords.push(this.getChordsForSection(sectionIds[i]));
                    }

                    if (!keys.includes(this.getKeyForSection(sectionIds[i]))) {
                        keys.push(this.getKeyForSection(sectionIds[i]));
                    }

                    if (!types.includes(layerTypes[j])) {
                        types.push(layerTypes[j]);
                    }
                }
            }
        }

        //MANUALLY APPEND FILLS/HITS etc
        types.push('fill')

        return {
            'bpms': bpms,
            'chords': chords,
            'keys': keys,
            'types': types,
        }
    }

    flattenStems(v4) {
        let flattenedStems = []
        const sectionIds = this.getSectionIds()

        for (let i = 0; i < sectionIds.length; i++) {
            const layerTypes = this.getLayerTypesForSection(sectionIds[i])
            for (let j = 0; j < layerTypes.length; j++) {
                const layerVariationIds = this.getLayerVariationIds(sectionIds[i], layerTypes[j])
                for (let k = 0; k < layerVariationIds.length; k++) {
                    const variationSource = this.getLayerVariationSource(sectionIds[i], layerTypes[j], layerVariationIds[k])
                    let uid = '';
                    if (v4) {
                        uid = v4()
                    }
                    flattenedStems.push({
                        'id': uid,
                        'bpm': this.getBPM(),
                        'chords': this.getChordsForSection(sectionIds[i]),
                        'key': this.getKeyForSection(sectionIds[i]),
                        'sectionId': sectionIds[i],
                        'type': layerTypes[j].includes('drum') ? 'drum' : layerTypes[j],
                        'variationId': layerVariationIds[k],
                        'source': variationSource.replace('.wav','.mp3'),
                    })
                }
            }
        }

        return flattenedStems
    }
}