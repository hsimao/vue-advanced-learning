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
let deps = new Map()

function observe(data) {
  Object.keys(data).forEach(key => {
    deps.set(key, new Dep())
  })

  let dataWithoutProxy = data

  return new Proxy(dataWithoutProxy, {
    get(obj, key) {
      deps.get(key).depend()
      return obj[key]
    },
    set(obj, key, newVal) {
      obj[key] = newVal
      deps.get(key).notify()
      return true
    },
  })
}

// 監聽模式
function watcher(myFunc) {
  target = myFunc
  target()
  target = null
}

data = observe(data)

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

// proxy 可以隨時新增響應屬性
deps.set('discount', new Dep())
data['discount'] = 5

watcher(() => {
  salePrice = data.price - data.discount
})
