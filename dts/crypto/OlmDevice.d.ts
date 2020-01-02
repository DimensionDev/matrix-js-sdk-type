export default OlmDevice;
/**
 * :crypto/OlmDevice.MegolmSessionData
 */
export type module = {
    /**
     * Sender's Curve25519 device key
     */
    sender_key: string;
    /**
     * Devices which forwarded
     * this session to us (normally empty).
     */
    forwarding_curve25519_key_chain: string[];
    /**
     * Other keys the sender claims.
     */
    sender_claimed_keys: {
        [x: string]: string;
    };
    /**
     * Room this session is used in
     */
    room_id: string;
    /**
     * Unique id for the session
     */
    session_id: string;
    /**
     * Base64'ed key data
     */
    session_key: string;
};
/**
 * The type of object we use for importing and exporting megolm session data.
 *
 * @typedef {Object} module:crypto/OlmDevice.MegolmSessionData
 * @property {String} sender_key  Sender's Curve25519 device key
 * @property {String[]} forwarding_curve25519_key_chain Devices which forwarded
 *     this session to us (normally empty).
 * @property {Object<string, string>} sender_claimed_keys Other keys the sender claims.
 * @property {String} room_id     Room this session is used in
 * @property {String} session_id  Unique id for the session
 * @property {String} session_key Base64'ed key data
 */
/**
 * Manages the olm cryptography functions. Each OlmDevice has a single
 * OlmAccount and a number of OlmSessions.
 *
 * Accounts and sessions are kept pickled in the cryptoStore.
 *
 * @constructor
 * @alias module:crypto/OlmDevice
 *
 * @param {Object} cryptoStore A store for crypto data
 *
 * @property {string} deviceCurve25519Key   Curve25519 key for the account
 * @property {string} deviceEd25519Key      Ed25519 key for the account
 */
declare class OlmDevice {
    /**
     * @return {array} The version of Olm.
     */
    static getOlmVersion(): any[];
    constructor(cryptoStore: any);
    _cryptoStore: any;
    _pickleKey: string;
    deviceCurve25519Key: any;
    deviceEd25519Key: any;
    _maxOneTimeKeys: any;
    _outboundGroupSessionStore: {};
    _inboundGroupSessionMessageIndexes: {};
    _sessionsInProgress: {};
    /**
     * Initialise the OlmAccount. This must be called before any other operations
     * on the OlmDevice.
     *
     * Attempts to load the OlmAccount from the crypto store, or creates one if none is
     * found.
     *
     * Reads the device keys from the OlmAccount object.
     */
    init(): Promise<void>;
    /**
     * extract our OlmAccount from the crypto store and call the given function
     * with the account object
     * The `account` object is useable only within the callback passed to this
     * function and will be freed as soon the callback returns. It is *not*
     * useable for the rest of the lifetime of the transaction.
     * This function requires a live transaction object from cryptoStore.doTxn()
     * and therefore may only be called in a doTxn() callback.
     *
     * @param {*} txn Opaque transaction object from cryptoStore.doTxn()
     * @param {function} func
     * @private
     */
    _getAccount(txn: any, func: Function): void;
    _storeAccount(txn: any, account: any): void;
    /**
     * extract an OlmSession from the session store and call the given function
     * The session is useable only within the callback passed to this
     * function and will be freed as soon the callback returns. It is *not*
     * useable for the rest of the lifetime of the transaction.
     *
     * @param {string} deviceKey
     * @param {string} sessionId
     * @param {*} txn Opaque transaction object from cryptoStore.doTxn()
     * @param {function} func
     * @private
     */
    _getSession(deviceKey: string, sessionId: string, txn: any, func: Function): void;
    /**
     * Creates a session object from a session pickle and executes the given
     * function with it. The session object is destroyed once the function
     * returns.
     *
     * @param {object} sessionInfo
     * @param {function} func
     * @private
     */
    _unpickleSession(sessionInfo: any, func: Function): void;
    /**
     * store our OlmSession in the session store
     *
     * @param {string} deviceKey
     * @param {object} sessionInfo {session: OlmSession, lastReceivedMessageTs: int}
     * @param {*} txn Opaque transaction object from cryptoStore.doTxn()
     * @private
     */
    _saveSession(deviceKey: string, sessionInfo: any, txn: any): void;
    /**
     * get an OlmUtility and call the given function
     *
     * @param {function} func
     * @return {object} result of func
     * @private
     */
    _getUtility(func: Function): any;
    /**
     * Signs a message with the ed25519 key for this account.
     *
     * @param {string} message  message to be signed
     * @return {Promise<string>} base64-encoded signature
     */
    sign(message: string): Promise<string>;
    /**
     * Get the current (unused, unpublished) one-time keys for this account.
     *
     * @return {object} one time keys; an object with the single property
     * <tt>curve25519</tt>, which is itself an object mapping key id to Curve25519
     * key.
     */
    getOneTimeKeys(): any;
    /**
     * Get the maximum number of one-time keys we can store.
     *
     * @return {number} number of keys
     */
    maxNumberOfOneTimeKeys(): number;
    /**
     * Marks all of the one-time keys as published.
     */
    markKeysAsPublished(): Promise<void>;
    /**
     * Generate some new one-time keys
     *
     * @param {number} numKeys number of keys to generate
     * @return {Promise} Resolved once the account is saved back having generated the keys
     */
    generateOneTimeKeys(numKeys: number): Promise<any>;
    /**
     * Generate a new outbound session
     *
     * The new session will be stored in the cryptoStore.
     *
     * @param {string} theirIdentityKey remote user's Curve25519 identity key
     * @param {string} theirOneTimeKey  remote user's one-time Curve25519 key
     * @return {string} sessionId for the outbound session.
     */
    createOutboundSession(theirIdentityKey: string, theirOneTimeKey: string): string;
    /**
     * Generate a new inbound session, given an incoming message
     *
     * @param {string} theirDeviceIdentityKey remote user's Curve25519 identity key
     * @param {number} messageType  messageType field from the received message (must be 0)
     * @param {string} ciphertext base64-encoded body from the received message
     *
     * @return {{payload: string, session_id: string}} decrypted payload, and
     *     session id of new session
     *
     * @raises {Error} if the received message was not valid (for instance, it
     *     didn't use a valid one-time key).
     */
    createInboundSession(theirDeviceIdentityKey: string, messageType: number, ciphertext: string): {
        payload: string;
        session_id: string;
    };
    /**
     * Get a list of known session IDs for the given device
     *
     * @param {string} theirDeviceIdentityKey Curve25519 identity key for the
     *     remote device
     * @return {Promise<string[]>}  a list of known session ids for the device
     */
    getSessionIdsForDevice(theirDeviceIdentityKey: string): Promise<string[]>;
    /**
     * Get the right olm session id for encrypting messages to the given identity key
     *
     * @param {string} theirDeviceIdentityKey Curve25519 identity key for the
     *     remote device
     * @param {boolean} nowait Don't wait for an in-progress session to complete.
     *     This should only be set to true of the calling function is the function
     *     that marked the session as being in-progress.
     * @return {Promise<?string>}  session id, or null if no established session
     */
    getSessionIdForDevice(theirDeviceIdentityKey: string, nowait: boolean): Promise<string>;
    /**
     * Get information on the active Olm sessions for a device.
     * <p>
     * Returns an array, with an entry for each active session. The first entry in
     * the result will be the one used for outgoing messages. Each entry contains
     * the keys 'hasReceivedMessage' (true if the session has received an incoming
     * message and is therefore past the pre-key stage), and 'sessionId'.
     *
     * @param {string} deviceIdentityKey Curve25519 identity key for the device
     * @param {boolean} nowait Don't wait for an in-progress session to complete.
     *     This should only be set to true of the calling function is the function
     *     that marked the session as being in-progress.
     * @return {Array.<{sessionId: string, hasReceivedMessage: Boolean}>}
     */
    getSessionInfoForDevice(deviceIdentityKey: string, nowait: boolean): {
        sessionId: string;
        hasReceivedMessage: boolean;
    }[];
    /**
     * Encrypt an outgoing message using an existing session
     *
     * @param {string} theirDeviceIdentityKey Curve25519 identity key for the
     *     remote device
     * @param {string} sessionId  the id of the active session
     * @param {string} payloadString  payload to be encrypted and sent
     *
     * @return {Promise<string>} ciphertext
     */
    encryptMessage(theirDeviceIdentityKey: string, sessionId: string, payloadString: string): Promise<string>;
    /**
     * Decrypt an incoming message using an existing session
     *
     * @param {string} theirDeviceIdentityKey Curve25519 identity key for the
     *     remote device
     * @param {string} sessionId  the id of the active session
     * @param {number} messageType  messageType field from the received message
     * @param {string} ciphertext base64-encoded body from the received message
     *
     * @return {Promise<string>} decrypted payload.
     */
    decryptMessage(theirDeviceIdentityKey: string, sessionId: string, messageType: number, ciphertext: string): Promise<string>;
    /**
     * Determine if an incoming messages is a prekey message matching an existing session
     *
     * @param {string} theirDeviceIdentityKey Curve25519 identity key for the
     *     remote device
     * @param {string} sessionId  the id of the active session
     * @param {number} messageType  messageType field from the received message
     * @param {string} ciphertext base64-encoded body from the received message
     *
     * @return {Promise<boolean>} true if the received message is a prekey message which matches
     *    the given session.
     */
    matchesSession(theirDeviceIdentityKey: string, sessionId: string, messageType: number, ciphertext: string): Promise<boolean>;
    /**
     * store an OutboundGroupSession in _outboundGroupSessionStore
     *
     * @param {Olm.OutboundGroupSession} session
     * @private
     */
    _saveOutboundGroupSession(session: any): void;
    /**
     * extract an OutboundGroupSession from _outboundGroupSessionStore and call the
     * given function
     *
     * @param {string} sessionId
     * @param {function} func
     * @return {object} result of func
     * @private
     */
    _getOutboundGroupSession(sessionId: string, func: Function): any;
    /**
     * Generate a new outbound group session
     *
     * @return {string} sessionId for the outbound session.
     */
    createOutboundGroupSession(): string;
    /**
     * Encrypt an outgoing message with an outbound group session
     *
     * @param {string} sessionId  the id of the outboundgroupsession
     * @param {string} payloadString  payload to be encrypted and sent
     *
     * @return {string} ciphertext
     */
    encryptGroupMessage(sessionId: string, payloadString: string): string;
    /**
     * Get the session keys for an outbound group session
     *
     * @param {string} sessionId  the id of the outbound group session
     *
     * @return {{chain_index: number, key: string}} current chain index, and
     *     base64-encoded secret key.
     */
    getOutboundGroupSessionKey(sessionId: string): {
        chain_index: number;
        key: string;
    };
    /**
     * data stored in the session store about an inbound group session
     *
     * @typedef {Object} InboundGroupSessionData
     * @property {string} room_Id
     * @property {string} session   pickled Olm.InboundGroupSession
     * @property {Object<string, string>} keysClaimed
     * @property {Array<string>} forwardingCurve25519KeyChain  Devices involved in forwarding
     *     this session to us (normally empty).
     */
    /**
     * Unpickle a session from a sessionData object and invoke the given function.
     * The session is valid only until func returns.
     *
     * @param {Object} sessionData Object describing the session.
     * @param {function(Olm.InboundGroupSession)} func Invoked with the unpickled session
     * @return {*} result of func
     */
    _unpickleInboundGroupSession(sessionData: any, func: (arg0: any) => any): any;
    /**
     * extract an InboundGroupSession from the crypto store and call the given function
     *
     * @param {string} roomId The room ID to extract the session for, or null to fetch
     *     sessions for any room.
     * @param {string} senderKey
     * @param {string} sessionId
     * @param {*} txn Opaque transaction object from cryptoStore.doTxn()
     * @param {function(Olm.InboundGroupSession, InboundGroupSessionData)} func
     *   function to call.
     *
     * @private
     */
    _getInboundGroupSession(roomId: string, senderKey: string, sessionId: string, txn: any, func: (arg0: any, arg1: {
        room_Id: string;
        /**
         * pickled Olm.InboundGroupSession
         */
        session: string;
        keysClaimed: {
            [x: string]: string;
        };
        /**
         * Devices involved in forwarding
         * this session to us (normally empty).
         */
        forwardingCurve25519KeyChain: string[];
    }) => any): void;
    /**
     * Add an inbound group session to the session store
     *
     * @param {string} roomId     room in which this session will be used
     * @param {string} senderKey  base64-encoded curve25519 key of the sender
     * @param {Array<string>} forwardingCurve25519KeyChain  Devices involved in forwarding
     *     this session to us.
     * @param {string} sessionId  session identifier
     * @param {string} sessionKey base64-encoded secret key
     * @param {Object<string, string>} keysClaimed Other keys the sender claims.
     * @param {boolean} exportFormat true if the megolm keys are in export format
     *    (ie, they lack an ed25519 signature)
     */
    addInboundGroupSession(roomId: string, senderKey: string, forwardingCurve25519KeyChain: string[], sessionId: string, sessionKey: string, keysClaimed: {
        [x: string]: string;
    }, exportFormat: boolean): Promise<void>;
    /**
     * Decrypt a received message with an inbound group session
     *
     * @param {string} roomId    room in which the message was received
     * @param {string} senderKey base64-encoded curve25519 key of the sender
     * @param {string} sessionId session identifier
     * @param {string} body      base64-encoded body of the encrypted message
     * @param {string} eventId   ID of the event being decrypted
     * @param {Number} timestamp timestamp of the event being decrypted
     *
     * @return {null} the sessionId is unknown
     *
     * @return {Promise<{result: string, senderKey: string,
     *    forwardingCurve25519KeyChain: Array<string>,
     *    keysClaimed: Object<string, string>}>}
     */
    decryptGroupMessage(roomId: string, senderKey: string, sessionId: string, body: string, eventId: string, timestamp: number): null;
    /**
     * Determine if we have the keys for a given megolm session
     *
     * @param {string} roomId    room in which the message was received
     * @param {string} senderKey base64-encoded curve25519 key of the sender
     * @param {string} sessionId session identifier
     *
     * @returns {Promise<boolean>} true if we have the keys to this session
     */
    hasInboundSessionKeys(roomId: string, senderKey: string, sessionId: string): Promise<boolean>;
    /**
     * Extract the keys to a given megolm session, for sharing
     *
     * @param {string} roomId    room in which the message was received
     * @param {string} senderKey base64-encoded curve25519 key of the sender
     * @param {string} sessionId session identifier
     * @param {integer} chainIndex The chain index at which to export the session.
     *     If omitted, export at the first index we know about.
     *
     * @returns {Promise<{chain_index: number, key: string,
     *        forwarding_curve25519_key_chain: Array<string>,
     *        sender_claimed_ed25519_key: string
     *    }>}
     *    details of the session key. The key is a base64-encoded megolm key in
     *    export format.
     *
     * @throws Error If the given chain index could not be obtained from the known
     *     index (ie. the given chain index is before the first we have).
     */
    getInboundGroupSessionKey(roomId: string, senderKey: string, sessionId: string, chainIndex: any): Promise<{
        chain_index: number;
        key: string;
        forwarding_curve25519_key_chain: string[];
        sender_claimed_ed25519_key: string;
    }>;
    /**
     * Export an inbound group session
     *
     * @param {string} senderKey base64-encoded curve25519 key of the sender
     * @param {string} sessionId session identifier
     * @param {string} sessionData The session object from the store
     * @return {module:crypto/OlmDevice.MegolmSessionData} exported session data
     */
    exportInboundGroupSession(senderKey: string, sessionId: string, sessionData: string): any;
    /**
     * Verify an ed25519 signature.
     *
     * @param {string} key ed25519 key
     * @param {string} message message which was signed
     * @param {string} signature base64-encoded signature to be checked
     *
     * @raises {Error} if there is a problem with the verification. If the key was
     * too small then the message will be "OLM.INVALID_BASE64". If the signature
     * was invalid then the message will be "OLM.BAD_MESSAGE_MAC".
     */
    verifySignature(key: string, message: string, signature: string): void;
}
