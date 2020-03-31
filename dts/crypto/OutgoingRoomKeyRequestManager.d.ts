export class OutgoingRoomKeyRequestManager {
    constructor(baseApis: any, deviceId: any, cryptoStore: any);
    _baseApis: any;
    _deviceId: any;
    _cryptoStore: any;
    _sendOutgoingRoomKeyRequestsTimer: NodeJS.Timeout;
    _sendOutgoingRoomKeyRequestsRunning: boolean;
    _clientRunning: boolean;
    /**
     * Called when the client is started. Sets background processes running.
     */
    start(): void;
    stop(): void;
    /**
     * Send off a room key request, if we haven't already done so.
     *
     * The `requestBody` is compared (with a deep-equality check) against
     * previous queued or sent requests and if it matches, no change is made.
     * Otherwise, a request is added to the pending list, and a job is started
     * in the background to send it.
     * @param {RoomKeyRequestBody} requestBody
     * @param {Array.<{userId: string, deviceId: string}>} recipients
     * @param {boolean} resend whether to resend the key request if there is
     *    already one
     * @returns {Promise}  resolves when the request has been added to the
     *    pending list (or we have established that a similar request already
     *    exists)
     */
    sendRoomKeyRequest(requestBody: any, recipients: {
        userId: string;
        deviceId: string;
    }[], resend?: boolean): Promise<any>;
    /**
     * Cancel room key requests, if any match the given requestBody
     * @param {RoomKeyRequestBody} requestBody
     * @returns {Promise}  resolves when the request has been updated in our
     *    pending list.
     */
    cancelRoomKeyRequest(requestBody: any): Promise<any>;
    /**
     * Look for room key requests by target device and state
     * @param {string} userId Target user ID
     * @param {string} deviceId Target device ID
     * @return {Promise}  resolves to a list of all the
     *    {@link module:crypto/store/base~OutgoingRoomKeyRequest}
     */
    getOutgoingSentRoomKeyRequest(userId: string, deviceId: string): Promise<any>;
    _startTimer(): void;
    _sendOutgoingRoomKeyRequests(): any;
    _sendOutgoingRoomKeyRequest(req: any): any;
    _sendOutgoingRoomKeyRequestCancellation(req: any, andResend: any): any;
    _sendMessageToDevices(message: any, recipients: any, txnId: any): any;
}
/**
 * possible states for a room key request
 *
 * The state machine looks like:
 *
 *      |         (cancellation sent)
 *      | .-------------------------------------------------.
 *      | |                                                 |
 *      V V       (cancellation requested)                  |
 *    UNSENT  -----------------------------+                |
 *      |                                  |                |
 *      |                                  |                |
 *      | (send successful)                |  CANCELLATION_PENDING_AND_WILL_RESEND
 *      V                                  |                Λ
 *     SENT                                |                |
 *      |--------------------------------  |  --------------'
 *      |                                  |  (cancellation requested with intent
 *      |                                  |   to resend the original request)
 *      |                                  |
 *      | (cancellation requested)         |
 *      V                                  |
 * CANCELLATION_PENDING                   |
 *      |                                  |
 *      | (cancellation sent)              |
 *      V                                  |
 * (deleted)  <---------------------------+
 */
export type ROOM_KEY_REQUEST_STATES = number;
