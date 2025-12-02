import type { Comment } from "./comment";

export interface Post {
  id: string;
  caption: string;
  authorId: string;
  likes: number;
  comments: number;
  saves: number;
  banned?: boolean;
  liked?: boolean;
}

export interface PostWithComments extends Post {
  commentsList: Comment[];
}
