import { useState } from 'react'
import apiService, { ApiResponse } from '../api/api.service';

const useLikesHooks = () => {
    const [like, setLike] = useState<number>(0);
    const [likeStatus, setLikeStatus] = useState<'like' | null>(null);
    const [countLikes, setCountLikes] = useState<number>(0);
    const [likeComment, setLikeComment] = useState<number>(0);
    const [likeStatusComment, setLikeStatusComment] = useState<{ [key: number]: 'likeComment' | null }>({});
    const [countLikesComment, setCountLikesComment] = useState<{ [key: number]: number }>({});

    const addLikePost = async (postId: number) => {
        apiService(`api/post/like/${postId}`, 'post', {})
            .then((res: ApiResponse) => {
                if (res.status === 'ok') {
                    setLike(prevLikes => prevLikes + 1)
                    setLikeStatus('like');
                    setCountLikes(prevCountLikes => prevCountLikes + 1);
                }
            })
            .catch(error => {
                error;
            });
    }

    const dislikePost = async (postId: number) => {
        apiService(`api/post/dislike/${postId}`, 'delete', {})
            .then((res: ApiResponse) => {
                if (res.status === 'ok') {
                    setLike(prevLikes => prevLikes - 1)
                    setLikeStatus(null);
                    setCountLikes(prevCountLikes => prevCountLikes - 1);
                }
            })
            .catch(error => {
                error;
            });
    }

    const addLikeComment = async (commentId: number) => {
        apiService(`api/comment/like/${commentId}`, 'post', {})
            .then((res: ApiResponse) => {
                if (res.status === 'ok') {
                    setLikeComment(prevLikes => prevLikes + 1)
                    setLikeStatusComment(prevStatus => ({
                        ...prevStatus,
                        [commentId]: 'likeComment'
                    }));
                    setCountLikesComment(prevCount => ({
                        ...prevCount,
                        [commentId]: (prevCount[commentId] || 0) + 1
                    }));
                }
            })
            .catch(error => {
                error;
            });
    }

    const dislikeComment = async (commentId: number) => {
        apiService(`api/comment/dislike/${commentId}`, 'delete', {})
            .then((res: ApiResponse) => {
                if (res.status === 'ok') {
                    setLikeComment(prevLikes => prevLikes - 1)
                    setLikeStatusComment(prevStatus => ({
                        ...prevStatus,
                        [commentId]: null
                    }));
                    setCountLikesComment(prevCount => ({
                        ...prevCount,
                        [commentId]: (prevCount[commentId] || 0) - 1
                    }));
                }
            })
            .catch(error => {
                error;
            });
    }
    return {like, likeStatus, countLikes, likeComment,
            likeStatusComment, countLikesComment, 
            addLikePost, dislikePost, addLikeComment, dislikeComment}
}

export default useLikesHooks;