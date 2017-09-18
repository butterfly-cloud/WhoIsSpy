var gbdata = getApp()
Page({
  data: {
    array: [ '4', '5', '6'],
    objectArray: [
      {
        id: 0,
        name: '4'
      },
      {
        id: 1,
        name: '5'
      },
      {
        id: 2,
        name: '6'
      }
    ],
    index: 0,
  },


  bindAccountChange: function (e) {
    gbdata.globalData.player_num = this.data.array[e.detail.value]
    this.setData({
      index: e.detail.value
    })
  },
  switchChange: function (e) {
    gbdata.globalData.baiban = e.detail.value
  },

  init: function () {
    wx.navigateTo({
      url: '../play/play'
    })
  },

  //彩蛋
  caidan: function() {
    wx.showModal({
      title: 'wanna talking to me?',
      showCancel: false,
      content: '微博 @克劳德-sh'
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      imageUrl: '../../files/wd.jpeg'
    }
  }

})