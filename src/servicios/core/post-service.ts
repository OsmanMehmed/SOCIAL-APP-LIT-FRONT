import type { Comment } from "../../modelos/comment";
import type { Post, PostWithComments } from "../../modelos/post";
import { postHttp } from "../http/post-http";
import { CONSTANTS } from "../../shared/constants";

const fallbackPost = (id: string): Post => {
  if (id === "1") {
    return {
      id,
      caption: CONSTANTS.FEED_POST1_CAPTION,
      authorId: CONSTANTS.FEED_POST1_USERNAME,
      likes: Number(CONSTANTS.POST_CARD_LIKES_TEXT),
      comments: Number(CONSTANTS.POST_CARD_COMMENTS_TEXT),
      saves: Number(CONSTANTS.POST_CARD_SAVE_TEXT),
    };
  }
  return {
    id,
    caption: CONSTANTS.FEED_POST2_CAPTION,
    authorId: CONSTANTS.FEED_POST2_USERNAME,
    likes: Number(CONSTANTS.POST_CARD_LIKES_TEXT),
    comments: Number(CONSTANTS.POST_CARD_COMMENTS_TEXT),
    saves: Number(CONSTANTS.POST_CARD_SAVE_TEXT),
  };
};

const fallbackComments = (postId: string): Comment[] => [
  {
    id: "c1",
    postId,
    authorId: "osman.chef",
    text: "Tip anterior sobre la receta.",
    createdAt: new Date().toISOString(),
  },
];

export const postService = {
  async fetchPostWithComments(id: string): Promise<PostWithComments> {
    let post: Post;
    let comments: Comment[];
    try {
      post = await postHttp.getPost(id);
    } catch (err) {
      console.warn("Post fetch fallback", err);
      post = fallbackPost(id);
    }

    try {
      comments = await postHttp.getComments(id);
    } catch (err) {
      console.warn("Comments fetch fallback", err);
      comments = fallbackComments(id);
    }

    return { ...post, commentsList: comments };
  },

  async create(post: Post): Promise<PostWithComments> {
    try {
      const created = await postHttp.createPost(post);
      return { ...created, commentsList: [] };
    } catch (err) {
      console.warn("Create post fallback", err);
      return { ...post, id: `local-${Date.now()}`, commentsList: [] };
    }
  },

  async update(post: Post): Promise<PostWithComments> {
    try {
      const updated = await postHttp.updatePost(post);
      return { ...updated, commentsList: [] };
    } catch (err) {
      console.warn("Update post fallback", err);
      return { ...post, commentsList: [] };
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await postHttp.deletePost(id);
    } catch (err) {
      console.warn("Delete post fallback", err);
    }
  },

  async addComment(comment: Comment): Promise<Comment> {
    try {
      return await postHttp.addComment(comment.postId, comment);
    } catch (err) {
      console.warn("Add comment fallback", err);
      return { ...comment, id: `local-${Date.now()}` };
    }
  },

  async deleteComment(commentId: string): Promise<void> {
    try {
      await postHttp.deleteComment(commentId);
    } catch (err) {
      console.warn("Delete comment fallback", err);
    }
  },

  async like(postId: string, like = true): Promise<Post> {
    try {
      return await postHttp.like(postId, like);
    } catch (err) {
      console.warn("Like fallback", err);
      const base = fallbackPost(postId);
      return { ...base, likes: like ? base.likes + 1 : base.likes - 1 };
    }
  },

  async save(postId: string, save = true): Promise<Post> {
    try {
      return await postHttp.save(postId, save);
    } catch (err) {
      console.warn("Save fallback", err);
      const base = fallbackPost(postId);
      return { ...base, saves: save ? base.saves + 1 : base.saves - 1 };
    }
  },
};
