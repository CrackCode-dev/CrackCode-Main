const levels = { error: 0, warn: 1, info: 2, debug: 3 };

const envLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
const currentLevel = levels[envLevel] ?? levels.info;

const timestamp = () => new Date().toISOString();

const format = (level, message, meta) => {
  const metaStr = meta ? ` ${typeof meta === 'string' ? meta : JSON.stringify(meta)}` : '';
  return `[${timestamp()}] [${level.toUpperCase()}] ${message}${metaStr}`;
};

export const error = (msg, meta) => {
  if (currentLevel >= levels.error) console.error(format('error', msg, meta));
};

export const warn = (msg, meta) => {
  if (currentLevel >= levels.warn) console.warn(format('warn', msg, meta));
};

export const info = (msg, meta) => {
  if (currentLevel >= levels.info) console.log(format('info', msg, meta));
};

export const debug = (msg, meta) => {
  if (currentLevel >= levels.debug) console.debug(format('debug', msg, meta));
};

export default { error, warn, info, debug };
