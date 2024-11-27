import { create } from "zustand";
import { apiSoftInsta } from "../config/config";
import axiosRequest from "@/utils/axiosMy/axiosMy";

export const useHomeStore = create((set, get) => ({
  story: [],

  getStory: async () => {
    try {
      const { data } = await axiosRequest.get(`/Story/get-stories`);
      set({ story: data });
    } catch (error) {
      console.error("Not Found !", error);
    }
  },

  deleteStory: async (id) => {
    try {
      const response = await axiosRequest.delete(`/Story/DeleteStory?id=${id}`)
      if (response.status === 200 || response.status === 204) {
         useHomeStore.setState((state) => ({
          stories: state.stories.filter((story) => story.id !== id),
        }));
      } else {
        console.error("Failed to delete story: Unexpected response status", response.status);
      }
    } catch (error) {
      console.error("Not Found !", error);
    }
  },

  posts: [],

  getPosts: async () => {
    try {
      const { data } = await axiosRequest.get(`/Post/get-posts`);
      set({ posts: data.data });
    } catch (error) {
      console.error("Not Found !", error);
    }
  },

  postStory: async (obj) => {
    try {
      const { data } = await axiosRequest.post(`/Story/AddStories`, obj);
      await get().getStory();
    } catch (error) {
      console.error("Not Found !", error);
    }
  },

  likePost: async (id) => {
    try {
      const { data } = await axiosRequest.post(`/Post/like-post?postId=${id}`);
    } catch (error) {
      console.error("Not Found !", error);
    }
  },

  userProfile: [],

  getUserProfile: async () => {
    try {
      const { data } = await axiosRequest.get(`/UserProfile/get-my-profile`);
      set({ userProfile: data.data });
    } catch (error) {
      console.error("Not Found !", error);
    }
  },

  users: [],

  getUsers: async () => {
    try {
      const { data } = await axiosRequest.get(`/User/get-users`);
      set({ users: data.data });
    } catch (error) {
      console.error("Not Found !", error);
    }
  },

  myStory: [],

  getMyStory: async () => {
    try {
      const { data } = await axiosRequest.get(`/Story/get-my-stories`);
      set({ myStory: data.data });
    } catch (error) {
      console.error("Not Found !", error);
    }
  },

  initialSlide: null,
  setInitialSlide: (index) =>
    set(() => ({
      initialSlide: index,
    })),

  isOpenModalViewPost: false,
  setOpenModalViewPost: () =>
    set(() => ({
      isOpenModalViewPost: true,
    })),
  setCloseModalViewPost: () =>
    set(() => ({
      isOpenModalViewPost: false,
    })),
}));
