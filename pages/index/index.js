//index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    currentDate: util.formatDate(new Date()),
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    getFinishCount: 0,
    todoList: [{
      todoId: 'cdsdscwcrevvcddfvdf',
      title: '测试1',
      isFinish: false,
      finishCount: 1,
      createTime: 1529913111000,
      detail: [{
          todoDetialId: 'cdsdscdqwdqswdfvdf',
          title: '测试11',
          isFinish: true,
          createTime: 1529913121000,
        },
        {
          todoDetialId: 'cdsqwedcrevvcdedfvdf',
          title: '测试12',
          isFinish: false,
          createTime: 1529913131000,
        }
      ]
    }, {
      todoId: 'cdgtrgtrewfrevdffvdf',
      title: '测试2',
      finishCount: 1,
      isFinish: false,
      createTime: 1529913574000
    }, {
      todoId: 'cdsdscwc5gythyujnhvdf',
      title: '测试3',
      finishCount: 1,
      isFinish: true,
      createTime: 1529913556000
    }, {
      todoId: 'cdsdscwcnhgbgvcdsdewdf',
      title: '测试4',
      finishCount: 1,
      isFinish: false,
      createTime: 1529913588000
    }]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 更改当前状态
  changeStatus(e) {
    const clickId = e.currentTarget.dataset.id
    if (!clickId) return
    const list = this.data.todoList
    const clickItem = list.filter((el,index) => {
      return clickId === el.todoId
    })
    let clickNo
    for (var i = 0; i < list.length; i++) {
      if (list[i].todoId === clickId) {
        clickNo = i
        break
      }
    }
    const currentStatus = list[clickNo].isFinish
    const str = "todoList[" + clickNo + "].isFinish"
    this.setData({
      [str]: !currentStatus
    })
    wx.vibrateShort()
  },
  // 查看详细信心
  viewDetail(e){
    console.log(e)
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  }
})