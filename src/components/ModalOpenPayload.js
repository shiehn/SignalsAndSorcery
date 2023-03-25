export default class ModalOpenPayload {

    constructor(instanceId, title, body, confirmBtnText, confirmBtnTextTwo, cancelBtnText, isTextInput = false, relayData = undefined, restrictChars = false) {
        this.instanceId = instanceId
        this.title = title
        this.body = body
        this.isTextInput = isTextInput
        this.confirmText = confirmBtnText
        this.confirmTextTwo = confirmBtnTextTwo
        this.cancelText = cancelBtnText
        this.relayData = relayData
        this.restrictChars = restrictChars
    }

    getInstanceId() {
        return this.instanceId
    }

    getTitle() {
        return this.title
    }

    getBody() {
        return this.body
    }

    getIsTextInput() {
        return this.isTextInput
    }

    getConfirmText() {
        return this.confirmText
    }

    getConfirmTextTwo() {
        return this.confirmTextTwo
    }

    getCancelText() {
        return this.cancelText
    }

    getRelayData() {
        return this.relayData
    }

    getRestrictChars() {
        return this.restrictChars
    }
}