export interface PostType {
    postId?: number;
    content?: string | undefined;
    photo?: string;
    createdAt?: Date;
    userId?: number;
    likes?: number;
}