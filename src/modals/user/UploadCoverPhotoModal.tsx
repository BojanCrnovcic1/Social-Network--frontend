import React, { useState } from 'react'
import apiPhotoService, { ApiResponse } from '../../api/api.photo.service';
import './uploadPhotoModal.scss';

interface CoverPhotoModalProps {
    show: boolean;
    handleClose: () => void;
}

const UploadCoverPhotoModal: React.FC<CoverPhotoModalProps> = ({ show, handleClose}) => {
    const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        if (!coverPhoto) {
            console.error('Please select an image');
            return;
          }

          const formData = new FormData();
          formData.append('coverPhoto', coverPhoto);

          apiPhotoService('api/upload/coverPhoto', 'post', formData)
          .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return;
            }
            if (res.status === 'ok') {
                setCoverPhoto(res.data);
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
              setCoverPhoto(event.target.files[0])
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
                <h2>Upload Cover Photo</h2>
                <div className='content'>
                <form onSubmit={handleSubmit}>
                <label htmlFor="coverPhoto">Select Image:</label>
                      <input type="file" id='coverPhoto' onChange={handleImageChange} />
                      {previewImage && <img src={previewImage} alt="Selected Image Preview" />}
                       <button type="submit">Upload Cover Photo</button>
                </form>
                </div>
            </div>
        </div>
  )
}

export default UploadCoverPhotoModal;