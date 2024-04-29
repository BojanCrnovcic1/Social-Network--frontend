import { useEffect, useState } from 'react';
import './post.scss'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faEdit, faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import Comments from '../comments/Comments';
import { PostType } from '../../types/PostType';
import apiService, { ApiResponse } from '../../api/api.service';
import { useAuth } from '../../context/AuthContext';
import EditPostModal from '../../modals/post/EditPostModal';
import DeletePostModal from '../../modals/post/DeletePostModal';
import { ApiConfig } from '../../config/api.config';
import useLikesHooks from '../../hooks/useLikesHooks';
import { defaultProfilePic } from '../../misc/defaultPicture';

interface PostProps {
    post: PostType;
    userOthId: number | undefined;
}

const Post: React.FC<PostProps> = ({ post }) => {
    const [commentOpen, setCommentOpen] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [profilePhoto, setProfilePhoto] = useState<string>("");
    const [deletePostModalOpen, setDeletePostModalOpen] = useState<boolean>(false);
    const [editPostModalOpen, setEditPostModalOpen] = useState<boolean>(false);
    const { user } = useAuth();
    const [commentCount, setCommentCount] = useState<number>(0);
    const userId = user?.userId;
    const { likeStatus, addLikePost, dislikePost } = useLikesHooks();
    const [fetchedLikes, setFetchedLikes] = useState<number[]>([]); 

    useEffect(() => {
        if (post.userId && post.postId){
            fatchUsername(post.userId);
            fetchProfilePhoto(post.userId);
        }
    },[post.userId, post.photo, post.postId]);

    useEffect(() => {
        fetchPostLikes();
    }, [fetchedLikes])

    
    const fatchUsername = async (userId: number) => {
        apiService(`api/user/${userId}`, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                setUsername('')
                return;
            }
            if (res.status === 'ok') {
                setUsername(res.data.username)

            }
        })
        .catch(error => {
            console.error(error);
            setUsername('');
        })
    }

    const fetchProfilePhoto = (userId: number) => {
        apiService(`api/user/${userId}`, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                setProfilePhoto('')
                return;
            }
            if (res.status === 'ok') {
                setProfilePhoto(res.data.profilePhoto)

            }
        })
        .catch(error => {
            console.error(error);
            setUsername('');
        })
    }

    const fetchPostLikes = async () => {
        apiService(`api/post/likes/${post.postId}`, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return;
            }
            if (res.status === 'ok') {
                setFetchedLikes(res.data);
            }
        })
        .catch(error => {
            error;
        })
    }

    const handleCloseModal = () => {
        setEditPostModalOpen(false);
      };

      const handleCloseDeleteModal = () => {
        setDeletePostModalOpen(false)
      };

    const forrmatedDate = post.createdAt ? new Date(post.createdAt).toLocaleString() : '';
    

  return (
    <div className='post'>
        <div className='container'>
            <div className='user'>
                <div className='userInfo'>
                    <img src={profilePhoto ? ApiConfig.PHOTO_PATH + profilePhoto : defaultProfilePic } alt="" />
                    <div className='details'>
                        <Link to={`/profile/${post.userId}`}
                        style={{ textDecoration: "none", color: "inherit" }}>
                            <span className='name'>{
                                username || post.userId
                            }</span>
                        </Link>
                        <span className='date'>{forrmatedDate}</span>
                    </div>
                </div>
                {userId === post.userId && (
            <div className='edit-delete'> {}
              <FontAwesomeIcon icon={faEdit} onClick={() => setEditPostModalOpen(true)}/>
              <FontAwesomeIcon icon={faTrash} onClick={() => setDeletePostModalOpen(true)}/>
              {editPostModalOpen && (
                <EditPostModal show={editPostModalOpen} post={post} handleClose={handleCloseModal}/> )}
              {deletePostModalOpen && (
                <DeletePostModal show={deletePostModalOpen} post={post} handleClose={handleCloseDeleteModal}/> )}
            </div>
            
          )}
            </div>
            <div className='content'>
                <p>{post.content}</p>
                <img src={ApiConfig.PHOTO_PATH + post.photo} alt="" onLoad={() => console.log("Image loaded successfully!")}/>
            </div>
            <div className='info'>
                <div className='item' onClick={() => {
                    if (likeStatus === 'like') {
                       post.postId && dislikePost(post.postId);
                    } else {
                      post.postId &&  addLikePost(post.postId);
                    }
                }}>
                     <FontAwesomeIcon icon={faHeart} 
                                      className={likeStatus === 'like' ? 'liked' : ''} 
                                      style={{ color: likeStatus === 'like' ? 'red' : 'inherit' }}
                                     
                     />
                    {fetchedLikes.length}
                </div>
                <div className='item' onClick={() => setCommentOpen(!commentOpen)} >
                    <FontAwesomeIcon icon={faComment} /> {commentCount} comments
                </div>
            </div>
            {commentOpen && < Comments post={post} setCommentCount={setCommentCount}/>}
        </div>
    </div>
  )
}

export default Post;