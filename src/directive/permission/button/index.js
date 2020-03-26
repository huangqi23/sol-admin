import Vue from 'vue'
import store from '../../../store'

/** 权限指令**/

const has =Vue.directive('has', {
    inserted: function (el, binding, vnode){
        if (!Vue.prototype.$_has(binding.value)) {
            el.parentNode.removeChild(el)
        }
    }
})

// 权限检查方法
Vue.prototype.$_has = function(value) {
  if (!value) {
    return false
  }
  // 获取用户按钮权限
  const dynamicButtons = store.getters.buttons
  if (dynamicButtons === undefined || dynamicButtons === null || dynamicButtons.length < 1) {
    return false
  }
  if (value instanceof Array && value.length > 0) {
    const hasPermission = dynamicButtons.some(button => {
      return value.includes(button.resources)
    })
    return hasPermission
  } else {
    const hasPermission = dynamicButtons.some(button => {
      return button.resources === value
    })
    return hasPermission
  }
}
export {has}

