export interface Relationship {
    relationshipId: number;
    followerId: number;
    followingId: number;
    follower: {
        userId?: number;
        username?: string;
        profilePhoto?: string;
    };
    following: {
        userId?: number;
        username?: string;
        profilePhoto?: string;
    }
}