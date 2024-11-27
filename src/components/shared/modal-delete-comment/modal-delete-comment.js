import { useSearchStore } from '@/store/search-history/search-history'
import { useProfileStore } from '@/store/user-profile/user-profile'
import { modalStyle } from '@/style/modal-style'
import { Box, Modal, Typography } from '@mui/material'
import React from 'react'

const ModalDeleteComment = () => {
  const { isOpenModalDeleteComment, commentId, deleteComment, setCloseModalDeleteComment } =
        useProfileStore()
    
  return (
    <Modal
      open={isOpenModalDeleteComment}
      onClose={setCloseModalDeleteComment}
      aria-labelledby='modal-modal-delete-comment'
    >
      <Box
        sx={modalStyle}
      >
        <div className='w-full text-sm font-[600]'>
          <button
            onClick={() => {
              deleteComment(commentId)
              setCloseModalDeleteComment()
            }}
            className='w-full py-3 border-t-[1px] border-gray-500/40 duration-200 text-red-500 active:bg-gray-400/30'
          >
            Удалить
          </button>
          <button
            onClick={() => {
              setCloseModalDeleteComment()
            }}
            className='w-full py-3 border-t-[1px] border-gray-500/40 duration-200 active:bg-gray-400/30'
          >
            Отмена
          </button>
        </div>
      </Box>
    </Modal>
  )
}

export default ModalDeleteComment
