class Touches {
  _getIndex(e) {  // 获取滑动列表的下标值
    return e.currentTarget.dataset.index
  }

  _getMoveX(e, startX) {  // 获取滑动过程中滑动的距离
    return this.getClientX(e) - startX
  }

  _getEndX(e, startX) {  // 获取滑动结束滑动的距离
    let touch = e.changedTouches
    if (touch.length === 1) {
      return touch[0].clientX - startX
    }
  }

  _resetData(dataList) {  // 重置数据， 把所有的列表 left 置为 0
    for (let i in dataList) {
      dataList[i].left = 0
    }
    return dataList
  }

  getClientX(e) {  // 获取滑动的横坐标
    let touch = e.touches
    if (touch.length === 1) {
      return touch[0].clientX
    }
  }

  touchM(e, dataList, startX) {  // touchmove 过程中更新列表数据
    let list = this._resetData(dataList)
    const moveX = this._getMoveX(e, startX)
    if (moveX > 0) {
      list[this._getIndex(e)].left = 0
    } else if (moveX < -180) {
      list[this._getIndex(e)].left = -180
    } else {
      list[this._getIndex(e)].left = moveX
    }

    return list
  }

  touchE(e, todoList, startX, width) {  // touchend 更新列表数据
    let disX = Math.abs(todoList[this._getIndex(e)].left) > 180 ? -180 : todoList[this._getIndex(e)].left
    let status = disX === -180 ? true : false
    todoList = this._resetData(todoList)
    return { todoList, status }
  }

  deleteItem(e, dataList) {  // 删除功能
    dataList.splice(this._getIndex(e), 1)
    return dataList
  }
}

export default Touches