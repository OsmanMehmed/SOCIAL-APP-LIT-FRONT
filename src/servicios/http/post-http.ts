import type { Post } from "../../modelos/post";
import type { Comment } from "../../modelos/comment";
import { request } from "./http-client";

export const postHttp = {
  list: (headers?: Record<string, string>) =>
    request<Post[]>(`/posts`, { headers }),
  getPost: (id: string, headers?: Record<string, string>) =>
    request<Post>(`/posts/${id}`, { headers }),
  getComments: (id: string) => request<Comment[]>(`/posts/${id}/comments`),
  createPost: (post: Post) =>
    request<Post>(`/posts`, { method: "POST", body: post }),
  uploadPost: (formData: FormData, headers?: Record<string, string>) =>
    request<Post>(`/posts/upload`, { method: "POST", body: formData, headers }),
  updatePost: (post: Post) =>
    request<Post>(`/posts/${post.id}`, { method: "PUT", body: post }),
  deletePost: (id: string) =>
    request<void>(`/posts/${id}`, { method: "DELETE" }),
  listByAuthor: (authorId: string, headers?: Record<string, string>) =>
    request<Post[]>(`/posts/author/${authorId}`, { headers }),
  addComment: (postId: string, comment: Comment) =>
    request<Comment>(`/posts/${postId}/comments`, {
      method: "POST",
      body: comment,
    }),
  deleteComment: (commentId: string) =>
    request<void>(`/posts/comments/${commentId}`, { method: "DELETE" }),
  like: (postId: string, like = true, headers?: Record<string, string>) =>
    request<Post>(`/posts/${postId}/like?like=${like}`, {
      method: "POST",
      headers,
    }),
  search: (query: string, headers?: Record<string, string>) =>
    request<Post[]>(`/posts/search?q=${encodeURIComponent(query)}`, {
      headers,
    }),
  random: (limit = 3, headers?: Record<string, string>) =>
    request<Post[]>(`/posts/random?limit=${limit}`, { headers }),
  save: (postId: string, save = true) =>
    request<Post>(`/posts/${postId}/save?save=${save}`, { method: "POST" }),
  ban: (postId: string, banned = true) =>
    request<Post>(`/posts/${postId}/ban?banned=${banned}`, { method: "POST" }),
};
