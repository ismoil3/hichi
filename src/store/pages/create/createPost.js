import axiosFormdata from "@/utils/axiosFormdata/axiosFormdata";
import { create } from "zustand";

const useCreatePost = create((set)=>({
    createPostDialogOpened: false, 
    changeCreatePostDialogOpened: (value) => set(()=>({createPostDialogOpened: value})),

    addPost : async (formData) => {
        try {
            const {data} = await axiosFormdata.post("/Post/add-post", formData);
            console.log(data.data);
        } catch (error) {
            console.error(error);
            
        }
    }
}))

export default useCreatePost;