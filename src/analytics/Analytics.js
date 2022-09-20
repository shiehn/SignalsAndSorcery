export default class Analytics {
    constructor() {
    }

    trackPlay() {
        gtag('event', 'play', { 'type': 'main' });
    }

    trackPlayAsset() {
        gtag('event', 'play', { 'type': 'asset' });
    }

    trackCreateRandom() {
        gtag('event', 'generate', { 'type': 'random' });
    }

    trackCreateEmpty() {
        gtag('event', 'generate', { 'type': 'empty' });
    }

    trackSave() {
        gtag('event', 'save', { 'type': 'save' });
    }

    trackExportPackage() {
        gtag('event', 'export', { 'type': 'package' });
    }

    trackExportMP3() {
        gtag('event', 'export', { 'type': 'mp3' });
    }

    trackLoad() {
        gtag('event', 'load', { 'type': 'project' });
    }
}