// 依賴、訂閱者模式
class Dep {
  constructor() {
    this.subscribers = []
  }

  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target)
    }
  }

  notify() {
    this.subscribers.forEach(sub => sub())
  }
}

let target, total, salePrice
let data = { price: 5, quantity: 2 }

function observe(obj) {
  Object.keys(obj).forEach(key => {
    let internalValue = obj[key]
    const dep = new Dep()

    Object.defineProperty(obj, key, {
      get() {
        dep.depend() // 儲存當前依賴方法 target
        console.log(`get ${key}: ${internalValue}`)
        return internalValue
      },

      set(newVal) {
        console.log(`set ${key}: ${newVal}`)
        internalValue = newVal
        dep.notify() // 執行儲存方法
      },
    })
  })
}

// 監聽模式
function watcher(myFunc) {
  target = myFunc
  target()
  target = null
}

observe(data)

function updateTotal() {
  total = data.price * data.quantity
}

function updateSalePrice() {
  salePrice = data.price * 0.9
}

watcher(() => {
  updateTotal()
  updateSalePrice()
})
