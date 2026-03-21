/**
 * 常用表单验证规则
 */

/**
 * 验证是否为空字符串或全空格
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0
}

/**
 * 验证手机号（中国大陆）
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
 * 验证身份证号（简单版）
 */
export const isIdCard = (id: string): boolean => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id)
}

/**
 * 验证用户名
 * 4~20位，支持字母、数字、下划线、中划线
 */
export const isUsername = (username: string): boolean => {
  return /^[a-zA-Z0-9_-]{4,20}$/.test(username)
}

/**
 * 验证中文姓名/收货人姓名
 * 2~20位，支持中文、字母、空格、·、•
 */
export const isRealName = (name: string): boolean => {
  return /^[\u4e00-\u9fa5a-zA-Z·•\s]{2,20}$/.test(name)
}

/**
 * 验证姓名是否包含文字
 * 防止全数字
 */
export const hasText = (str: string): boolean => {
  return /[\u4e00-\u9fa5a-zA-Z]/.test(str)
}

/**
 * 验证地区名称
 * 2~20位，支持中文、字母、数字、空格、中划线
 */
export const isAreaName = (area: string): boolean => {
  return /^[\u4e00-\u9fa5a-zA-Z0-9\s-]{2,20}$/.test(area)
}

/**
 * 验证详细地址
 * 长度 5~100
 */
export const isAddressDetail = (detail: string): boolean => {
  const value = detail.trim()
  return value.length >= 5 && value.length <= 100
}

/**
 * 验证密码
 * 6~20位，至少包含字母和数字
 */
export const isPassword = (password: string): boolean => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&_.-]{6,20}$/.test(password)
}

/**
 * 验证 URL
 */
export const isUrl = (url: string): boolean => {
  return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(url)
}

/**
 * 验证是否为正整数
 */
export const isPositiveInteger = (value: string | number): boolean => {
  return /^[1-9]\d*$/.test(String(value))
}

/**
 * 验证是否在指定长度范围内
 */
export const isLengthInRange = (str: string, min: number, max: number): boolean => {
  const len = str.trim().length
  return len >= min && len <= max
}
