import type { Comment } from "../../modelos/comment";
import type { Post, PostWithComments } from "../../modelos/post";
import { postHttp } from "../http/post-http";
import { authStore } from "../../state/auth-store";
import { CONSTANTS } from "../../shared/constants";

const userHeaders = (): Record<string, string> => {
  const userId = authStore.currentUserId || CONSTANTS.CURRENT_USER_ID;
  return { "X-User-Id": userId };
};

export const postService = {
  async list(): Promise<Post[]> {
    return postHttp.list(userHeaders());
  },

  async listByAuthor(authorId: string): Promise<Post[]> {
    return postHttp.listByAuthor(authorId, userHeaders());
  },

  async search(query: string): Promise<Post[]> {
    return postHttp.search(query, userHeaders());
  },

  async fetchPostWithComments(id: string): Promise<PostWithComments> {
    const post = await postHttp.getPost(id, userHeaders());
    const comments = await postHttp.getComments(id);
    return { ...post, banned: post.banned ?? false, commentsList: comments };
  },

  async fetchPostDetails(id: string): Promise<PostWithComments> {
    const post = await postHttp.getPostDetails(id, userHeaders());
    const imageUrls =
      post.imageUrls && post.imageUrls.length
        ? post.imageUrls
        : post.imageUrl
          ? [post.imageUrl]
          : [];
    return {
      ...post,
      banned: post.banned ?? false,
      commentsList: post.commentsList ?? [],
      imageUrls,
    };
  },

  async create(post: Post): Promise<PostWithComments> {
    const created = await postHttp.createPost(post);
    return { ...created, banned: created.banned ?? false, commentsList: [] };
  },

  async upload(formData: FormData): Promise<PostWithComments> {
    const created = await postHttp.uploadPost(formData, userHeaders());
    return {
      ...created,
      banned: created.banned ?? false,
      commentsList: [],
    };
  },

  async update(post: Post): Promise<PostWithComments> {
    const updated = await postHttp.updatePost(post);
    return {
      ...updated,
      banned: updated.banned ?? false,
      commentsList: updated.commentsList ?? [],
      imageUrls: updated.imageUrls ?? [],
    };
  },

  async updateWithImages(postId: string, formData: FormData): Promise<PostWithComments> {
    const updated = await postHttp.updatePostImages(postId, formData, userHeaders());
    return {
      ...updated,
      banned: updated.banned ?? false,
      commentsList: updated.commentsList ?? [],
      imageUrls: updated.imageUrls ?? [],
    };
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
    return postHttp.like(postId, like, userHeaders());
  },

  async save(postId: string, save = true): Promise<Post> {
    return postHttp.save(postId, save);
  },

  async ban(postId: string, banned = true): Promise<Post> {
    return postHttp.ban(postId, banned);
  },

  async random(limit = 5): Promise<Post[]> {
    return postHttp.random(limit, userHeaders());
  },
};
