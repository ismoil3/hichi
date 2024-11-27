'use client'

import '../globals.css'
import TranslatorProvider from '@/components/providers/translator-provider'
import ThemeWrapper from '@/components/providers/theme-provider'
import Link from 'next/link'
import { Button } from '@mui/material'
import { NotificationsOutlined, PersonOutlineRounded } from '@mui/icons-material'
import { usePathname } from 'next/navigation'

export default function SettingLayout({ children }) {
    const path = usePathname()
    return (
        <ThemeWrapper>
            <div className='flex w-full'>
                <div className='h-full flex flex-col gap-4 px-4 pt-10'>
                    <p className='text-xl font-[700] ml-8'>Настройки</p>
                    <div className='flex flex-col gap-1'>
                        <Link href='/setting'>
                            <div className={"flex items-center active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-100 duration-300 hover:scale-[1.01] cursor-pointer" + (path == '/setting' && " bg-gray-500/10")}>
                                <PersonOutlineRounded />
                                <p className="text-sm">Редактировать профиль</p>
                            </div>
                        </Link>
                        <Link href='/setting/notifications'>
                            <div className="flex items-center active:opacity-50 gap-4 rounded-md p-3 hover:bg-gray-100 duration-300 hover:scale-[1.01] cursor-pointer">
                                <NotificationsOutlined />
                                <p className="text-sm">Уведомления</p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className='w-full max-w-[650px] mx-auto'>{children}</div>
            </div>
        </ThemeWrapper>
    )
}
