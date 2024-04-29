import React, { useEffect, useState } from 'react'
import './editUserModal.scss';
import { User } from '../../types/User';
import apiService, { ApiResponse } from '../../api/api.service';

interface EditUserModalProps {
    show: boolean;
    user?: User;
    handleClose: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ show, user, handleClose}) => {
  
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');

  useEffect(() => {
    handleEditProfile()
  }, [])

  const handleEditProfile = async () => {
    
    
    const formData = new FormData()
    if (password !== '') {
      formData.append('password', password);
    }
    if (username !== '') {
      formData.append('username', username);
    }
    if (bio !== '') {
      formData.append('bio', bio);
    }
    if (formData) {
    apiService(`api/user/edit/${user?.userId}`, 'patch', formData)
    .then((res: ApiResponse) => {
      if (res.status === 'error') {
        return;
      }
      
    })
  }
 }
 
  return (
    <div className={`modal ${show ? 'show' : 'hide'}`}>
      <div className='edit-user-content'>
      <span className='close' onClick={handleClose}>X</span>
        <h2>Edit your profile:</h2>
        <h4>Please, fill in all the fields.</h4>
        <div className='edit-content'>
          <form>
            <label htmlFor='password'>Password:</label>
            <input type='password' id='password' value={password} placeholder='********'
                   onChange={event => setPassword(event.target.value as any)}/>
            <label htmlFor='username'>Username:</label>
            <input type='text' id='username' value={username} placeholder='New username...'
                   onChange={event => setUsername(event.target.value as any)} />
            <label htmlFor='bio'>Biography:</label>
            <input type='textarea' id='bio' value={bio} placeholder='New biography...'
                   onChange={event => setBio(event.target.value as any)} />
            <button type='button' onClick={() => handleEditProfile()} onAuxClick={handleClose}>confirm changes</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditUserModal;