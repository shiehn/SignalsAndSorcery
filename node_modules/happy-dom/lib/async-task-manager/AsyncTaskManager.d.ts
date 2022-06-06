/// <reference types="node" />
/**
 * Handles async tasks.
 */
export default class AsyncTaskManager {
    private static taskID;
    private runningTasks;
    private runningTimers;
    private queue;
    /**
     * Returns a promise that is fulfilled when async tasks are complete.
     * This method is not part of the HTML standard.
     *
     * @returns Promise.
     */
    whenComplete(): Promise<void>;
    /**
     * Cancels all tasks.
     *
     * @param [error] Error.
     */
    cancelAll(error?: Error): void;
    /**
     * Starts a timer.
     *
     * @param timerID Timer ID.
     */
    startTimer(timerID: NodeJS.Timeout): void;
    /**
     * Ends a timer.
     *
     * @param timerID Timer ID.
     */
    endTimer(timerID: NodeJS.Timeout): void;
    /**
     * Starts an async task.
     *
     * @returns Task ID.
     */
    startTask(): number;
    /**
     * Ends an async task.
     *
     * @param taskID Task ID.
     */
    endTask(taskID: number): void;
    /**
     * Returns the amount of running tasks.
     *
     * @returns Count.
     */
    getTaskCount(): number;
    /**
     * Returns the amount of running timers.
     *
     * @returns Count.
     */
    getTimerCount(): number;
    /**
     * Returns a new task ID.
     *
     * @returns Task ID.
     */
    private newTaskID;
}
