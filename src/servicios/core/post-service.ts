import type { Comment } from "../../modelos/comment";
import type { Post, PostWithComments } from "../../modelos/post";
import { postHttp } from "../http/post-http";

export const postService = {
  async list(): Promise<Post[]> {
    return postHttp.list();
  },

  async fetchPostWithComments(id: string): Promise<PostWithComments> {
    const post = await postHttp.getPost(id);
    const comments = await postHttp.getComments(id);
    return { ...post, banned: post.banned ?? false, commentsList: comments };
  },

  async create(post: Post): Promise<PostWithComments> {
    const created = await postHttp.createPost(post);
    return { ...created, banned: created.banned ?? false, commentsList: [] };
  },

  async update(post: Post): Promise<PostWithComments> {
    const updated = await postHttp.updatePost(post);
    return { ...updated, banned: updated.banned ?? false, commentsList: [] };
  },

  async delete(id: string): Promise<void> {
    return postHttp.deletePost(id);
  },

  async addComment(comment: Comment): Promise<Comment> {
    return postHttp.addComment(comment.postId, comment);
  },

  async deleteComment(commentId: string): Promise<void> {
    return postHttp.deleteComment(commentId);
  },

  async like(postId: string, like = true): Promise<Post> {
    return postHttp.like(postId, like);
  },

  async save(postId: string, save = true): Promise<Post> {
    return postHttp.save(postId, save);
  },

  async ban(postId: string, banned = true): Promise<Post> {
    return postHttp.ban(postId, banned);
  },
};
