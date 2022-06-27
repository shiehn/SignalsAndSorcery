export default class ModalOpenPayload {

    constructor(instanceId, title, body, confirmBtnText, cancelBtnText) {
        this.instanceId = instanceId
        this.title = title
        this.body = body
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

    getConfirmText() {
        return this.confirmText
    }

    getCancelText() {
        return this.cancelText
    }
}