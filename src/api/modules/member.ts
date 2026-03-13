import { IS_MOCK } from '@/config/env'
import { request } from '@/utils/request'
import { memberProfile } from '@/mock/member'
import type { GetMemberProfileResponse } from '@/types/api/member'

export function getMemberProfile(): Promise<GetMemberProfileResponse> {
    if (IS_MOCK) {
        return Promise.resolve({
            code: 0,
            message: 'ok',
            data: memberProfile,
        })
    }

    return request({
        url: '/member/profile',
        method: 'GET',
    })
}