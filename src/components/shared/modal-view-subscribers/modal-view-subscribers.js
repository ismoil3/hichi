import { useProfileStore } from '@/store/user-profile/user-profile';
import { Close } from '@mui/icons-material';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ModalViewSubscribers = () => {
    const { t } = useTranslation()
    const {
        setCloseModalViewSubscribers,
        isOpenModalViewSubscribers,
        getMySubscribers,
        mySubscribers
    } = useProfileStore();

    useEffect(() => {
        getMySubscribers();
    }, []);
    console.log(mySubscribers);

    return (
        <Modal
            open={isOpenModalViewSubscribers}
            onClose={setCloseModalViewSubscribers}
            aria-labelledby="modal-actions"
        >
            <Box
                className="outline-none"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    maxWidth: '400px',
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 24,
                    overflow: 'hidden',
                }}
            >
                <div className='relative flex justify-center border-b-[1px] border-gray-500/40 py-2'>
                    <p className='font-[600]'>Подписчики</p>
                    <IconButton onClick={setCloseModalViewSubscribers} sx={{ position: 'absolute', top: '0', right: '0', color: 'black' }}><Close /></IconButton>
                </div>
                <div className='px-4'>
                    <div className='mt-6 rounded-lg bg-gray-300/20 w-full items-center flex justify-between py-2 px-4'>
                        <input value={'searchValue'} onChange={'setSearchValue'} className="outline-none bg-transparent w-full" type="text" placeholder={t('layout.search')} />
                        {'searchValue' != '' &&
                            <button
                                onClick={'clearSearchValue'}
                                className='bg-gray-500/40 px-[3px] text-white text-sm h-fit py-[0px] rounded-full'>⨉</button>}
                    </div>
                </div>
                <div>

                </div>
            </Box>
        </Modal>
    );
};

export default ModalViewSubscribers;
