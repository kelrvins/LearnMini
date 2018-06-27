import util from '../../utils/util.js'
const App = getApp()
Page({
  data: {
    todoList: [],
    createTime: '',
    newStepText: '',
    todoItem: {},
    todoListIndex: ''
  },
  syncStorage() {
    try {
      this.data.todoList.splice(this.data.todoListIndex, 1, this.data.todoItem)
      wx.setStorageSync('todoList', this.data.todoList)
      var pages = getCurrentPages();
      if (pages.length > 1) {
        var prePage = pages[pages.length - 2];
        prePage.getStorageData()
      }
    } catch (e) {
      console.log(e)
    }
  },
  addtodo(e) {
    if (!e.detail.value) {
      return
    }
    if (!this.data.todoItem.detail) {
      this.data.todoItem.detail = []
    }
    this.data.todoItem.detail.push({
      todoDetialId: util.newGuid(),
      title: e.detail.value,
      isTouchMove: false,
      left: 0,
      isFinish: false,
      createTime: util.timeStamp()
    })
    this.setData({
      todoItem: this.data.todoItem, // 更新数据
      newStepText: ''  // 重置输入框
    })
    wx.vibrateShort()
    this.syncStorage()
  },
  todotouchstart(e) {
    let startX = App.Touches.getClientX(e)
    startX && this.setData({
      startX
    })
  },
  todotouchmove(e) {
    let todoItem = App.Touches.touchM(e, this.data.todoItem.detail, this.data.startX)
    const str = "todoItem.detail"
    todoItem && this.setData({
      [str]: todoItem
    })
  },
  todotouchend(e) {
    const width = 130 // 定义操作列表宽度
    let {
      todoList,
      status
    } = App.Touches.touchE(e, this.data.todoItem.detail, this.data.startX, width)
    const str = "todoItem.detail"
    todoList && this.setData({
      [str]: todoList
    })
    if (status) {
      this.delTodo(App.Touches._getIndex(e))
    }
  },

  // 更改当前状态
  changeDetailStatus(e) {
    const clickId = e.currentTarget.dataset.id
    if (!clickId) return
    const list = this.data.todoList
    let clickNo
    for (var i = 0; i < list.length; i++) {
      if (list[i].todoId === clickId) {
        clickNo = i
        break
      }
    }
    const currentStatus = list[clickNo].isFinish
    const str = "todoList[" + clickNo + "].isFinish"
    const str1 = "todoItem.isFinish"
    this.setData({
      [str]: !currentStatus,
      [str1]: !currentStatus
    })
    wx.vibrateShort()
    this.syncStorage()
  },
  // 更改当前状态
  changeStatus(e) {
    const clickId = e.currentTarget.dataset.id
    if (!clickId) return
    const list = this.data.todoItem.detail
    let clickNo
    for (var i = 0; i < list.length; i++) {
      if (list[i].todoDetialId === clickId) {
        clickNo = i
        break
      }
    }
    const currentStatus = list[clickNo].isFinish
    const str = "todoList[" + this.data.todoListIndex + "].detail[" + clickNo + "].isFinish"
    const str1 = "todoItem.detail[" + clickNo + "].isFinish"
    this.setData({
      [str]: !currentStatus,
      [str1]: !currentStatus
    })
    const finishNum = list.filter(el => el.isFinish)
    const countStr = "todoList[" + this.data.todoListIndex + "].finishCount"
    const countStr1 = "todoItem.finishCount"
    this.setData({
      [countStr]: finishNum.length,
      [countStr1]: finishNum.length
    })
    wx.vibrateShort()
    this.syncStorage()
  },
  delTodo(e) {
    wx.vibrateShort()
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          that.data.todoItem.detail.splice(e, 1)
          const str = "todoItem.detail"
          that.setData({
            [str]: that.data.todoItem.detail
          })
          that.syncStorage()
        }
      }
    })
  },

  removeTodo(e) {
    let _index = e.target.dataset.index
    console.log(_index)
    wx.vibrateShort()
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          that.data.todoList.splice(_index, 1)
          that.setData({
            todoList: that.data.todoList
          })
          wx.setStorageSync('todoList', that.data.todoList)
          var pages = getCurrentPages();
          if (pages.length > 1) {
            var prePage = pages[pages.length - 2];
            prePage.getStorageData()
          }
          if (!that.data.todoList.length){
            wx.navigateBack()
            var prePage = pages[pages.length - 2];
            prePage.pageScrollToTop()
          }
        }
      }
    })
  },
  onLoad(option) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#e23d03',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    const that = this
    wx.getStorage({
      key: 'todoList',
      success: function (res) {
        const currentTodo = res.data.filter(el => el.todoId === option.todo_id)
        wx.setNavigationBarTitle({
          title: currentTodo[0].title.length > 7 ? currentTodo[0].title.substr(0, 7) + '...' : currentTodo[0].title
        })
        that.setData({
          createTime: util.formatUnixTime(currentTodo[0].createTime),
          todoList: res.data,
          todoItem: currentTodo[0],
          todoListIndex: option.index
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  }
})