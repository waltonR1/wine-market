/**
 * 常用表单验证规则
 */

/**
 * 验证手机号
 */
export const isPhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 */
export const isEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)
}

/**
 * 验证是否为空字符串或全空格
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0
}

/**
 * 验证是否为身份证号 (简单版)
 */
export const isIdCard = (id: string): boolean => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id)
}
