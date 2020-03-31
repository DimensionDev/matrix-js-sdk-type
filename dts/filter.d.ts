/**
 * Construct a new Filter.
 * @constructor
 * @param {string} userId The user ID for this filter.
 * @param {(string | undefined)} filterId The filter ID if known.
 * @prop {string} userId The user ID of the filter
 * @prop {(string | null)} filterId The filter ID
 */
/**
 * Construct a new Filter.
 * @constructor
 * @param {string} userId The user ID for this filter.
 * @param {(string | undefined)} filterId The filter ID if known.
 * @prop {string} userId The user ID of the filter
 * @prop {(string | null)} filterId The filter ID
 */
export class Filter {
    constructor(userId: any, filterId: any);
    userId: any;
    filterId: any;
    definition: {};
    /**
     * Get the ID of this filter on your homeserver (if known)
     * @return {?Number} The filter ID
     */
    /**
     * Get the ID of this filter on your homeserver (if known)
     * @return {(number | null)}  The filter ID
     */
    getFilterId(): number;
    /**
     * Get the JSON body of the filter.
     * @return {object}  The filter definition
     */
    getDefinition(): any;
    /**
     * Set the JSON body of the filter
     * @param {object} definition The filter definition
     */
    setDefinition(definition: any): void;
    _include_leave: any;
    _room_filter: FilterComponent;
    _room_timeline_filter: FilterComponent;
    /**
     * Get the room.timeline filter component of the filter
     * @return {FilterComponent}  room timeline filter component
     */
    getRoomTimelineFilterComponent(): FilterComponent;
    /**
     * Filter the list of events based on whether they are allowed in a timeline
     * based on this filter
     * @param {Array.<MatrixEvent>} events the list of events being filtered
     * @return {Array.<MatrixEvent>}  the list of events which match the filter
     */
    filterRoomTimeline(events: any[]): any[];
    /**
     * Set the max number of events to return for each room's timeline.
     * @param {number} limit The max number of events to return for each room.
     */
    setTimelineLimit(limit: number): void;
    /**
     * Control whether left rooms should be included in responses.
     * @param {boolean} includeLeave True to make rooms the user has left appear
     * in responses.
     */
    setIncludeLeaveRooms(includeLeave: boolean): void;
}
export namespace Filter {
    /**
     * Create a filter from existing data.
     * @static
     * @param {string} userId
     * @param {string} filterId
     * @param {object} jsonObj
     * @return {Filter}
     */
    export function fromJson(userId: string, filterId: string, jsonObj: any): Filter;
    export namespace LAZY_LOADING_MESSAGES_FILTER {
        export const lazy_load_members: boolean;
    }
    export namespace LAZY_LOADING_SYNC_FILTER {
        export namespace room {
            import state = Filter.LAZY_LOADING_MESSAGES_FILTER;
            export { state };
        }
    }
}
import { FilterComponent } from "./filter-component";
