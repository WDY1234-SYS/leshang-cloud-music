import request from '../../utils/request'
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //轮播图数据
    recommendList: [], //推荐歌单数据 
    topList: [], //排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //获取轮播图数据
    let result1 = await request('/banner', { type: 2 });
    this.setData({
      bannerList: result1.banners
    });
    //获取推荐歌单数据
    let result2 = await request('/personalized', { limit: 10 });
    this.setData({
      recommendList: result2.result
    })
    //获取排行榜数据
    /* 需求分析
        1.需要根据idx的值获取对应的数据
        2.idx取值范围：0-20
        因此需要发送5次请求
    */
    let index = 0;
    let resultArr = [];
    while (index < 5) {
      let result3 = await request('/top/list', { idx: index++ });
      //splice会修改原数组，可以对指定的数组进行增删改，slice不会
      let topListItem = { name: result3.playlist.name, tracks: result3.playlist.tracks.slice(0, 3) };
      resultArr.push(topListItem);
      //此处不需要等待5次请求全部结束才更新，用户体验较好，但渲染次数多
      this.setData({
        topList: resultArr
      })
    }
    //更新topList的状态值，在此处更新会导致发送请求的过程中页面长时间白屏，用户体验差
    /* this.setData({
      topList: resultArr
    }) */
  },

  //跳转至每日推荐页面的回调
  toRecommendSong() {
    wx.navigateTo({
      url:'/songPackages/recommendSong/recommendSong'
    })
  },
  //跳转至other页面
  toOther() {
    wx.navigateTo({
      url:'/otherPackages/other/other'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})