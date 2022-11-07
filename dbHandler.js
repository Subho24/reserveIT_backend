const mysql = require('mysql');
const bcrypt = require('bcrypt');

async function createConnectionAsync() {
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
            multipleStatements: true,
        });
        resolve(db);
    });
}

async function connectAsync(db) {
    return new Promise((resolve, reject) => {
        db.connect((err) => {
            if (err) reject(err);
            resolve('DB connected');
        });
    });
}

async function disconnectAsync(db) {
    return new Promise((resolve, reject) => {
        db.end((err) => {
            if (err) reject(err);
            resolve('DB disconnected');
        });
    });
}

async function queryAsync(db, sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

async function createPostQuery(body, table) {
    return new Promise((resolve, reject) => {
        let keys;
        let values;
        let keyArr = [];
        let valueArr = [];
        for (const i in body) {
            keyArr.push(i);
            valueArr.push(JSON.stringify(body[i]));
            keys = `${keyArr.join(',')}`;
            values = `${valueArr.join(',')}`;
        }
        let sql = `INSERT INTO ${table} (${keys}) VALUES (${values});`;
        resolve(sql);
    })
}

async function createUpdateQuery(body, table, rowID, IdValue) {
    return new Promise((resolve, reject) => {
        let keyArr = [];
        let valueArr = [];
        for (const i in body) {
            keyArr.push(i);
            valueArr.push(JSON.stringify(body[i]));
        }
        let sql = `UPDATE ${table} SET `;
        for (let i = 0; i < keyArr.length; i++) {
            if (keyArr[i] === rowID) {
                continue;
            }
            sql += `${keyArr[i]}=${valueArr[i]}${i === keyArr.length - 1 ? '' : keyArr.length === 2 && keyArr.includes(rowID) ? "" : ","} `;
        }
        sql += `WHERE ${rowID} = '${IdValue}';`;
        resolve(sql);
    })
}

async function hashPass(password, saltrounds) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltrounds, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
}

module.exports = {
    createConnectionAsync,
    connectAsync,
    disconnectAsync,
    queryAsync, 
    createPostQuery,
    createUpdateQuery,
    hashPass
}