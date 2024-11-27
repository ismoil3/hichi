'use client';
import { useEffect, useState, useRef } from "react";
import { useHomeStore } from "./store/useHomeStore";
import { Box, Typography, Avatar, IconButton, Button } from "@mui/material";
import "./globals.css";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';


// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

// Modal
import Modal from '@mui/material/Modal';

// Post icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { Favorite } from "@mui/icons-material";
import MoreHorizSharpIcon from '@mui/icons-material/MoreHorizSharp';

// Date
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

// Config
import { apiSoftInsta } from "./config/config";
import Link from "next/link";
import ModalViewPost from "@/app/components/modal-post-view/modal-post-view";
import { useProfileStore } from "@/store/user-profile/user-profile";



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "100%",
  height: '100vh',
  bgcolor: '#404040',
  boxShadow: 24,
  p: 4,
};


const formatInstagramDate = (dateString) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: ru });
};


export default function Main() {

  const { story, getStory, posts, getPosts, likePost, userProfile, setInitialSlide, getUserProfile, setOpenModalViewPost, postStory, users, getUsers, myStory, getMyStory, deleteStory  } = useHomeStore();


  useEffect(() => {
    getStory()
    getPosts()
    getUserProfile()
    getUsers()
    getMyStory()
  }, [getStory, getPosts, getUserProfile, getUsers, getMyStory]);

  const [open, setOpen] = useState(false);
  const [currentUserStory, setCurrentUserStory] = useState(null);
  const [StoryDeleteId, setStoryDeleteId] = useState(null);

  const handleOpen = (userStory) => {
    setCurrentUserStory(userStory);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUserStory(null);
  };


  // Modal Story
  const [openStory, setOpenStory] = useState(false);
  const handleOpenStory = () => setOpenStory(true);
  const handleCloseStory = () => setOpenStory(false);

  // Modal delete Story
  const [openDeleteStory, setOpenDeleteStory] = useState(false);
  const handleOpenDeleteStory = () => setOpenDeleteStory(true);
  const handleCloseDeleteStory = () => setOpenDeleteStory(false);



// Story
const isImage = (fileName) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg|ico|heic|heif|raw|cr2|nef|orf|sr2|dng|arw)$/i.test(fileName);
};

const isVideo = (fileName) => {
  return /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv|3gp|m4v|f4v|rmvb|mts|m2ts|asf|vob|divx)$/i.test(fileName);
};

// Post
const isImagePost = (images) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg|ico|heic|heif|raw|cr2|nef|orf|sr2|dng|arw)$/i.test(images);
};

const isVideoPost = (images) => {
  return /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv|3gp|m4v|f4v|rmvb|mts|m2ts|asf|vob|divx)$/i.test(images);
};


  // Post Form Story
  const handleSubmit = async (event) => {
    event.preventDefault()
    const obj = new FormData()
    for(let i=0; i<event.target["images"].files.length; i++){
    obj.append('Image', event.target["images"].files[i])
    }
    await postStory(obj)
    handleCloseStory()
  }


  // Style Story
  const styleStory = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  
  //-----------
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  //------------


  // button style
  const buttonS = 'w-full py-3 px-10 border-t-[1px] border-gray-500/40 duration-200 active:bg-gray-400/30'

  return (
    <Box className='h-screen overflow-auto'>
  <ModalViewPost />
  <Box className="flex gap-[20px] p-[50px_30px]">

    {/* myStory */}
    <Box className="cursor-pointer flex flex-col items-center w-[100px] h-[100px]" onClick={handleOpenStory}>
   <Avatar
      src={
        myStory?.userImage && myStory?.userImage.trim() !== ""
          ? `${apiSoftInsta}/images/${myStory?.userImage}`
          : `https://via.placeholder.com/150/000000/FFFFFF?text=${myStory?.userName?.[0]?.toUpperCase() || "U"}`
      }
      alt={`Photo of ${myStory?.userName || "User"}`}
      sx={{
        width: 65,
        height: 65,
        marginBottom: 1,
      }}
    />
    <Typography>Мои истории</Typography>
   </Box>

  <Box className="max-w-[750px] w-[100%]">

    {/* Map Stories */}
      <Box className="flex gap-[15px] max-w-[800px] w-[100%] justify-center items-center bg-white">
        <IconButton className="custom-prev cursor-pointer">
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Swiper
          slidesPerView={7}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          modules={[Navigation]}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 2,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 2,
            },
            1024: {
              slidesPerView: 8,
              spaceBetween: 2,
            },
          }}
          className="mySwiper"
        >
        {Array.isArray(story) && story?.length > 0 && story?.map((el, index) => {
          return (
            <SwiperSlide key={index}>
              <Box onClick={() => handleOpen(el)} className="cursor-pointer flex flex-col items-center">
                <Avatar
                  src={
                    el.userImage && el.userImage.trim() !== ""
                      ? `${apiSoftInsta}/images/${el.userImage}`
                      : `https://via.placeholder.com/150/000000/FFFFFF?text=${el?.userName?.[0]?.toUpperCase() || "U"}`
                  }
                  alt={`Photo of ${el?.userName || "User"}`}
                  sx={{
                    width: 65,
                    height: 65,
                    marginBottom: 1,
                  }}
                />
                <Typography>
                  {el?.userName?.length > 7 ? `${el?.userName.slice(0, 7)}...` : el?.userName || "user"}
                </Typography>
              </Box>
            </SwiperSlide>
          );
        })}
        </Swiper>
        <IconButton className="custom-next cursor-pointer">
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>

 
      {/* Map Posts */}
      <Box className="max-w-[580px] p-[50px_70px]">
        {posts.length > 0 &&
          posts.map((el, index)=>{
            const fileType = el?.images[0]?.split('.').pop() || '';
            return(
              <Box key={el?.postId || index} className="mb-[80px]">
                <Box className="flex justify-between mb-[10px] items-center">
                  <Box className="flex gap-[15px] items-center">
                <Avatar
                  src={
                    el.userImage && el.userImage.trim() !== ""
                      ? `${apiSoftInsta}/images/${el.userImage}`
                      : `https://via.placeholder.com/150/000000/FFFFFF?text=${el?.userName?.[0]?.toUpperCase() || "U"}`
                  }
                  alt={`Photo of ${el?.userName || "User"}`}
                  sx={{
                    width: 45,
                    height: 45,
                  }}
                />
                <Box>
                <Typography>{el?.userName || "user"}</Typography> 
                <Typography fontSize={"13px"}>{formatInstagramDate(el.datePublished)}</Typography> 
                </Box>
                </Box>
                <IconButton> <MoreHorizSharpIcon/> </IconButton>
                </Box>
              
                {isImagePost(el?.images[0]) ? (
                      <img
                        src={`${apiSoftInsta}/images/${el?.images[0]}`}
                        alt="User Story"
                        className="w-[100%] h-[80vh] object-cover rounded-[5px]"
                      />
                    ) : isVideoPost(el?.images[0]) ? (
                      <video
                        controls
                        // autoPlay
                        loop
                        className="rounded-[5px]"
                        style={{
                          width: "100%",
                          height: "80vh",
                          objectFit: "cover",
                        }}
                      >
                        <source
                          src={`${apiSoftInsta}/images/${el?.images[0]}`}
                          type={`video/${fileType}`}
                        />
                        Your browser does not support the video tag.
                      </video>
                      ) : (
                      <Typography sx={{ textAlign: "center" }}>
                        Unsupported media type.
                      </Typography>
                    )}

                    <Box className="flex items-center justify-between mt-[10px]">
                      <Box className="flex items-center text-black">
                      <IconButton onClick={() => likePost(el.postId)}> { el.postLike ? <Favorite className="text-red-500" /> : <FavoriteBorderIcon/> } </IconButton>
                      <IconButton onClick={() => {setOpenModalViewPost(); setInitialSlide(index)}}> <ChatBubbleOutlineIcon/> </IconButton>
                      <IconButton> <SendOutlinedIcon/> </IconButton>
                      </Box>
                      <IconButton> <BookmarkBorderOutlinedIcon/> </IconButton>
                    </Box>

                   <Box className="flex gap-[10px] mt-[10px]">
                    <Typography fontSize={"17px"} fontWeight={"600"}>{el?.userName}</Typography>
                    <Typography>{el?.title}</Typography>
                    </Box>

              </Box>
            )
          })
        }
      </Box>
        </Box>

   
   {/* userProfile & Recomendation users*/}
     <Box className="w-[300px]">
      <Box className="items-center flex gap-[10px]">
       {
       <Avatar
        src={
          userProfile?.image && userProfile?.image.trim() !== ""
            ? `${apiSoftInsta}/images/${userProfile?.image}`
            : `https://via.placeholder.com/150/000000/FFFFFF?text=${userProfile?.userName?.[0]?.toUpperCase() || "U"}`
        }
        alt={`Photo of ${userProfile?.userName || "User"}`}
        sx={{
          width: 65,
          height: 65,
          cursor: "pointer"
        }}
      />
       }
       <Box>
        <Typography fontWeight={"700"} fontSize={"20px"}>{userProfile?.userName}</Typography>
        <Box className="flex items-center gap-[7px]">
          <Typography fontSize={"15px"}>{userProfile?.firstName}</Typography>
          <Typography fontSize={"15px"}>{userProfile?.lastName}</Typography>
        </Box>
       <Link className="text-[12px] text-blue-600 font-medium" href="/login">Переключиться</Link>
       </Box>
       </Box>

       <Box className="mt-[30px]">
        <Typography fontWeight={"600"} color="gray">Рекомендации для вас</Typography>
        <Box>
        {users.length > 0 &&
         users.slice(0,6).map((person, i) => (
            <Box
                key={i}
                className='flex items-center gap-3 mt-[10px] text-start cursor-pointer'
                   >
                  <Avatar
                  src={
                    person?.avatar && person?.avatar.trim() !== ""
                      ? `${apiSoftInsta}/images/${person?.avatar}`
                      : `https://via.placeholder.com/150/000000/FFFFFF?text=${person?.userName?.[0]?.toUpperCase() || "U"}`
                  }
                  alt={`Photo of ${person?.userName || "User"}`}
                  sx={{
                    width: 50,
                    height: 50,
                    cursor: "pointer"
                  }}
                />
                  <div>
                    <p className='text-sm font-[600]'>{person?.userName?.length > 7 ? `${person?.userName.slice(0, 10)}...` : person?.userName || "user"}</p>
                    <p className='text-sm text-gray-500/90'> • Подписчики: {person.subscribersCount}</p>
                </div>
                <button className="text-[12px] text-blue-600 font-medium ml-[15px]">Подписаться</button>
                </Box>
            ))}
        </Box>
       </Box>
        </Box>

      </Box>


      {/* Modal Story */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* User Image & Name */}
          <Box className="flex items-center justify-between">
            <Box className="flex gap-[10px] items-center">
            <Avatar
              src={
                currentUserStory?.userImage && currentUserStory.userImage.trim() !== ""
                  ? `${apiSoftInsta}/images/${currentUserStory.userImage}`
                  : `https://via.placeholder.com/150/000000/FFFFFF?text=${currentUserStory?.userName?.[0]?.toUpperCase() || "U"}`
              }
              alt={`Photo of ${currentUserStory?.userName}`}
              sx={{
                width: 55,
                height: 55,
              }}
            />
            <Typography sx={{ color: "white", fontWeight: "700", fontSize: "28px" }}>
              {currentUserStory?.userName || "user"}
            </Typography>
            </Box>
            <IconButton onClick={handleClose}>
              <CloseIcon className="text-white" />
            </IconButton>
          </Box>

          <Box className="mt-[20px] flex items-center max-w-[500px] h-[600px] m-auto w-full">
           <IconButton className="custom-prev cursor-pointer">
          <KeyboardArrowLeftIcon className="text-white" />
        </IconButton>
            <Swiper
             pagination={{
               type: 'fraction',
               color: "white"
             }}
             modules={[Pagination, Navigation]}
             className="mySwiper rounded-[10px]"
             slidesPerView={1}
             navigation={{
               nextEl: ".custom-next",
               prevEl: ".custom-prev",
          }}
           >
            <Box>
              {currentUserStory?.stories?.length > 0 &&
              currentUserStory?.stories?.filter((el) => el?.fileName).map((el, index) => {
                const fileType = el?.fileName?.split('.').pop() || '';
                return (
                  <>
                  <SwiperSlide key={index}>
                  <div className="w-full relative rounded-lg h-full">
                    {isImage(el?.fileName) ? (
                      <img
                        src={`${apiSoftInsta}/images/${el?.fileName}`}
                        alt="User Story"
                        className="translate-y-[-50%] relative top-[50%]"
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    ) : isVideo(el?.fileName) ? (
                      <video
                        controls
                        autoPlay
                        loop
                        className="translate-y-[-50%] relative top-[50%]"
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      >
                        <source
                          src={`${apiSoftInsta}/images/${el?.fileName}`}
                          type={`video/${fileType}`}
                        />
                        Your browser does not support the video tag.
                      </video>
                      ) : (
                      <Typography sx={{ color: "white", textAlign: "center" }}>
                        Unsupported media type.
                      </Typography>
                    )}
                    <div className="text-black flex items-center absolute top-3 left-5 z-50 ">
                    <Typography fontSize={"13px"}>{formatInstagramDate(el?.createAt)}</Typography>
                  <IconButton onClick={() => {
                    handleOpenDeleteStory()
                    setStoryDeleteId(el.id)
                    }} className="left-[235px]"> <MoreHorizSharpIcon/> </IconButton>
                  </div>
                  </div>
                  </SwiperSlide>
                  </>
                );
              })}
            </Box>
            </Swiper>
            <IconButton className="custom-next cursor-pointer">
            <KeyboardArrowRightIcon className="text-white" />
           </IconButton>
          </Box>

        </Box>
      </Modal>



      {/* Post Modal Story */}
     <Modal
      open={openStory}
      onClose={handleCloseStory}
      aria-labelledby='modal-modal-delete-comment'
    >
      <Box className='outline-none'
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 400,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
          boxShadow: 24
        }}
      >
        <div className='w-full text-sm font-[600]'>
        <form onSubmit={handleSubmit}>
         <input
           ref={fileInputRef}
           className="hidden"
           name="images"
           type="file"
         />
         <button
           type="button"                 
           onClick={handleButtonClick}
           className={buttonS}
         >
           Добавить историю
         </button>
         <button className={buttonS} type='submit'>Сохранить</button>
          </form>
          <button
            onClick={handleCloseStory}
            className={buttonS}
          >
            Отмена
          </button>
        </div>
      </Box>
    </Modal>


    {/* Modal delete Story */}
    <Modal
      open={openDeleteStory}
      onClose={handleCloseDeleteStory}
      aria-labelledby='modal-modal-delete-comment'
    >
      <Box className='outline-none'
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 400,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
          boxShadow: 24
        }}
      >
        <div className='w-full text-sm font-[600]'>
         <button onClick={()=> {deleteStory(StoryDeleteId); handleCloseDeleteStory()}} style={{color: "red"}} className={buttonS}>Удалить историю</button>
          <button onClick={handleCloseDeleteStory} className={buttonS}>Отмена</button>
        </div>
      </Box>
    </Modal>


    </Box>
  );
}
