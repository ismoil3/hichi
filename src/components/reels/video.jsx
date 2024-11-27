'use client';
import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { IconButton, Tooltip, CircularProgress, Avatar, Typography, Box, Menu, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ShareIcon from '@mui/icons-material/Share';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { apiSoftInsta } from '@/app/config/config';
import { useReelsStore } from '@/store/pages/reels/useReelsStore';
import Popover from '@mui/material/Popover';
import ClearIcon from '@mui/icons-material/Clear';
import { ru } from 'date-fns/locale';
import { formatDistanceToNowStrict } from 'date-fns';
import { AddReactionOutlined, SendRounded } from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { jwtDecode } from 'jwt-decode';
import Modal from '@mui/material/Modal';
const ReelsVideo = ({ post, onVideoPlay, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [manualPause, setManualPause] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [hasViewed, setHasViewed] = useState(false);
  const [postState, setPostState] = useState(post);
  const [textComment,setTextComment] = useState('')
  const [idComment,setIdComment] = useState(null)

  const { viewPost, likePost ,postComment,deleteCommentPost} = useReelsStore();
  const playerRef = useRef(null);
  const containerRef = useRef(null); 
  const [anchorEl, setAnchorEl] = useState(null);

  const openPopoverComment = Boolean(anchorEl);
  const id = openPopoverComment ? 'simple-popover' : undefined;

  const handleClickPopoverComment = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopoverComment = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!manualPause) {
      setIsPlaying(isActive);
    }
  }, [isActive, manualPause]);

  const togglePlayPause = () => {
    setManualPause((prev) => {
      const newManualPause = !prev;
      setIsPlaying(!newManualPause); 
      return newManualPause;
    });
    if (onVideoPlay) onVideoPlay();
  };

  const handleProgress = ({ played }) => {
    if (!hasViewed && played >= 0.7) {
      viewPost(postState.postId);
      setHasViewed(true);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    likePost(postState.postId);

    setPostState((prevState) => ({
      ...prevState,
      postLike: !prevState.postLike,
      postLikeCount: prevState.postLike
        ? prevState.postLikeCount - 1
        : prevState.postLikeCount + 1,
    }));
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const styles = {
    playerContainer: {
      position: 'relative',
      width: '100%',
      maxWidth: '370px',
      height: '90vh',
      backgroundColor: '#000',
      overflow: 'hidden',
      cursor: 'pointer',
      margin: 'auto',
    },
    postDetails: {
      position: 'absolute',
      bottom: '10px',
      left: '20px',
      zIndex: 10,
      color: 'white',
    },
    playButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '50%',
      padding: '15px',
    },
    actionButtons: {
      position: 'absolute',
      right: '20px',
      bottom: '100px',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    },
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!manualPause) {
          setIsPlaying(entry.isIntersecting);
        }
      },
      { threshold: 0.7 } 
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [manualPause]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  
  return (
    <div ref={containerRef} style={styles.playerContainer} onClick={togglePlayPause}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress style={{ color: 'white' }} />
        </div>
      )}

      <ReactPlayer
        onDoubleClick={handleLike}
        ref={playerRef}
        url={`${apiSoftInsta}/images/${postState.images}`}
        playing={isPlaying}
        loop
        width="100%"
        height="100%"
        onReady={() => setLoading(false)}
        onProgress={handleProgress}
        id={postState.postId}
      />

      {!isPlaying && !loading && (
        <div style={styles.playButton}>
          <PlayArrowIcon style={{ color: 'white', fontSize: '40px' }} />
        </div>
      )}

      <div style={styles.postDetails}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar
            src={`${apiSoftInsta}/images/${post.userImage}` || 'defaultAvatar.jpg'}
            alt="User Avatar"
          />
          <span style={{ fontWeight: 'bold' }}>{post.userName || 'Anonymous'}</span>
        </div>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          {post?.title}
        </Typography>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          {post?.Desc}
        </Typography>
      </div>

      <div style={styles.actionButtons}>
        <Tooltip title="Like">
          <IconButton
            onClick={handleLike}
            style={{ color: postState.postLike ? 'red' : 'white' }}
          >
            <FavoriteIcon />
          </IconButton>
          <h1 className="text-center text-[white]">{postState.postLikeCount}</h1>
        </Tooltip>
        <Tooltip title="Comment">
          <IconButton style={{ color: 'white' }} onClick={handleClickPopoverComment}>
            <ChatBubbleIcon />
          </IconButton>
          <h1 className="text-center text-[white]">{postState.commentCount}</h1>
        </Tooltip>
        <Tooltip title="Share">
          <IconButton style={{ color: 'white' }}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </div>

      <Popover
        id={id}
        open={openPopoverComment}
        anchorEl={anchorEl}
        onClose={handleClosePopoverComment}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ maxWidth: '400px', height: '400px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={{ width: "300px", overflow:"auto", height: "340px", padding: "0px 20px" }} >
          <div className='flex sticky top-0 h-[50px] bg-[white] z-10 items-center justify-between '>
            <p className='text-center font-bold'>Комментарии</p>
            <ClearIcon onClick={(e) => { handleClosePopoverComment(), e.stopPropagation() }} />
          </div>
          <div className='mt-[20px]'>
            {post.comments.length > 0 && post.comments.map((el) => {
              return <div
                className="flex commentsDotsMain items-start gap-4 mb-4"
                key={el.postCommentId}
              >
                <Avatar
                  src={el?.userPhoto?.trim() ? el?.userPhoto : ""}
                  sx={{ width: 40, height: 40 }}
                />

                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {el?.userName?.trim() ? el?.userName : "not found"}
                  </p>
                  <p style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }} className="text-sm text-gray-700">{el.comment}</p>
                  <p className="text-xs text-gray-500 mt-1 flex gap-3">
                    {formatDistanceToNowStrict(new Date(el.dateCommented), {
                      addSuffix: true,
                      locale: ru,
                    })} {el.userId == jwtDecode(localStorage.getItem('access_token')).sid && <span className='commentsDots' ><MoreHorizIcon onClick={()=>{handleOpen(),setIdComment(el.postCommentId),console.log(el.comment);
                    }} /></span>}
                  </p>
                </div>
              </div>
            })}
          </div>
          <div className='sticky bottom-0 bg-white'>
            <div className='px-2 gap-2 border-t-[1px] border-gray-500 w-full items-center justify-between flex'>
              <input
                value={textComment}
                onChange={(e)=>{setTextComment(e.target.value)}}
                type='text'
                className='w-full outline-none p-4 text-sm placeholder:text-sm'
                placeholder='Добавьте комментарий...'
                onKeyPress={e => {
                  if (e.key == 'Enter' && textComment.trim()) {
                    postComment({comment: textComment,postId: post.postId})
                    setTextComment('')
                  }
                }}
              />
              <IconButton
                color='primary'
                onClick={()=>postComment({comment: textComment,postId: post.postId})}
                disabled={!textComment.trim()}
              >
                <SendRounded />
              </IconButton>
            </div>
          </div>
        </Box>
      </Popover>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-comment-title"
        aria-describedby="delete-comment-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#1c1c1e', 
            width: 280,
            borderRadius: '12px',
            boxShadow: 24,
            p: 0,
          }}
        >
          <button
            className="w-full text-red-500 text-center py-4 border-b border-gray-700 text-[16px] font-bold hover:bg-[rgba(255,255,255,0.1)] transition"
            onClick={() => {
              deleteCommentPost(idComment);
              handleClose();
            }}
          >
            Удалить
          </button>
          <button
            className="w-full text-center py-4 text-[16px] text-white hover:bg-[rgba(255,255,255,0.1)] transition"
            onClick={handleClose}
          >
            Отмена
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default ReelsVideo;
