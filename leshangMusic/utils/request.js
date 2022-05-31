import config from './config'
//发送ajax请求
/* 
1.封装功能函数
2.封装功能组件
*/
export default (url, data = {}, method = "GET") => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.mobileHost + url,
            data,
            method,
            header: {
                cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
            },
            success: (res) => {
                //resolve修改promise状态为成功状态
                resolve(res.data);
                if (data.isLogin) {
                    // wx.setStorageSync('cookies',res.cookies)  //同步
                    // 将用户的cookie存入至本地 异步
                    wx.setStorage({
                        key: 'cookies',
                        data: res.cookies
                    })
                }
            },
            fail: (err) => {
                //resolve修改promise状态为失败状态
                reject(err)
            }
        })
    })
}