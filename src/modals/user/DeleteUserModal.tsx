import React, { useState } from 'react';
import { User } from '../../types/User';
import apiService, { ApiResponse } from '../../api/api.service';
import './deleteUserModal.scss';
import { useNavigate } from 'react-router-dom';

interface DeleteUserModalProps {
    show: boolean;
    user: User;
    handleClose: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ show, user, handleClose }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const navigate = useNavigate();

    const handleDeleteUser = () => {
        setIsDeleting(true);
        apiService(`api/user/delete/${user.userId}`, 'delete', {})
            .then((res: ApiResponse) => {
                if (res.status === 'ok') {
                    console.log('User deleted successfully.');
                    setIsDeleted(true);
                        navigate('/register');
                    
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    return (
        <div className={`modal ${show ? 'show' : 'hide'}`}>
            <div className='delete-user-content'>
                <h2>Delete User</h2>
                <p>Are you sure you want to delete this profile?</p>
                <div className='buttons'>
                    <button type='button' className='button-yes' onClick={handleDeleteUser}>Yes</button>
                    <button type='button' className='button-no' onClick={handleClose}>No</button>
                </div>
            </div>
            {isDeleting || isDeleted? (
                <p>Deleting user...</p>
            ) : null}
        </div>
    );
};

export default DeleteUserModal;
