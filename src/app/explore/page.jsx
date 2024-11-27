'use client'
import useExplorePosts from '@/store/pages/explore/explorePosts'
import { Grid2 } from '@mui/material';
import React, { useEffect } from 'react'
import { apiSoftInsta } from '../config/config';
import Image from 'next/image';
import { useHomeStore } from '../store/useHomeStore';
import ModalViewPost from './modal-view-post';

const Explore = () => {
  const { posts , getPosts , changePostByIdModalOpened , changeCurrentSlide } = useExplorePosts();

  useEffect(()=>{
	getPosts();
  }, [getPosts])


  return <>
	<Grid2 sx={{p:"30px"}} container spacing={2}>
	   {
		  posts.length>0 && posts.map((post, index)=>{
			return <Grid2 onClick={() => { changePostByIdModalOpened(true); changeCurrentSlide(index) }} size={4} key={index}>
				{ post.images[0].split('.')[1]=="mp4" && <video width={1000} className='w-[100%] h-[400px]' style={{objectFit:"cover"}} src={`${apiSoftInsta}/images/${post.images[0]}`}></video> }
				{ ( post.images[0].split('.')[1]=="png" || post.images[0].split('.')[1]=="jpg" || post.images[0].split('.')[1]=="webp" || post.images[0].split('.')[1]=="jpeg") && <Image width={1000} height={1000} alt='Post image' className='w-[100%] h-[400px]' src={`${apiSoftInsta}/images/${post.images[0]}`}/> }
			</Grid2>
		  })
	   }
	</Grid2>
	<ModalViewPost/>
  </>
}

export default Explore