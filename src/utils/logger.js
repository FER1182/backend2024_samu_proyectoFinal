import winston from "winston";
import  configObjet  from "../config/config.js";
const {node_env} = configObjet;
const niveles = {
    nivel: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colores: {
        fatal: 'red',
        error: 'white',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
}
winston.addColors(niveles.colores);

//logger para desarrollo
    const loggerDesarrollo = winston.createLogger({
        levels: niveles.nivel,
        transports: [   
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            })
        ]
    })

//logger para produccion

const loggerProduccion = winston.createLogger({
    levels: niveles.nivel,
    transports: [   
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
})

//determinar que logger usar de acuerdo a la variable de entorno (.env)
const logger = node_env === 'produccion' ? loggerProduccion : loggerDesarrollo

//middlewares

const addLogger = (req, res, next) => {
    
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
};

//exportar el modulo
export {addLogger}
export default logger