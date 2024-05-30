import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '../../context/AuthContext'
import './leftBar.scss'
import {  faPassport } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DeleteUserModal from '../../modals/user/DeleteUserModal'
import apiService, { ApiResponse, removeToken } from '../../api/api.service'
import { defaultProfilePic } from '../../misc/defaultPicture'

const LeftBar:React.FC<{visible: boolean}> = ({visible}) => {
    const { user } =  useAuth();
    const [deleteUserModalOpen, setDeleteUserModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(user?.userId) {
        fetchLoginUser(user?.userId);
        }
    }, [user?.userId, user?.profilePhoto, user?.bio])

    const handleModalClose = () => {
        setDeleteUserModalOpen(false);
    }

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    }

    const fetchLoginUser = async (userId: number) => {
        apiService(`api/user/${userId}`, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return;
            }
            if (res.status === 'ok') {
                return res.data;
            }
        })
        .catch(error => {
            error;
        })
    }

  return (
    <div className={visible ? 'leftbar show' : 'leftbar hide'}>
        <div className='container'>
            { user &&
            <div className='menu'>
            <div className='user'>
                <div className='userInfo'>
                    <img src={user.profilePhoto ? user.profilePhoto: defaultProfilePic} alt="" />
                    <span>{user?.username}</span>
                    
                    <Link to={`/profile/${user.userId}`}>
                    <FontAwesomeIcon icon={faPassport} />
                    </Link>                    
                </div>
                <hr />
                <div className='biography'>
                    <p>
                        {user?.bio}
                    </p>
                </div>
            </div>
            <div className='item'>
                <div className='logout'>
                    <button type='button' onClick={() => handleLogout()}>logout</button>
                </div>
                {user?.userId === user?.userId && (
                    <div className='delete'>
                    <button type='button' onClick={() => setDeleteUserModalOpen(true)}>delete</button>
                    {deleteUserModalOpen && (
                        <DeleteUserModal show={deleteUserModalOpen} user={user} handleClose={handleModalClose} />
                    )}
                </div>
                )}               
            </div>          
        </div>}
        </div>
    </div>
  )
}

export default LeftBar;