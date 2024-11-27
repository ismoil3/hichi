'use client'
import {
	AssignmentInd,
	AutoAwesomeMotionRounded,
	BookmarkOutlined,
	ModeComment,
	Person
} from '@mui/icons-material'
import Image from 'next/image'
import { apiSoftInsta } from '../config/config'
import {
	Box,
	Button,
	IconButton,
	Modal,
	Tab,
	Tabs,
	Typography
} from '@mui/material'
import { useProfileStore } from '@/store/user-profile/user-profile'
import { useEffect, useRef } from 'react'
import { setting } from '@/assets/icon/layout/svg'
import PropTypes from 'prop-types'
import React from 'react'
import Link from 'next/link'
import ModalPhoto from '@/components/shared/modal-photo/modal-photo'
let buttonModal =
	'w-full py-3 border-t-[1px] border-gray-500/40 duration-200 active:bg-gray-400/30'
/*
about:""
dateUpdated:"2024-11-22T12:03:33.760877Z"
dob:"2024-11-22T12:03:33.760877Z"
firstName:"Nazarov"
gender:"Male"
image:"bef5f010-c2b1-49f2-b391-59103fa0cfc0.jpg"
lastName:"Muhammad"
locationId:1
occupation:""
postCount:0
subscribersCount:0
subscriptionsCount:0
userName:"nazarov_m"
*/

/*
commentCount:0
comments:[]
content:"very-good"
datePublished:"2024-11-22T10:02:52.290939Z"
images:['e797d6a5-b2f4-4981-a551-0f574e0221b0.jpg']
postFavorite:false
postId:46
postLike:false
postLikeCount:0
postView:0
title:"good"
userFavorite:[]
userId:"139f724a-b3da-4955-8eec-93be04675fdd"
userLikes:[]
userViews:[]
*/

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
			{value === index && <Box sx={{ p: 3, width: '100%' }}>{children}</Box>}
		</div>
	)
}

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
	const {
		getPerson,
		person,
		getPersonPosts,
		setCloseModalPhoto,
		setOpenModalPhoto,
		personPosts
	} = useProfileStore()
	console.log(person)
	const fileInputRef = useRef(null)
	const handleOpenFileExplorer = () => {
		fileInputRef.current.click()
	}

	const handleFileChange = event => {
		const photo = new FormData()
		photo.set('imageFile', event.target.files[0])
		editPhotoProfile(photo)
		setCloseModalPhoto(false)
	}

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const buttonStyle = {
		color: 'black',
		bgcolor: '#bbb5',
		fontSize: '14px',
		fontWeight: '600',
		padding: '5px 18px',
		textTransform: 'none',
		borderRadius: '10px'
	}

	useEffect(() => {
		getPerson()
		getPersonPosts()
	}, [])

	return (
		<div className='flex flex-col p-4 w-full max-w-[952px] mx-auto pt-14'>
			<ModalPhoto />
			<div className='flex gap-28 w-full max-w-[840px] mx-auto'>
				<IconButton className='bg-cover bg-center' sx={{ width: '150px', color: 'white', backgroundImage: `url("${apiSoftInsta + '/images/' + person.image}")`, border: person.image ? 'none' : '1px solid #bbb', height: '150px' }} onClick={setOpenModalPhoto}>
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
						<IconButton sx={{ color: 'black' }} variant='outline'>
							<p className='scale-[1.3]'>{setting}</p>
						</IconButton>
					</div>
					<div className='flex h-fit gap-10'>
						<p>
							<span className='font-[600]'>{person.postCount}</span> публикаций
						</p>
						<p>
							<span className='font-[600]'>{person.subscribersCount}</span>{' '}
							подписчиков
						</p>
						<p>
							<span className='font-[600]'>{person.subscriptionsCount}</span>{' '}
							подписок
						</p>
					</div>
					<div>
						<p className='font-[600]'>
							{person.lastName} {person.firstName}
						</p>
						<p className='font-[500]'>
							{person.about}
						</p>
					</div>
				</div>
			</div>
			<Box className='mt-20' sx={{ width: '100%' }}>
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
								<p>
									<BookmarkOutlined sx={{ color: 'gray' }} /> Сохраненное
								</p>
							}
							{...a11yProps(1)}
						/>
						<Tab
							label={
								<p>
									<AssignmentInd sx={{ color: 'gray' }} /> Отметки
								</p>
							}
							{...a11yProps(2)}
						/>
					</Tabs>
				</Box>
				<CustomTabPanel value={value} index={0}>
					<div className='w-full grid grid-cols-3'>
						{personPosts.map((post, i) => (
							<div
								className='w-screen max-w-[300px] relative h-screen max-h-[300px] bg-cover bg-center'
								style={{}}
								key={i}
							>
								<Image
									src={apiSoftInsta + '/images/' + post.images[0]}
									alt=''
									width={100}
									height={100}
									className='absolute w-full h-full'
									unoptimized
								/>
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
									{post.images.length > 1 && (
										<AutoAwesomeMotionRounded
											sx={{
												position: 'absolute',
												right: '5px',
												color: '#fff',
												top: '5px'
											}}
										/>
									)}
									<div>
										<ModeComment /> {post.commentCount}
									</div>
								</Button>
							</div>
						))}
					</div>
				</CustomTabPanel>
				<CustomTabPanel value={value} index={1}>
					Item Two
				</CustomTabPanel>
				<CustomTabPanel value={value} index={2}>
					Item Three
				</CustomTabPanel>
			</Box>
		</div>
	)
}

export default Profile