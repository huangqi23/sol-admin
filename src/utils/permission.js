import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

export function checkBtnPermission(value) {
  // example
  // array :  v-if="['userList:add','userList:edit']"
  // single : v-if="'userList:add'"
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
