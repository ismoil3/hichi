import { apiSoftInsta } from "@/app/config/config";
import axiosRequest from "@/utils/axiosMy/axiosMy";
import { create } from "zustand";

export const useReelsStore = create((set,get) => ({
    reels: [],
    GetReels: async () => {
        try {
            const { data } = await axiosRequest.get('/Post/get-reels')
           set({reels: data.data})
        } catch (error) {
           console.error(error);
           
        }
    },
    viewPost: async (id) => {
      try {
        const {data} = await axiosRequest.post(`${apiSoftInsta}/Post/view-post?postId=${id}`)
      } catch (error) {
        console.error(error);
      }
    },
    likePost : async (id) => {
        try {
          const {data} = await axiosRequest.post(`${apiSoftInsta}/Post/like-post?postId=${id}`)
        } catch (error) {
          console.error(error);
        }
      },
      postComment: async (obj) => {
        try {
          const {data} = await axiosRequest.post(`Post/add-comment`,obj)
          get().GetReels()
        } catch (error) {
          console.error(error);
        }
      },
      deleteCommentPost: async (id) =>{
        console.log(id);
        
        try {
          const {data} = await axiosRequest.delete(`https://instagram-api.softclub.tj/Post/delete-comment?commentId=${id}`)
          get().GetReels()
        } catch (error) {
          console.error(error);
        }
      } 
}))