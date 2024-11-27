'use client'
import {
  AssignmentInd,
  AutoAwesomeMotionRounded,
  BookmarkOutlined,
  Favorite,
  ModeComment,
  Person,
  RemoveRedEye,
  VideoLibraryRounded
} from '@mui/icons-material'
import Image from 'next/image'
import { apiSoftInsta } from '../config/config'
import {
  Box,
  Button,
  IconButton,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import { useProfileStore } from '@/store/user-profile/user-profile'
import { useEffect, useRef } from 'react'
import { setting, video } from '@/assets/icon/layout/svg'
import PropTypes from 'prop-types'
import React from 'react'
import Link from 'next/link'
import ModalPhoto from '@/components/shared/modal-photo/modal-photo'
import AlertO from '@/components/shared/alert/alert'
import ModalViewPost from '@/components/shared/modal-view-post/modal-view-post'
import { useToolsStore } from '@/store/smile-tools/smile-tools'
import ModalMyProfileSettings from '@/components/shared/modal-profile-my-setting/modal-profile-my-setting'
import ModalViewSubscribers from '@/components/shared/modal-view-subscribers/modal-view-subscribers'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ width: '100%', maxWidth: '900px', marginX: 'auto' }}>{children}</Box>}
    </div>
  )
}

const isImage = (fileName) => {
  return /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName);

};

const isVideo = (fileName) => {
  return /\.(mp4|webm|ogg|x-matroska|mkw)$/i.test(fileName);
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const Profile = () => {
  const [value, setValue] = React.useState(0)
  const [Mouse, setMouse] = React.useState(false)
  const [MouseId, setMouseId] = React.useState(null)
  const { windowWidth: ww } = useToolsStore()
  const {
    getPerson,
    person,
    getPersonPosts,
    setOpenModalPhoto,
    personPosts,
    setOpenModalViewPost,
    getPersonReels,
    personReels,
    setOpenModalMyProfileSettings,
    setInitialSlide,
    setOpenModalViewSubscribers,
    myId
    
  } = useProfileStore()
  
  const myReels = personReels.filter(video => video.userId == myId)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const buttonStyle = {
    color: 'black',
    bgcolor: '#bbb5',
    fontSize: '14px',
    fontWeight: '600',
    padding: '5px 16px',
    textTransform: 'none',
    borderRadius: '10px'
  }

  useEffect(() => {
    getPerson()
    getPersonPosts()
    getPersonReels()
  }, [])

  console.log(myReels);

  const bp = {
    "w767": ww <= 767 ? true : false
  }

  if (typeof window !== 'undefined') {
    return (
      <div className='flex flex-col h-screen overflow-auto pb-20 p-4 pt-14'>
        <ModalMyProfileSettings />
        <ModalViewPost />
        <ModalViewSubscribers />
        <AlertO />
        <ModalPhoto />
        <div className='flex justify-between w-full max-w-[800px] mx-auto'>
          <IconButton className={'bg-cover bg-center'} sx={{ width: '150px', color: 'white', backgroundImage: `url("${apiSoftInsta + '/images/' + person.image}")`, border: person.image ? 'none' : '1px solid #bbb', height: '150px' }} onClick={setOpenModalPhoto}>
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
              <Person className='text-gray-500 scale-150' />
            )}
          </IconButton>
          <div className='flex flex-col gap-6'>
            <div className='flex gap-2 h-fit'>
              <Typography variant='h6' sx={{ marginRight: '10px' }}>
                {person.userName}
              </Typography>
              <Link href='/setting'>
                <Button sx={buttonStyle}>Редактировать профиль</Button>
              </Link>
              <Button sx={buttonStyle}>Посмотреть архив</Button>
              <IconButton sx={{ color: 'black' }} onClick={() => {
                setOpenModalMyProfileSettings()
              }}>
                <p className='scale-[1.3]'>{setting}</p>
              </IconButton>
            </div>
            {!bp.w767 &&
              <div className={'flex h-fit gap-10'}>
                <p>
                  <span className='font-[600]'>{person.postCount}</span> публикаций
                </p>
                <Button onClick={setOpenModalViewSubscribers} color='primary' sx={{textTransform:'none', color:'black', padding:'0 10px'}}>
                  <span className='font-[600] mr-1'>{person.subscribersCount}</span>{' '}
                  подписчиков
                </Button>
                <Button color='primary' sx={{textTransform:'none', color:'black', padding:'0 10px'}}>
                  <span className='font-[600] mr-1'>{person.subscriptionsCount}</span>{' '}
                  подписок
                </Button>
              </div>
            }
            <div>
              <p className='font-[600] text-sm'>
                {person.lastName} {person.firstName}
              </p>
              <p className='font-[400] text-sm'>
                {person.about}
              </p>
            </div>
          </div>
        </div>
        <Box className='mt-20 mx-auto max-w-[952px]' sx={{ width: '100%' }}>
          {bp.w767 &&
            <div className={'grid border-t-[1px] border-gray-500/60 grid-cols-3 h-fit'}>
              <Button color='secondary' sx={{ padding: '10px 0', textTransform: 'none', cursor: 'default', display: 'block', borderRadius: '0' }}>
                <span className='font-[600]'>{person.postCount}</span> публикаций
              </Button>
              <Button color='secondary' sx={{ padding: '10px 0', textTransform: 'none', display: 'block', borderRadius: '0' }}>
                <span className='font-[600]'>{person.subscribersCount}</span>{' '}
                подписчиков
              </Button>
              <Button color='secondary' sx={{ padding: '10px 0', textTransform: 'none', display: 'block', borderRadius: '0' }}>
                <span className='font-[600]'>{person.subscriptionsCount}</span>{' '}
                подписок
              </Button>
            </div>}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              textColor='black'
              sx={{ width: 'fit-content', marginX: 'auto', color: '#000' }}
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'
            >
              <Tab label='▦ Публикации' {...a11yProps(0)} />
              <Tab
                label={
                  <div className='flex font-bold text-transparent bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text items-center'>
                    <h1 className='text-gray-500 scale-75'>{video}</h1>
                    Reels
                  </div>
                }
                {...a11yProps(1)}
              />
              <Tab
                label={
                  <p><BookmarkOutlined sx={{ color: 'gray' }} />
                    Сохраненное
                  </p>
                }
                {...a11yProps(2)}
              />
              <Tab
                label={
                  <p>
                    <AssignmentInd sx={{ color: 'gray' }} />
                    Отметки
                  </p>
                }
                {...a11yProps(3)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className='w-full mx-auto grid h-full gap-1 grid-cols-3'>
              {personPosts?.map((post, i) => (
                <div
                  onClick={() => {
                    setOpenModalViewPost();
                    setInitialSlide(i)

                  }}
                  className='relative w-full max-w-[300px] h-[28vw] max-h-[300px] overflow-hidden bg-cover bg-center'
                  style={{}}
                  key={i}
                >{isImage(post?.images[0]) &&
                  <Image
                    src={apiSoftInsta + '/images/' + post.images[0]}
                    alt=''
                    width={100}
                    height={100}
                    className='absolute w-full object-cover rounded h-full'
                    unoptimized
                  />
                  } {isVideo(post?.images[0]) &&
                    <video
                      className="absolute w-full rounded h-full object-cover"
                    >
                      <source
                        src={`${apiSoftInsta}/images/${post?.images[0]}`}
                        type={`video/${post?.images[0].split('.').pop() || ''}`}
                      />
                      Your browser does not support the video tag.
                    </video>
                  }
                  <Button
                    sx={{
                      width: '100%',
                      position: 'relative',
                      height: '100%',
                      gap: '10px',
                      color: 'transparent',
                      ':hover': {
                        bgcolor: '#0005',
                        color: '#fff'
                      }
                    }}
                  >
                    {post.images.length > 1 && (isImage(post?.images[0])?
                      <AutoAwesomeMotionRounded
                        sx={{
                          position: 'absolute',
                          right: '5px',
                          top: '5px'
                        }}
                      /> :
                      <VideoLibraryRounded
                        sx={{
                          position: 'absolute',
                          right: '5px',
                          top: '5px'
                        }}
                      />
                    )}
                    <div>
                      <ModeComment /> {post.commentCount}
                    </div>
                    {post.postLikeCount != 0 && (
                      <div className='flex gap-1'>
                        <Favorite />
                        <p>{post.postLikeCount}</p>
                      </div>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <div className='w-full mx-auto grid h-full gap-1 grid-cols-4'>
              {myReels?.map((post, i) => (isVideo(post?.images) &&
                <div
                  className='relative overflow-hidden w-full h-[33vw] max-h-[370px] bg-cover bg-center'
                  style={{}}
                  onPointerEnter={() => {
                    setMouse(true)
                    setMouseId(post.postId)
                  }
                  }
                  onPointerLeave={() => {
                    setMouse(false)
                  }
                  }
                  key={i}
                > {isVideo(post?.images) &&
                  <video
                    className="absolute w-full rounded h-full object-cover"
                  >
                    <source
                      src={`${apiSoftInsta}/images/${post?.images}`}
                      type={`video/${post?.images.split('.').pop() || ''}`}
                    />
                    Your browser does not support the video tag.
                  </video>
                  }
                  <Button
                    sx={{
                      width: '100%',
                      position: 'relative',
                      height: '100%',
                      gap: '10px',
                      color: 'transparent',
                      ':hover': {
                        bgcolor: '#0005',
                        color: '#fff'
                      }
                    }}
                  >

                    {(
                      <div style={{ opacity: MouseId == post.postId && Mouse ? '0' : '1', transition: 'all 0.2s' }} className='absolute left-2 flex gap-1 bottom-2'>
                        <RemoveRedEye sx={{ color: 'white' }} />
                        <p className='text-white'>{post.postView}</p>
                      </div>
                    )}
                    <div>
                      <ModeComment /> {post.commentCount}
                    </div>
                    {post.postLike && (
                      <div className='flex gap-1'>
                        <Favorite />
                        <p>{post.postLikeCount}</p>
                      </div>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Item Three
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            Item Three
          </CustomTabPanel>
        </Box>
      </div>
    )
  }
}

export default Profile
