import type { Post } from "../../modelos/post";
import type { Comment } from "../../modelos/comment";
import { request } from "./http-client";

export const postHttp = {
  getPost: (id: string) => request<Post>(`/posts/${id}`),
  getComments: (id: string) => request<Comment[]>(`/posts/${id}/comments`),
  createPost: (post: Post) =>
    request<Post>(`/posts`, { method: "POST", body: post }),
  updatePost: (post: Post) =>
    request<Post>(`/posts/${post.id}`, { method: "PUT", body: post }),
  deletePost: (id: string) =>
    request<void>(`/posts/${id}`, { method: "DELETE" }),
  addComment: (postId: string, comment: Comment) =>
    request<Comment>(`/posts/${postId}/comments`, {
      method: "POST",
      body: comment,
    }),
  deleteComment: (commentId: string) =>
    request<void>(`/posts/comments/${commentId}`, { method: "DELETE" }),
  like: (postId: string, like = true) =>
    request<Post>(`/posts/${postId}/like?like=${like}`, { method: "POST" }),
  save: (postId: string, save = true) =>
    request<Post>(`/posts/${postId}/save?save=${save}`, { method: "POST" }),
  ban: (postId: string, banned = true) =>
    request<Post>(`/posts/${postId}/ban?banned=${banned}`, { method: "POST" }),
};
