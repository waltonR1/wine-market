/**
 * 格式化金额
 * @param value 金额（分或元）
 * @param decimal 小数位数，默认 2
 */
export const formatPrice = (value: number | string, decimal: number = 2): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0.00'
  return num.toFixed(decimal)
}

function toDate(input: Date | number | string): Date | null {
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input
  }

  if (typeof input === 'number') {
    const d = new Date(input)
    return isNaN(d.getTime()) ? null : d
  }

  const normalized = input.trim().replace('T', ' ').replace(/-/g, '/')
  const d = new Date(normalized)
  return isNaN(d.getTime()) ? null : d
}

/**
 * 格式化日期
 * @param date 日期对象 / 时间戳 / 日期字符串
 * @param format 支持 YYYY MM DD HH mm ss
 */
export const formatDate = (date: Date | number | string, format: string = 'YYYY-MM-DD'): string => {
  const d = toDate(date)
  if (!d) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export const formatDateTime = (date: Date | number | string): string => {
  return formatDate(date, 'YYYY-MM-DD HH:mm')
}

/**
 * 隐藏手机号中间 4 位
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

type AddressFields = {
  province?: string
  city?: string
  district?: string
  detail?: string
}

/**
 * 地址去重
 */
export function formatAddress(address: AddressFields): string {
  const province = address.province?.trim() || ''
  const city = address.city?.trim() || ''
  const district = address.district?.trim() || ''
  const detail = address.detail?.trim() || ''

  const cityPart = province && city && province === city ? '' : city

  return [province, cityPart, district, detail]
    .filter(Boolean)
    .join(' ')
}
