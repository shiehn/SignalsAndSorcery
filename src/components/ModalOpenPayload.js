export default class ModalOpenPayload {

    constructor(instanceId, title, body, confirmBtnText, cancelBtnText, isTextInput = false) {
        this.instanceId = instanceId
        this.title = title
        this.body = body
        this.isTextInput = isTextInput
        this.confirmText = confirmBtnText
        this.cancelText = cancelBtnText
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

    getCancelText() {
        return this.cancelText
    }
}