import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const LEVEL = Symbol.for('level');

const { combine, timestamp, label, printf, colorize } = format;

/**
 * Log only the messages the match `level`.
 */
function filterOnly(level: string) {
    return format(function (info) {
        if (info[LEVEL] === level) {
            return info;
        }
        return false;
    })();
}

export const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        label({ label: 'Winston', message: false }),
        printf(({ level, message, label, timestamp }) => {
            return `${timestamp} [${label}] ${level}: ${message}`;
        })
    ),
    transports: [
        new transports.File({ filename: './logs/error.log', level: 'error' }),
        new transports.DailyRotateFile({
            level: 'info',
            filename: './logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true
        }),
        new transports.File({ filename: './logs/http.log', level: 'http', format: filterOnly('http') })
    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.Console({
            level: 'silly',
            format: combine(
                timestamp(),
                colorize(),
                printf(({ level, message, timestamp, ...rest }) => {
                    return `${timestamp} ${level}: ${message} ${JSON.stringify({ ...rest })}`;
                })
            )
        })
    );
}
