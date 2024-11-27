import { useProfileStore } from '@/store/user-profile/user-profile';
import { Box, Modal } from '@mui/material';
import React from 'react';
import Router from "next/navigation";

const ModalMyProfileSettings = () => {
    const {
        isOpenModalMyProfileSettings,
        setCloseModalMyProfileSettings,
    } = useProfileStore();

    const actions = [
        { label: 'Приложения и сайты', onClick: () => console.log('Приложения и сайты') },
        { label: 'QR-код', onClick: () => console.log('QR-код') },
        { label: 'Уведомления', onClick: () => console.log('Уведомления') },
        { label: 'Настройки и конфиденциальность', onClick: () => console.log('Настройки') },
        { label: 'Meta Verified', onClick: () => console.log('Meta Verified') },
        { label: 'Родительский контроль', onClick: () => console.log('Родительский контроль') },
        { label: 'Входы в аккаунт', onClick: () => console.log('Входы в аккаунт') },
        {
            label: 'Выйти', onClick: () => {
                localStorage.removeItem('access_token')
                window.location.href = '/login'
            }, style: 'font-bold text-red-500'
        },
        { label: 'Отмена', onClick: setCloseModalMyProfileSettings, style: 'font-bold' },
    ];

    return (
        <Modal
            open={isOpenModalMyProfileSettings}
            onClose={setCloseModalMyProfileSettings}
            aria-labelledby="modal-actions"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 24,
                    overflow: 'hidden',
                }}
            >
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`w-full py-3 px-4 text-[15px] border-t-[1px] border-gray-200 first:border-none ${action.style || ''} hover:bg-gray-100`}
                    >
                        {action.label}
                    </button>
                ))}
            </Box>
        </Modal>
    );
};

export default ModalMyProfileSettings;