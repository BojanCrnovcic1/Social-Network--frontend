import React, { useState } from 'react'
import apiPhotoService, { ApiResponse } from '../../api/api.photo.service';
import './uploadPhotoModal.scss';

interface ProfilePhotoModalProps {
    show: boolean;
    handleClose: () => void;
}

const UploadProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({ show, handleClose}) => {
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        if (!profilePhoto) {
            console.error('Please select an image');
            return;
          }

          const formData = new FormData();
          formData.append('profilePhoto', profilePhoto);

          apiPhotoService('api/upload/profilePhoto', 'post', formData)
          .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return;
            }
            if (res.status === 'ok') {
                setProfilePhoto(res.data);
                handleClose();
            }
          })
          .catch(error => {
            console.error( error)
          })
        
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result && event.target.files?.[0]) {
              setProfilePhoto(event.target.files[0])
              setPreviewImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(event.target.files[0]);
          }
    }

  return (
    <div className={`modal ${show ? 'show' : 'hide'}`}>
            <div className='modal-content'>
                <span className='close' onClick={handleClose}>X</span>
                <h2>Upload Profile Photo</h2>
                <div className='content'>
                <form onSubmit={handleSubmit}>
                <label htmlFor="profilePhoto">Select Image:</label>
                      <input type="file" id='profilePhoto' onChange={handleImageChange} />
                      {previewImage && <img src={previewImage} alt="Selected Image Preview" />}
                       <button type="submit">Upload Profile Photo</button>
                </form>
                </div>
            </div>
        </div>
  )
}

export default UploadProfilePhotoModal;