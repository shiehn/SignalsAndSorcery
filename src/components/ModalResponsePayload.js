

export default class ModalResponsePayload {

        constructor(instanceId, response) {
            this.instanceId = instanceId
            this.response = response
        }

        getInstanceId() {
            return this.instanceId
        }

        getResponse() {
            return this.response
        }
}