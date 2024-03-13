const fetch = require('node-fetch');

const sleep = ( time ) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
};

export default new class ApiMode {
    constructor() {
        this.ApiUrl = 'https://img-api.justrobot.dev';
        this.ratelimit = 1000; // 速率限制，单位毫秒
        this.lastReqTime = 0; // 最后一次请求时间
    };

    /** 检查频率是否过快 */
    async checkTimeLimit () {
        timenow = Date.now();
        if ( timenow - this.lastReqTime < this.ratelimit ) {
            await sleep(this.ratelimit - (timenow - this.lastReqTime));
        };
        return;
    };

    /** 以名称方式抽取一张图片 */
    async getImgByName ( name ) {

        await this.checkTimeLimit(); // 防止太快被封 IP
        let res = await fetch(`${this.ApiUrl}/${name}`);
        this.lastReqTime = Date.now(); // 更新最后一次请求时间
        
        if ( !res.ok ) {
            throw new Error(res.status); // 检查是否成功
        };

        return await res.buffer();
    };

    /** 以别名方式抽取一张图片(推荐)，功能上覆盖了名称方式 */
    async getImgByAlia ( alia ) {

        await this.checkTimeLimit();// 防止太快被封 IP
        let res = await fetch(`${this.ApiUrl}/${alia}`);
        this.lastReqTime = Date.now(); // 更新最后一次请求时间

        if ( !res.ok ) {
            throw new Error(res.status); // 检查是否成功
        };

        return await res.buffer();
    };

    /** 随机抽取一张图片 */
    async getRandImg () {

        await this.checkTimeLimit();// 防止太快被封 IP
        let res = await fetch(`${this.ApiUrl}/`);
        this.lastReqTime = Date.now(); // 更新最后一次请求时间

        if ( !res.ok ) {
            throw new Error(res.status); // 检查是否成功
        };

        return await res.buffer();
    };

    /** 获取 API 端当前的别名映射表 */
    async getAliaMap () {
        
        await this.checkTimeLimit();// 防止太快被封 IP
        let res = await fetch(`${this.ApiUrl}/AliasMap`);
        this.lastReqTime = Date.now(); // 更新最后一次请求时间

        if ( !res.ok ) {
            throw new Error(res.status); // 检查是否成功
        };

        return await res.json();
    };
};