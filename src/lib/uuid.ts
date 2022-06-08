/**
 * https://gist.github.com/jed/982883
 * https://gist.github.com/jed/982883?permalink_comment_id=3123179#gistcomment-3123179
 *
 * Generates a UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
 *
 * The '4' denotes the version of UUID, which means that they are randomly generated,
 * as opposed to incorporating the time, MAC address, etc.
 * The 'y' is a random hexadecimal number from 8 to b, which specifies Variant 1 UUIDs.
 * (see https://datatracker.ietf.org/doc/html/rfc4122)
 *
 * use just like:
 * import uuid from './path/to/uuid.ts';
 * const id = uuid();
 */

const template = `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`; // 10000000-1000-4000-8000-100000000000
const hexChar = (a: number) => (a ^ ((Math.random() * 16) >> (a / 4))).toString(16); // The bitmask is truncated when a = 8, ensuring Variant 1.

export default function uuid(a?: string): string {
  // Recursively replace the template string with random hex characters.
  return a ? hexChar(Number(a)) : template.replace(/[018]/g, uuid);
}
