export interface CommentType {
    commentId?: number;
    content?: string;
    createdAt?: Date;
    user?: {
        userId?: number;
        username?: string;
        profilePhoto?: string;
    };
    postId?: number;

}