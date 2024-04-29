import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../context/AuthContext';
import './comments.scss';
import { faEdit, faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import apiService, { ApiResponse } from '../../api/api.service';
import { PostType } from '../../types/PostType';
import { CommentType } from '../../types/CommentType';
import EditCommentModal from '../../modals/comment/EditCommentModal';
import DeleteCommentModal from '../../modals/comment/DeleteCommentModal';
import { ApiConfig } from '../../config/api.config';
import { defaultProfilePic } from '../../misc/defaultPicture';
import useLikesHooks from '../../hooks/useLikesHooks';
import { Link } from 'react-router-dom';


interface CommentsProps {
  post: PostType;
  setCommentCount: Function;
}

const Comments: React.FC<CommentsProps> = ({ post, setCommentCount }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<CommentType[]>([]);
    const { likeStatusComment, addLikeComment, dislikeComment } = useLikesHooks();
    const [content, setContent] = useState<string>("");
    const [editCommentModalOpen, setEditCommentModalOpen] = useState<boolean>(false);
    const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [fetchedLikesComment, setFetchedLikesComment] = useState<{ [key: number]: number[] }>({}); 

    useEffect(() => {
      fatchAllComment();
    }, [post.postId]);

    useEffect(() => {
      comments.forEach(comment => {
        if (comment.commentId) {
         fetchCommentLikes(comment.commentId)
         console.log(fetchedLikesComment)
    }})      
    }, [comments, fetchedLikesComment])

    const fatchAllComment = async () => {
      setLoading(true);
      apiService(`api/comment/${post.postId}`, 'get', {})
        .then((res: ApiResponse) => {
          if (res.status === 'error') {
            setComments([]);
          } else if (res.status === 'ok') {
            const sortedComments = res.data.sort((a: CommentType, b: CommentType) => {
              if (a.createdAt && b.createdAt) {
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              } else {
                  return 0;
              }
          });
          setComments(sortedComments);
          setCommentCount(sortedComments.length)
        }
        setLoading(false);
      })
      .catch(error => {
        setComments([]);
        setLoading(false);
        console.error(error);
      });
    };
    
    const handleSumbit = async () => {
      apiService(`api/comment/createComment/${post.postId}`, 'post', {
        content: content
      })
      .then((res: ApiResponse) => {
        if (!content.trim()) {
          return;
        }

        if (res.status === 'error') {
          setContent("");
          return;
        }
        if (res.status === 'ok') {
          setComments([...comments, res.data]);
          setContent("");
        }
      })
      .catch(err => {
        console.error(err);
      });
    };

    const fetchCommentLikes = async (commentId: number) => {
      apiService(`api/comment/likes/${commentId}`, 'get', {})
      .then((res: ApiResponse) => {
          if (res.status === 'error') {
              return;
          }
          if (res.status === 'ok') {
            setFetchedLikesComment(prevState => ({
              ...prevState,
              [commentId]: res.data
            }));
          }
      })
      .catch(error => {
          error;
      })
  }

    const handleCloseModal = () => {
      setEditCommentModalOpen(false);
    };

    const handleCloseDeleteModal = () => {
      setDeleteCommentModalOpen(false);
    };

    
  return (
    <div className='comments'>
        <div className='write'>
            <img src={user?.profilePhoto ? ApiConfig.PHOTO_PATH+user?.profilePhoto : defaultProfilePic} alt="" />
            <input type='text' placeholder='Write a comment...' value={content} onChange={e => setContent(e.target.value)} />
            <button type='button' onClick={() => handleSumbit()}>Send</button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : comments.length === 0 ? (
          <p>No comments.</p>
        ) : (
          comments.map((comment) => (
            <div className='comment' key={comment.commentId}>
                <img src={
                 comment.user?.profilePhoto && ApiConfig.PHOTO_PATH + comment.user?.profilePhoto} alt="" />
                <div className='info'>
                  <Link to={`/profile/${comment.user?.userId}`}>
                  { comment.user?.username && <span>{comment.user.username}</span>}
                  </Link>                
                    <p>{comment.content}</p>
                </div>
                <span className="date">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}</span>
                <div className='like-comment' onClick={() => {
                    if (comment.commentId && likeStatusComment[comment.commentId] === 'likeComment') {
                       comment.commentId && dislikeComment(comment.commentId);
                    } else {
                      comment.commentId && addLikeComment(comment.commentId);
                    }
                }}>
                <FontAwesomeIcon icon={faHeart} className={comment.commentId && likeStatusComment[comment.commentId] === 'likeComment' ? 'liked' : ''} 
                                                style={{ color: comment.commentId && likeStatusComment[comment.commentId] === 'likeComment' ? 'red' : 'inherit' }} />
                                        {comment.commentId && fetchedLikesComment[comment.commentId]?.length}
                </div>
                {user?.userId === comment.user?.userId && (
                  <div className='edit-delete'> 
                  <FontAwesomeIcon icon={faEdit} onClick={() => setEditCommentModalOpen(true)}/>
                  <FontAwesomeIcon icon={faTrash} onClick={() => setDeleteCommentModalOpen(true)}/>
                  {editCommentModalOpen && (
                  <EditCommentModal show={editCommentModalOpen} comment={comment} handleClose={handleCloseModal}/> )}
                  {deleteCommentModalOpen && (
                <DeleteCommentModal show={deleteCommentModalOpen} comment={comment} handleClose={handleCloseDeleteModal}/> )}
                </div>
                )}
            </div>
        ))
        )}
    </div>    
  );
};

export default Comments;
