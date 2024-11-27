import useCreatePost from '@/store/pages/create/createPost'
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import React, { useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';

const Create = () => {
  const { createPostDialogOpened , changeCreatePostDialogOpened , addPost } = useCreatePost();
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [props, setProps] = useState({ title: "", desc: "" })
  const filesRef = useRef(null);

  async function AddPost() {
    const formData = new FormData;

    formData.append("title", props.title);
    formData.append("content", props.desc);
    for(let i = 0; i < files.length; i++){
      formData.append("images", files[i]);
    }

    await addPost(formData);
    changeCreatePostDialogOpened(false);
    setFiles([]);
    setProps({ title: "", desc: "" });
    setCurrentStep(1);
  }

  return (
    <Dialog open={createPostDialogOpened} onClose={() => {changeCreatePostDialogOpened(false); setCurrentStep(1); setFiles([]); setProps({ title: "", desc: "" });}}>
      <DialogTitle>Create new post</DialogTitle>
      <IconButton sx={{position:"absolute", top:"10px", right:"10px"}} onClick={() => {changeCreatePostDialogOpened(false); setCurrentStep(1); setFiles([]); setProps({ title: "", desc: "" });}}><CloseIcon/></IconButton>
      <DialogContent sx={{mx:{md:"100px",xs:"40px"}, mb:"30px", mt:"10px"}}>
        { currentStep == 1 && 
          <>
            <Button variant='contained' onClick={() => filesRef.current.click()}>
              Choose files { files.length > 0 && ` (${files.length} ${files.length > 0 ? `file` : `files`} selected)`}
              <input type="file" multiple hidden ref={filesRef} onChange={(e) => {setFiles(e.target.files); setCurrentStep(2);}} />
            </Button>
          </>
        }
        { currentStep == 2 && 
          <>
            <TextField value={props.title} onChange={(e) => {setProps({ title: e.target.value, desc: props.desc });}} sx={{width:"100%", mb:"15px"}} label="Title" placeholder="Title:" />
            <TextField value={props.desc} onChange={(e) => {setProps({ title: props.title, desc: e.target.value });}} multiline rows={3} sx={{width:"100%", mb:"15px"}} label="Description" placeholder="Description:" />
            <Button variant="contained" onClick={() => AddPost()}>Add post</Button>
          </>
        }
      </DialogContent>
    </Dialog>
  )
}

export default Create