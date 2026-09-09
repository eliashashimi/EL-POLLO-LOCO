export class IntervalHub {
    static allIntervals = [];

    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer);
        IntervalHub.allIntervals.push(newInterval);
        return newInterval;
    }

    static stopInterval(id) {
        clearInterval(id);
        IntervalHub.allIntervals = IntervalHub.allIntervals.filter((intervaId) => intervaId !== id);
    }

    static stopAllInterval() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}
