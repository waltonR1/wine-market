import type { ApiResponse } from '@/types/common'
import type { MemberProfile, WalletInfo } from '@/types/model/member'

export type GetMemberProfileResponse = ApiResponse<MemberProfile>

export type GetWalletResponse = ApiResponse<WalletInfo>