/** Tracks recurring timers so game intervals can be stopped centrally. */
export class IntervalHub {
    static allIntervals = [];

    /** Registers and starts a recurring callback.
     * @static
     * @param {Function} func Callback executed by the interval.
     * @param {number} timer Delay in milliseconds.
     * @returns {number} Browser interval identifier.
     */
    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer);
        IntervalHub.allIntervals.push(newInterval);
        return newInterval;
    }

    /** Stops and unregisters one tracked interval.
     * @static
     * @param {number} id Interval identifier.
     */
    static stopInterval(id) {
        clearInterval(id);
        IntervalHub.allIntervals = IntervalHub.allIntervals.filter((intervaId) => intervaId !== id);
    }

    /** Stops and clears every tracked interval.
     * @static
     */
    static stopAllInterval() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}
