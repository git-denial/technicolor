import mysql, {Connection, MysqlError} from 'mysql'
import Logger from "../utils/logger";

class DatabaseService {

    con: Connection;
    _ready: boolean;

    constructor() {
        this._ready = false
        this.con = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        })
    }

    beginDatabasePing() {
        Logger.log("Initializing database connection monitor...")
        setInterval(() => {
            this.con.query('select 1', function(err: MysqlError | null) {
                if (err) {
                    Logger.log("Connection to Database Server died. Crashing server to initiate restart...")
                    process.exit(1)
                };
            });
        }, 5000);
    }

    initialize() {
        this.con.connect(err=>{
            if(err) {
                Logger.error(err)
            } else {
                this._ready = true
                Logger.log("Connected to database.")
                this.beginDatabasePing()
            }
        })
    }

    query(sql : string, args? : any[]|any, logSql : boolean = false) : Promise<any> {
        if(this._ready) {
            return new Promise((resolve,reject) =>{
                let queryResult = this.con.query(sql, args, (err, result) => {
                    if(err) {
                        return reject(err)
                    } else {
                        if(logSql) {
                            Logger.log(queryResult.sql)
                        }
                        return resolve(result)
                    }
                })
            })
        } else {
            throw new Error("DATABASE_NOT_INITIALIZED")
        }

    }

}

export default new DatabaseService()