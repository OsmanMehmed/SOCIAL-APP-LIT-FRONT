import type { Comment } from "./comment";

export interface Post {
  id: string;
  title: string;
  description?: string;
  authorId: string;
  imageUrl?: string | null;
  likes: number;
  comments: number;
  saves: number;
  banned?: boolean;
  liked?: boolean;
  tags?: string[];
}

export interface PostWithComments extends Post {
  caption?: string;
  commentsList: Comment[];
  imageUrls?: string[];
}
