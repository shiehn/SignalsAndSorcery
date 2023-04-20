export default class Analytics {
    constructor() {
    }

    trackPlay() {
        if(typeof gtag  != 'undefined'){
            gtag('event', 'play', {'type': 'main'});
        }
    }

    trackPlayAsset() {
        if(typeof gtag  != 'undefined'){
            gtag('event', 'play', {'type': 'asset'});
        }
    }

    trackCreateRandom() {
        if(typeof gtag  != 'undefined'){
            gtag('event', 'generate', {'type': 'random'});
        }
    }

    trackCreateEmpty() {
        if(typeof gtag  != 'undefined'){
            gtag('event', 'generate', {'type': 'empty'});
        }
    }

    trackSave() {
        if(typeof gtag  != 'undefined'){
            gtag('event', 'save', {'type': 'save'});
        }
    }

    trackExportPackage() {
        if(typeof gtag  != 'undefined'){
            gtag('event', 'export', {'type': 'package'});
        }
    }

    trackExportMP3() {
        if(typeof gtag  != 'undefined'){
            gtag('event', 'export', {'type': 'mp3'});
        }
    }

    trackDownloadSingleWAV(wavFileName) {
        if(typeof gtag  != 'undefined'){
            gtag('event', 'download', {'type': 'wav', 'file': wavFileName});
        }
    }

    trackLoad() {
        if(typeof gtag  != 'undefined'){
            gtag('event', 'load', {'type': 'project'});
        }
    }
}