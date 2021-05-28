/**
 *
 * @param {string} prefix - String to prefix ID with
 * @returns
 */
export function getUniqueId(prefix = 'lunit') {
  const uid = new Date().getTime() + Math.random().toString(36).slice(2);
  return `${prefix}-${uid}`;
}
