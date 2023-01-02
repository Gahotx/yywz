import { request } from '@/utils/request'
import type { User, CodeType } from '@/types/user'

/**
 * 登录--密码登录
 * @param mobile
 * @param password
 * @returns
 */
export function loginByPwd(mobile: string, password: string) {
  return request<User>({
    url: '/login/password',
    method: 'POST',
    data: {
      mobile,
      password
    }
  })
}

/**
 * 获取手机验证码
 * @param mobile
 * @param type
 * @returns
 */
export function getMobileCode(mobile: string, type: CodeType) {
  return request({
    url: '/code',
    method: 'GET',
    params: {
      mobile,
      type
    }
  })
}

/**
 * 登录--手机验证码登录
 * @param mobile
 * @param code
 * @returns
 */
export function loginByCode(mobile: string, code: string) {
  return request<User>({
    url: '/login',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}
