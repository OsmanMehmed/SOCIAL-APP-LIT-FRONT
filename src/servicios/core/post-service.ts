import type { Comment } from "../../modelos/comment";
import type { Post, PostWithComments } from "../../modelos/post";
import { postHttp } from "../http/post-http";
import { CONSTANTS } from "../../shared/constants";

const fallbackPost = (id: string): Post => {
  if (id === "1") {
    return {
      id,
      caption: `${CONSTANTS.FEED_POST1_CAPTION} (dato-mockeado)`,
      authorId: `${CONSTANTS.FEED_POST1_USERNAME}-dato-mockeado`,
      likes: Number(CONSTANTS.POST_CARD_LIKES_TEXT),
      comments: Number(CONSTANTS.POST_CARD_COMMENTS_TEXT),
      saves: Number(CONSTANTS.POST_CARD_SAVE_TEXT),
      banned: false,
    };
  }
  return {
    id,
    caption: `${CONSTANTS.FEED_POST2_CAPTION} (dato-mockeado)`,
    authorId: `${CONSTANTS.FEED_POST2_USERNAME}-dato-mockeado`,
    likes: Number(CONSTANTS.POST_CARD_LIKES_TEXT),
    comments: Number(CONSTANTS.POST_CARD_COMMENTS_TEXT),
    saves: Number(CONSTANTS.POST_CARD_SAVE_TEXT),
    banned: false,
  };
};

const fallbackComments = (postId: string): Comment[] => [
  {
    id: "c1",
    postId,
    authorId: "osman.chef-dato-mockeado",
    text: "dato-mockeado: Tip anterior sobre la receta.",
    createdAt: new Date().toISOString(),
  },
];

const normalizePostId = (id: string): string => {
  if (!id) return id;
  return id.startsWith("post-") ? id : `post-${id}`;
};

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

    return { ...post, banned: post.banned ?? false, commentsList: comments };
  },

  async create(post: Post): Promise<PostWithComments> {
    try {
      const created = await postHttp.createPost({
        ...post,
        id: normalizePostId(post.id || ""),
      });
      return { ...created, banned: created.banned ?? false, commentsList: [] };
    } catch (err) {
      console.warn("Create post fallback", err);
      return {
        ...post,
        id: `local-${Date.now()}`,
        banned: post.banned ?? false,
        commentsList: [],
      };
    }
  },

  async update(post: Post): Promise<PostWithComments> {
    try {
      const updated = await postHttp.updatePost(post);
      return { ...updated, banned: updated.banned ?? false, commentsList: [] };
    } catch (err) {
      console.warn("Update post fallback", err);
      return { ...post, banned: post.banned ?? false, commentsList: [] };
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
      const backendPostId = normalizePostId(comment.postId);
      return await postHttp.addComment(backendPostId, {
        ...comment,
        postId: backendPostId,
      });
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

  async ban(postId: string, banned = true): Promise<Post> {
    try {
      return await postHttp.ban(postId, banned);
    } catch (err) {
      console.warn("Ban post fallback", err);
      const base = fallbackPost(postId);
      return { ...base, banned };
    }
  },
};
