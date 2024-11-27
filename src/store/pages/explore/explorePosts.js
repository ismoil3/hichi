import axiosRequest from '@/utils/axiosMy/axiosMy';
import { create } from 'zustand';

const useExplorePosts = create((set)=>({
    posts: [],

    postByIdModalOpened: false,
    changePostByIdModalOpened: (value) => set(() => ({postByIdModalOpened: value})),

    currentSlide: 0,
    changeCurrentSlide: (value) => set(() => ({currentSlide: value})),

    getPosts: async () => {
        try {
            const {data} = await axiosRequest.get("/Post/get-posts");
            set(()=>({posts: data.data}));
        } catch (error) {
            console.error(error);
            
        }
    }
}))

export default useExplorePosts;