'use client'
import { useProfileStore } from '@/store/user-profile/user-profile'
import { Box, IconButton, Menu, Modal } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { SwiperSlide, Swiper } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {
  AddReactionOutlined,
  BookmarkBorderOutlined,
  Favorite,
  FavoriteBorderOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  ModeCommentRounded,
  MoreHorizOutlined,
  Person,
  SendRounded
} from '@mui/icons-material'
import Image from 'next/image'
import { apiSoftInsta } from '@/app/config/config'
import ModalDeleteComment from '../modal-delete-comment/modal-delete-comment'
import ModalDeletePost from '../modal-delete-post/modal-delete-post'
import ModalDeleteOkPost from '../modal-delete-post/modal-ok-delete-post'
import { useToolsStore } from '@/store/smile-tools/smile-tools'
import EmojiPicker from 'emoji-picker-react';

function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return `Сейчас`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин.`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} час.`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} дн.`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} нед.`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} мес.`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} лет.`
}

const isImage = fileName => {
  return /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName)
}

const isVideo = fileName => {
  return /\.(mp4|webm|ogg|x-matroska|mkw)$/i.test(fileName)
}

const ModalViewPost = () => {
  const [PlayIndex, setPlayIndex] = useState(null)
  const [DoNotPlay, setDoNotPlay] = useState('')
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const open = Boolean(anchorEl);
  const {
    isOpenModalViewPost,
    initialSlide,
    setCloseModalViewPost,
    getPersonPosts,
    personPosts,
    person,
    inputs,
    setInput,
    likePost,
    addCommentToPost,
    setOpenModalDeleteComment,
    setOpenModalDeletePost,
    setCommentId,
    setPostId
  } = useProfileStore()

  useEffect(() => {
    getPersonPosts()
  }, [])

  const handleClick = (event, postId) => {
    setCurrentPostId(postId);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ModalDeletePost />
      <ModalDeleteOkPost />
      <ModalDeleteComment />
      <Modal
        open={isOpenModalViewPost}
        onClose={setCloseModalViewPost}
        aria-labelledby='modal-modal-delete'
      >
        <div
          className='w-[100%] p-2 outline-none absolute translate-x-[-50%] translate-y-[-50%] h-[90vh] left-[50%] top-[50%] flex gap-4 justify-between items-center'
          onClick={setCloseModalViewPost}
        >
          <IconButton
            onClick={e => {
              e.stopPropagation()
              const video = document.getElementById(`video-${PlayIndex}`)
              PlayIndex >= 0 && DoNotPlay != '"<img' ? video?.play() : ''

              PlayIndex >= 0
                ? document.getElementById(`video-${PlayIndex + 1}`)?.pause()
                : ''
              if (
                document.getElementById(`video-${PlayIndex + 1}`)
              ) {
                document.getElementById(
                  `video-${PlayIndex + 1}`
                ).currentTime = 0
              }
            }}
            className='backSli'
            sx={{
              backgroundColor: 'white',
              ':hover': {
                bgcolor: '#fff7'
              },
              transition: 'all 0.2s',
              ':active': {
                scale: '.8'
              }
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <div
            className='h-[100%] w-[87%]'
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <Swiper
              navigation={{
                nextEl: '.ForwardSli',
                prevEl: '.backSli'
              }}
              onSlideChange={e => {
                setPlayIndex(e.activeIndex)
                setDoNotPlay(JSON.stringify(e?.slides[e.activeIndex]?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.innerHTML).slice(0, 5))
              }}
              pagination={false}
              modules={[Navigation]}
              initialSlide={initialSlide}
              allowTouchMove={false}
              className='mySwiper rounded size-[100%]'
            >
              {personPosts.map((post, i) => (
                <SwiperSlide key={i}>
                  <div
                    className='size-full grid grid-cols-2'
                    onPointerEnter={e => {
                      e.stopPropagation()
                    }}
                    onClick={e => {
                      e.stopPropagation()
                    }}
                  >
                    <Swiper
                      navigation={true}
                      pagination={{ clickable: true }}
                      nested={true}
                      onSlideChange={(swiper) => {
                        swiper.slides.forEach((slide, index) => {
                          const video = slide.querySelector('video');
                          if (video) {
                            video.pause();
                            video.currentTime = 0;
                            video.classList.remove('playing-video');
                          }
                        });

                        const activeSlide = swiper.slides[swiper.activeIndex];
                        const activeVideo = activeSlide?.querySelector('video');
                        if (activeVideo) {
                          activeVideo.classList.add('playing-video');
                          activeVideo.play().catch((err) => {
                            console.error('Ошибка воспроизведения видео:', err);
                          });
                        }
                      }}
                      modules={[Navigation, Pagination]}
                      className='mySwiper size-[100%]'
                    >
                      {post.images.map((item, index) => (
                        <SwiperSlide key={index}>
                          <div className='h-full bg-gray-950 w-full'>
                            {isImage(item) && (
                              <Image
                                src={apiSoftInsta + '/images/' + item}
                                alt=''
                                width={100}
                                height={100}
                                className='w-full h-full object-cover'
                                unoptimized
                              />
                            )}{' '}
                            {isVideo(item) && (
                              <video
                                loop
                                controls
                                muted
                                preload='auto'
                                id={`video-${i}`}
                                onPointerMove={(e) => {
                                  e.preventDefault();
                                }}
                                className='w-full mb-20 h-full'
                              >
                                <source
                                  src={`${apiSoftInsta}/images/${item}`}
                                  type={`video/${item.split('.').pop() || ''}`}
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div style={{ scrollbarWidth: 'none' }} className='flex flex-col overflow-auto justify-between'>
                      <div className=''>
                        <div className='flex justify-between sticky top-0 bg-white z-50 items-center border-b-[1px] p-3'>
                          <div className='flex gap-4 items-center'>
                            <div
                              style={{
                                backgroundImage: `url("${apiSoftInsta + '/images/' + person.image
                                  }")`
                              }}
                              className='size-[37px] bg-cover bg-center border rounded-full flex flex-col items-center justify-center'
                            >
                              {person.image ? (
                                <Image
                                  className={'size-[0%] rounded-full shadow-lg'}
                                  src={apiSoftInsta + '/images/' + person.image}
                                  width={50}
                                  priority
                                  quality={0}
                                  height={50}
                                  alt=''
                                />
                              ) : (
                                <Person className='text-gray-500' />
                              )}
                            </div>
                            <p className='font-[500] text-[13px]'>
                              {person.userName}
                            </p>
                          </div>
                          <IconButton onClick={() => {
                            setOpenModalDeletePost()
                            setPostId(post.postId)
                          }}>
                            <MoreHorizOutlined />
                          </IconButton>
                        </div>

                        <div style={{ scrollbarWidth: 'none' }} className='overflow-y-scroll scroll-smooth box-content'>
                          {post.comments?.length > 0 ?
                            post.comments?.map((comment, ic) => (
                              <div
                                key={ic}
                                className='p-4 py-2 border-b-[1px] flex justify-between items-center'
                              >
                                <div className='flex gap-4 items-center'>
                                  <div
                                    style={{
                                      backgroundImage: `url("${apiSoftInsta + '/images/' + person.image
                                        }")`
                                    }}
                                    className='size-[37px] bg-cover bg-center border rounded-full flex flex-col items-center justify-center'
                                  >
                                    {person.image ? (
                                      <Image
                                        className={
                                          'size-[0%] rounded-full shadow-lg'
                                        }
                                        src={
                                          apiSoftInsta +
                                          '/images/' +
                                          person.image
                                        }
                                        width={50}
                                        priority
                                        quality={0}
                                        height={50}
                                        alt=''
                                      />
                                    ) : (
                                      <Person className='text-gray-500' />
                                    )}
                                  </div>
                                  <div className='flex flex-col items-start'>
                                    <p className='font-[500] text-[13px]'>
                                      {/* {comment.userName} */}
                                      {comment.comment}
                                    </p>
                                    <div className='flex items-center gap-3'>
                                      <p className='font-[500] text-[13px]'>
                                        {timeAgo(comment.dateCommented)}
                                      </p>
                                      <button className='text-[13px]'>
                                        ответить
                                      </button>
                                      <IconButton
                                        onClick={() => {
                                          setOpenModalDeleteComment()
                                          setCommentId(comment.postCommentId)
                                        }}
                                      >
                                        <MoreHorizOutlined />
                                      </IconButton>
                                    </div>
                                  </div>
                                </div>
                                <IconButton>
                                  <FavoriteBorderOutlined />
                                </IconButton>
                              </div>
                            )) : <div className='mt-32'>
                              <p className='text-2xl font-[700]'>Комментариев пока нет.</p>
                              <p className='text-sm mt-2'>Начните переписку.</p>
                            </div>}
                        </div>
                      </div>

                      <div className='items-start flex flex-col border-t-[1px] sticky bottom-0 bg-white z-50 border-gray-500/40 w-full'>
                        <div className='flex justify-between w-full px-4 py-2'>
                          <div className='flex items-center w-fit gap-2'>
                            <IconButton
                              color='error'
                              onClick={() => likePost(post.postId)}
                            >
                              {post.postLike ? (
                                <Favorite
                                  sx={{
                                    color: 'red',
                                    ':active': { scale: '.5' },
                                    transition: 'all 0.2s'
                                  }}
                                />
                              ) : (
                                <FavoriteBorderOutlined
                                  sx={{
                                    ':active': { scale: '.5' },
                                    transition: 'all 0.2s'
                                  }}
                                />
                              )}
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                document
                                  .getElementById(
                                    `input-comment-${post.postId}`
                                  )
                                  ?.focus()
                              }
                            >
                              <ModeCommentRounded />
                            </IconButton>
                            <IconButton sx={{ transform: 'rotate(-35deg)' }}>
                              <SendRounded />
                            </IconButton>
                          </div>
                          <IconButton>
                            <BookmarkBorderOutlined />
                          </IconButton>
                        </div>
                        <div className='flex flex-col items-start px-4 py-2'>
                          <p className='font-[600] text-sm'>
                            {post.postLikeCount}{' '}
                            {'отмет' + (post.postLikeCount > 1 ? 'ок' : 'ка')}{' '}
                            {'"нравится"'}
                          </p>
                          <p className='text-[13px] text-gray-500'>
                            {timeAgo(post.datePublished)} назад
                          </p>
                        </div>

                        <div className='px-2 gap-2 border-t-[1px] border-gray-500 w-full items-center justify-between flex'>
                          <div>
                            <Menu
                              anchorEl={anchorEl}
                              open={open}
                              sx={{ maxWidth: '500px', top: '-75px', right: '-155px', width: '100%', padding: '0' }}
                              onClose={handleClose}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                            >

                              <EmojiPicker onEmojiClick={(e) => {
                                if (currentPostId) {
                                  setInput(
                                    currentPostId,
                                    inputs[currentPostId] ? inputs[currentPostId] + e?.emoji : e?.emoji
                                  );
                                }
                              }} />
                            </Menu>
                            <IconButton color='primary' onClick={(e) => handleClick( e,post.postId)}>
                              <AddReactionOutlined />
                            </IconButton>
                          </div>
                          <input
                            id={`input-comment-${post.postId}`}
                            type='text'
                            className='w-full outline-none p-4 text-sm placeholder:text-sm'
                            placeholder='Добавьте комментарий...'
                            value={inputs[post.postId] || ''}
                            onChange={e => {
                              setInput(post.postId, e.target.value)
                            }}
                            onKeyPress={e => {
                              if (e.key == 'Enter') {
                                addCommentToPost({
                                  comment: inputs[post.postId],
                                  postId: post.postId
                                })
                                setInput(post.postId, '')
                              }
                            }}
                          />
                          <IconButton
                            disabled={
                              inputs[post.postId]?.trim() ? false : true
                            }
                            onClick={() => {
                              addCommentToPost({
                                comment: inputs[post.postId],
                                postId: post.postId
                              })
                              setInput(post.postId, '')
                            }}
                            color='primary'
                          >
                            <SendRounded />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <IconButton
            onClick={e => {
              e.stopPropagation()
              const video = document.getElementById(`video-${PlayIndex}`)
              PlayIndex >= 0 && DoNotPlay != '"<img' ? video?.play() : ''

              document.getElementById(`video-${PlayIndex - 1}`)?.pause()
              if (
                document.getElementById(`video-${PlayIndex - 1}`)
              ) {
                document.getElementById(
                  `video-${PlayIndex - 1}`
                ).currentTime = 0
              }
            }}
            className='ForwardSli'
            sx={{
              backgroundColor: 'white',
              ':hover': {
                bgcolor: '#fff7'
              },
              transition: 'all 0.2s',
              ':active': {
                scale: '.8'
              }
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </div>
      </Modal>
    </>
  )
}

export default ModalViewPost