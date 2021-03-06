/**
  *
  * @module models/room-summary
  */
/**
  * Construct a new Room Summary. A summary can be used for display on a recent
  * list, without having to load the entire room list into memory.
  * @constructor
  * @param {string} roomId Required. The ID of this room.
  * @param {object} info Optional. The summary info. Additional keys are supported.
  * @param {string} info.title The title of the room (e.g. <code>m.room.name</code>)
  * @param {string} info.desc The description of the room (e.g.
  * <code>m.room.topic</code>)
  * @param {Number} info.numMembers The number of joined users.
  * @param {Array.<string>} info.aliases The list of aliases for this room.
  * @param {Number} info.timestamp The timestamp for this room.
  */
/**
  *
  * @module models/room-summary
  */
/**
  * Construct a new Room Summary. A summary can be used for display on a recent
  * list, without having to load the entire room list into memory.
  * @constructor
  * @param {string} roomId Required. The ID of this room.
  * @param {object} info Optional. The summary info. Additional keys are supported.
  * @param {string} info.title The title of the room (e.g. <code>m.room.name</code>)
  * @param {string} info.desc The description of the room (e.g.
  * <code>m.room.topic</code>)
  * @param {Number} info.numMembers The number of joined users.
  * @param {Array.<string>} info.aliases The list of aliases for this room.
  * @param {Number} info.timestamp The timestamp for this room.
  */
export class RoomSummary {
    constructor(roomId: any, info: any);
    roomId: any;
    info: any;
}
