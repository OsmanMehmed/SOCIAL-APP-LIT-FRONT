import type { Comment } from "./comment";

export interface Post {
  id: string;
  caption: string;
  authorId: string;
  likes: number;
  comments: number;
  saves: number;
}

export interface PostWithComments extends Post {
  commentsList: Comment[];
}
