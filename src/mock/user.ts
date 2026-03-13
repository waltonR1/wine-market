import type { UserInfo } from '@/types/model/user'

export const mockUserInfo: UserInfo = {
    id: 1,
    nickname: 'Walton',
    avatar: '',
    phone: '13800000000',
}

export const mockLoginResult = {
    token: 'mock-token-123456',
    userInfo: mockUserInfo,
}