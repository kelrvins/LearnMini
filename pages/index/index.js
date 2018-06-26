//index.js
import util from '../../utils/util.js'
import todoList from './mock.js'
//获取应用实例
const App = getApp()

Page({
  data: {
    currentDate: util.formatDate(new Date()),
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    newTodoText: '',
    titletext: '',
    todoList
  },
  // 更改当前状态
  changeStatus(e) {
    const clickId = e.currentTarget.dataset.id
    if (!clickId) return
    const list = this.data.todoList
    const clickItem = list.filter((el, index) => {
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
  // 查看详细信息
  viewDetail(e) {
    console.log(this.data.todoList[App.Touches._getIndex(e)])
    const detail = this.data.todoList[App.Touches._getIndex(e)]

    wx.navigateTo({
      url: `../detail/detail?title=${detail.title}&createTime=${detail.createTime}`
    })
  },
  todotouchstart(e) {
    let startX = App.Touches.getClientX(e)
    startX && this.setData({
      startX
    })
  },
  todotouchmove(e) {
    let todoList = App.Touches.touchM(e, this.data.todoList, this.data.startX)
    todoList && this.setData({
      todoList
    })
  },
  todotouchend(e) {
    const width = 180 // 定义操作列表宽度
    let {
      todoList,
      status
    } = App.Touches.touchE(e, this.data.todoList, this.data.startX, width)
    todoList && this.setData({
      todoList
    })
    if (status) {
      this.delTodo(App.Touches._getIndex(e))
    }
  },
  delTodo(e) {
    wx.vibrateShort()
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          that.data.todoList.splice(e, 1)
          that.setData({
            todoList: that.data.todoList
          })
        }
      }
    })
  },
  getUserInfo: function(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '拒绝尼玛啊',
        icon: 'none',
        duration: 5000
      })
      return
    }
    App.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  addtodo(e) {
    this.data.todoList.push({
      todoId: util.newGuid(),
      title: e.detail.value,
      isTouchMove: false,
      left: 0,
      finishCount: 0,
      isFinish: false,
      createTime: util.timeStamp()
    })
    this.setData({
      todoList: this.data.todoList, // 更新数据
      newTodoText: '',  // 重置输入框
      scrollToView: "todoContainerEnd"  //滚动到底
    })
  },
  onLoad: function() {
    // 初始化任务数据
    this.data.todoList.forEach(el => {
      el.isTouchMove = false
      el.left = 0
    })
    this.setData({
      todoList: this.data.todoList
    })
    if (App.globalData.userInfo) {
      this.setData({
        userInfo: App.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      App.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
  },
  // 根据滚动动态调整顶部文字颜色
  detectiveScrollTop(e){
    if (e.detail.scrollTop > 200 && this.data.titletext !== 'TODay') {
      this.setData({
        titletext: 'TODay'
      })
      wx.setNavigationBarTitle({
        title: this.data.titletext
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#e23d03',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    } else if (e.detail.scrollTop < 200 && this.data.titletext !== 'To-Do') {
      this.setData({
        titletext: 'To-Do'
      })
      wx.setNavigationBarTitle({
        title: this.data.titletext
      })
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
  }
})