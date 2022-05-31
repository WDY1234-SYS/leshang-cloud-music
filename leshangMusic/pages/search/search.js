
import request from "../../utils/request"
let isSend = false; //用于函数节流
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //placeholder的内容
    searchHotList: [], //热搜榜内容
    searchContent: '', //用户输入的表单项数据 
    searchList: [], //关键字模糊匹配的数据
    historyList: [] //历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化数据
    this.getInitData();
    //获取历史记录
    this.getSearchHistory();
  },


  //获取初始化的数据
  async getInitData() {
    let placeholderData = await request('/search/default');
    //获取热搜榜
    let searchHotData = await request('/search/hot/detail');
    let placeholderContent = placeholderData.data.showKeyword;
    this.setData({
      placeholderContent,
      searchHotList: searchHotData.data
    });
  },
  //获取本地记录的功能函数
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory');
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },
  //表单项内容发生改变的回调
  handleInputChange(event) {
    //更新searchContent的状态数据
    this.setData({
      searchContent: event.detail.value.trim()
    })
    //函数节流
    if (isSend) {
      return
    }
    //获取关键字模糊匹配的数据 
    this.getSearchList(event);
    isSend = true;
    setTimeout(() => {
      isSend = false;
    }, 300)

  },
  //获取关键字模糊匹配数据的功能函数
  async getSearchList(event) {
    if (!this.data.searchContent) {
      //没有输入搜索内容时，置空searchList，显示热搜榜
      this.setData({
        searchList: []
      })
      return;
    }
    let { searchContent, historyList } = this.data;
    //发请求获取关键字模糊匹配数据
    let searchListData = await request('/search', { keywords: searchContent, limit: 10 });
    this.setData({
      searchList: searchListData.result.songs
    })

    //将搜索的关键字添加到搜索历史记录中
    if (historyList.indexOf(searchContent) === -1) {
      historyList.unshift(searchContent);
    } else {
      historyList.splice(historyList.indexOf(searchContent), 1);
      historyList.unshift(searchContent);
    }
    this.setData({
      historyList
    })
    //将历史记录存储到本地存储
    wx.setStorageSync('searchHistory', historyList);
  },
  //清空搜索内容
  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
  //删除搜索历史记录
  deleteSearchHistory() {
    wx.showModal({
      content: '确认清除历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          //清空data中historyList
          this.setData({
            historyList: []
          });
          //清空本地存储的历史记录
          wx.removeStorageSync('searchHistory');
        }
      }
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