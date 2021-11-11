/**
 * ======================================
 * DB操作
 * author: sky-admin
 * file: index.js
 * date: 2021/11/11 8:24
 * ======================================
 */
import Idb from 'idb-js' //  引入Idb
import md5 from 'js-md5';
import dbConfig from './config' // 引入数据库配置

/**
 * 判断内容是否为空
 * @param  {string} value [description]
 * @return {boolean}       [description]
 */
const empty = function (value) {
    switch (typeof value) {
        case 'string':
            return value === null || value === "";
        case 'object':
            return value === null || Object.keys(value).length === 0;
        case 'function':
            return false;
        case 'boolean':
            return !value;
        case 'number':
            return isNaN(value);
        case 'null':
        case 'undefined':
        default:
            return true;
    }
    return !((value.length === 0 || value === '' || value === undefined || value === false) || Object.keys(value).length === 0);
}

let install = function (Vue) {
    class db {
        /**
         * 初始化构造
         * @return {[type]} [description]
         */
        constructor(config) {
            this.exp = {
                "=": "$eq",
                "eq": "$eq",
                ">": "$gt",
                "gt": "$gt",
                "<": "$lt",
                "lt": "$lt",
                ">=": "$gte",
                "gte": "$gte",
                "<=": "$lte",
                "lte": "$lte",
                "!=": "$ne",
                "ne": "$ne",
            }
            this.$exps = {
                $eq: function (a, b) {
                    return a === b;
                },
                $gt: function (a, b) {
                    return a > b;
                },
                $lt: function (a, b) {
                    return a < b;
                },
                $gte: function (a, b) {
                    return a >= b;
                },
                $lte: function (a, b) {
                    return a <= b;
                },
                $ne: function (a, b) {
                    return a !== b;
                }
            }
            //配置文件
            this.config = config;
            //处理选项
            this.options = {};
        }

        /**
         * 数据库链接
         * @return {[type]} [description]
         */
        async connection() {
            try {
                return await new Promise((resolve, reject) => {
                    Idb(this.config).then(devInfo => {
                        resolve(devInfo)
                    }).catch(error => {
                        reject(error)
                    })
                })
            } catch (error) {
                throw new Error('数据库链接失败');
            }
        }

        /**
         * 表名
         * @param {string} name 表名
         */
        name(name) {
            //初始化请空配置
            this.options = {
                name: name,
                where: {},
                order: {'_id ASC': -1},
                fields: ''
            }
            return this;
        }

        /**
         * 指定查询条件
         * @param  {[type]} field     查询字段
         * @param  {[type]} op        查询表达式
         * @param  {[type]} condition 查询条件
         * @return {[type]}           [description]
         */
        where(field, op = null, condition = null) {
            if (Object.prototype.toString.call(field) === "[object String]" && !empty(field) && op) {
                if (condition == null) {
                    condition = op;
                    op = 'eq';
                }
                let _field = {}
                _field[field] = [op, condition];
                field = _field;
            }
            this.options['where'] = field;
            //1.字符分割拆解
            return this;
        }

        /**
         * 写入数据
         * @param  {Object} data [description]
         * @return {[type]}      [description]
         */
        async insert(data = {}) {
            try {
                if (empty(data)) {
                    throw new Error('写入数据不能为空');
                }
                let collect = await this.connection();
                //处理返回值
                return await new Promise((resolve, reject) => {
                    collect.insert({
                        tableName: this.options['name'],
                        data: data,
                        success: (res) => {
                            resolve(true)
                        },
                        error: (error) => {
                            reject(error)
                        }
                    })
                })
            } catch (error) {
                throw error;
            }
        }

        /**
         * 数据查询
         * @return {[type]} [description]
         */
        async select(fields = "") {
            try {
                let collect = await this.connection();
                //处理返回值
                return await new Promise((resolve, reject) => {
                    collect.query({
                        tableName: this.options['name'],
                        condition: item => {
                            let flag = false;
                            for (let key in this.options['where']) {
                                let _item = this.options['where'][key];
                                let op = this.exp['eq'];
                                let value = _item;
                                if (Object.prototype.toString.call(_item) === "[object Array]") {
                                    op = this.exp[_item[0]];
                                    value = _item[1];
                                }
                                if (this.$exps[op](item[key], value)) {
                                    flag = true;
                                } else {
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag) {
                                return item;
                            }
                        },
                        success: (res) => {
                            console.log("查询到到数据集", res)
                            resolve(true)
                        },
                        error: (error) => {
                            reject(error)
                        }
                    })
                })
            } catch (error) {
                throw error;
            }
        }

        /**
         * 写入数据
         * @param  {Object} data [description]
         * @return {[type]}      [description]
         */
        async update(data = {}) {
            try {
                if (empty(data)) {
                    throw new Error('写入数据不能为空');
                }
                let collect = await this.connection();
                //处理返回值
                return await new Promise((resolve, reject) => {
                    collect.update({
                        tableName: this.options['name'],
                        condition: item => {
                            let flag = false;
                            for (let key in this.options['where']) {
                                let _item = this.options['where'][key];
                                let op = this.exp['eq'];
                                let value = _item;
                                if (Object.prototype.toString.call(_item) === "[object Array]") {
                                    op = this.exp[_item[0]];
                                    value = _item[1];
                                }
                                if (this.$exps[op](item[key], value)) {
                                    flag = true;
                                } else {
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag) {
                                return item;
                            }
                        },
                        handle: r => {
                            for (const key in data) {
                                r[key] = data[key]
                            }
                        },
                        success: (res) => {
                            resolve(true)
                        },
                        error: (error) => {
                            reject(error)
                        }
                    })
                })
            } catch (error) {
                throw error;
            }
        }

        /**
         * 写入数据
         * @return {[type]}      [description]
         */
        async delete() {
            try {
                let collect = this.connection();
                //处理返回值
                return await new Promise((resolve, reject) => {
                    collect.delete({
                        tableName: this.options['name'],
                        condition: item => {
                            let flag = false;
                            for (let key in this.options['where']) {
                                let _item = this.options['where'][key];
                                let op = this.exp['eq'];
                                let value = _item;
                                if (Object.prototype.toString.call(_item) === "[object Array]") {
                                    op = this.exp[_item[0]];
                                    value = _item[1];
                                }
                                if (this.$exps[op](item[key], value)) {
                                    flag = true;
                                } else {
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag) {
                                return item;
                            }
                        },
                        success: (res) => {
                            resolve(true)
                        },
                        error: (error) => {
                            reject(error)
                        }
                    })
                })
            } catch (error) {
                throw error;
            }
        }


    }

    class sql {
        /**
         * 数据库连接实例
         * @type {Array}
         */
        static instance = [];

        /**
         * 数据库初始化，并取得数据库类实例
         * @access public
         * @param  {object}    config 连接配置
         * @param  {boolean|string} name   连接标识 true 强制重新连接
         * @return Connection
         * @throws Exception
         */
        static connect(config = [], name = false) {
            if (false === name) {
                name = md5(JSON.stringify(config).toString());
            }
            if (true === name || !this.instance[name]) {
                this.instance[name] = new db(config);
            }
            return this.instance[name];
        }
    }

    let $db = sql.connect(dbConfig);

    Vue.prototype.$db = $db;
}

export default {install};
