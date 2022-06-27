

export default class ModalResponsePayload {

        constructor(instanceId, response, relayData) {
            this.instanceId = instanceId
            this.response = response
            this.relayData = relayData
        }

        getInstanceId() {
            return this.instanceId
        }

        getResponse() {
            return this.response
        }

        getRelayData() {
            return this.relayData
        }
}