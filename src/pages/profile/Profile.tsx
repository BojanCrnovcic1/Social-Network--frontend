import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './profile.scss';
import { faGlobe, faMessage, faPlus } from '@fortawesome/free-solid-svg-icons';
import Posts from '../../components/posts/Posts';
import { useParams } from 'react-router-dom';
import apiService, { ApiResponse } from '../../api/api.service';
import { useEffect, useState } from 'react';
import { User } from '../../types/User';
import useFollowUser from '../../hooks/useFollowUser';
import { useAuth } from '../../context/AuthContext';
import { ApiConfig } from '../../config/api.config';
import UploadCoverPhotoModal from '../../modals/user/UploadCoverPhotoModal';
import UploadProfilePhotoModal from '../../modals/user/UploadProfilePhotoModal';
import EditUserModal from '../../modals/user/EditUserModal';
import { defaultCoverPic, defaultProfilePic } from '../../misc/defaultPicture';
import { Link } from 'react-router-dom';

const Profile = () => {
const { id } = useParams();
const userId = Number(id);
const [otherUser, setOtherUser] = useState<User | null>(null);
const { following, followUser, unfollowUser, checkFollowing } = useFollowUser();
const { user } = useAuth()
const [uploadCoverPhotoModalOpen, setUploadCoverPhotoModalOpen] = useState<boolean>(false);
const [uploadProfilePhotoModalOpen, setUploadProfilePhotoModalOpen] = useState<boolean>(false);
const [editUserProfileModalOpen, setEditUserProfileModalOpen] = useState<boolean>(false);

useEffect(() => {
  if (userId) {
  fetchUser();
  }
}, [userId])

useEffect(() => {
  if (user?.userId) {
  fetchUser();
  }
}, [user?.userId, user?.profilePhoto, user?.coverPhoto])

useEffect(() => {
  if (user?.userId) {
    checkFollowing(user.userId, userId)
  }
},[user?.userId, userId])

const fetchUser = async () => {
  if (userId) {
  apiService(`api/user/${userId}`, 'get', {})
  .then((res: ApiResponse) => {
    if (res.status === 'error') {
      return;
    }
    if (res.status === 'ok') {
      setOtherUser(res.data);
    }
  })
  .catch(err => {
    console.error(err)
  }) 
}
} 

const handleToggleFollow = () => {
  if (otherUser?.userId) {
    if (following) {
      unfollowUser(otherUser.userId);
    } else {
      followUser(otherUser.userId);
    }
  }
};

const handleCloseUploadProfileModal = () => {
   setUploadProfilePhotoModalOpen(false);
};
const handleCloseUploadCoverModal = () => {
 setUploadCoverPhotoModalOpen(false);
}

const handleCloseEditUserProfileModal = () => {
  setEditUserProfileModalOpen(false);
}

  return (
    <div className='profile'>
      <div className='images'>     
        <img src={otherUser?.coverPhoto ? ApiConfig.PHOTO_PATH + otherUser?.coverPhoto : defaultCoverPic} alt='' className='cover'/>
        {user && user.userId === userId && (
           <div className="upload-icon-container">
           <FontAwesomeIcon icon={faPlus} onClick={() => setUploadCoverPhotoModalOpen(true)} />
         </div>
         )}
         {uploadCoverPhotoModalOpen && (
         <UploadCoverPhotoModal show={uploadCoverPhotoModalOpen} handleClose={handleCloseUploadCoverModal} />)}         
        <img src={otherUser?.profilePhoto ? ApiConfig.PHOTO_PATH + otherUser.profilePhoto: defaultProfilePic} alt='' className='profilePic' />
        {user && user.userId === userId && (
           <div className="upload-profile-icon-container">
           <FontAwesomeIcon icon={faPlus} onClick={() => setUploadProfilePhotoModalOpen(true)} />
         </div>
         )}
         {uploadProfilePhotoModalOpen && (
         <UploadProfilePhotoModal show={uploadProfilePhotoModalOpen} handleClose={handleCloseUploadProfileModal} />)}  
      </div>
      <div className='profileContainer'>
        <div className='uInfo'>
          <div className='left'>
            <FontAwesomeIcon icon={faMessage} />
            <Link to={'/'}>
            <FontAwesomeIcon icon={faGlobe} />
            </Link>
          </div>
          <div className='center'>
            <span>{otherUser && otherUser.username}</span> 
            {user && otherUser && user.userId === otherUser.userId ? (
            <div>
            <button type='button' onClick={() => setEditUserProfileModalOpen(true)}>Edit Profile</button>
            {editUserProfileModalOpen && (
            <EditUserModal show={editUserProfileModalOpen} user={user} handleClose={handleCloseEditUserProfileModal} />)}
            </div>
            ) : (
            <button type='button' onClick={handleToggleFollow}>
              {following ? 'Unfollow' : 'Follow'}
            </button>
            )}
          </div>
          <div className='right'>
            <p>{otherUser && otherUser?.bio}</p>
          </div>
        </div>
        <Posts authorId={userId}/>
      </div>
    </div>
  ) 
}

export default Profile;