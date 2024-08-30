import { greenBright as successColor, red as errorColor, yellow as warnColor, yellowBright as progressColor } from 'colorette';
import { log as baseLog, error as baseError } from 'node:console';

/**
 * Outputs a warning message.
 * @param {string} msg - The message to be displayed.
 */
export const warn = msg => baseLog(warnColor(msg));

/**
 * Outputs a message indicating an ongoing operation.
 * @param {string} msg - The message to be displayed.
 */
export const progress = msg => baseLog(progressColor(msg));

/**
 * Outputs a success message with a checkmark.
 * @param {string} msg - The message to be displayed.
 */
export const success = msg => baseLog(successColor(`✔ ${msg}`));

/**
 * Outputs an error message with a cross mark and optionally logs an error object.
 * @param {string} msg - The message to be displayed.
 * @param {Error} [err] - Optional error object to be logged.
 */
export const fail = (msg, err) => {
    baseError(errorColor(`✖ ${msg}`));
    if (err) baseError(err?.message);
};
