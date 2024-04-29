import React, { useState } from 'react'
import './postModal.scss';
import apiPhotoService, { ApiResponse } from '../../api/api.photo.service';

interface ContentModalProps {
    show: boolean;
    handleClose: () => void;
  
}

const PostPhotoModal: React.FC<ContentModalProps> = ({ show, handleClose}) => {
    const [photo, setPhoto] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        if (!photo) {
            console.error('Please select an image');
            return;
          }

          const formData = new FormData();
          formData.append('postPhoto', photo);

          apiPhotoService('api/upload/postPhoto', 'post', formData)
          .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return;
            }
            if (res.status === 'ok') {
                setPhoto(res.data);
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
              setPhoto(event.target.files[0])
              setPreviewImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(event.target.files[0]);
          }
    }

  return (
    <div className={`modal ${show ? 'show' : 'hide'}`}>
            <div className='modal-post-content'>
                <span className='close' onClick={handleClose}>X</span>
                <h2>Upload Image</h2>
                <div className='content'>
                <form onSubmit={handleSubmit}>
                <label htmlFor="postPhoto">Select Image:</label>
                      <input type="file" id='postPhoto' onChange={handleImageChange} />
                      {previewImage && <img src={previewImage} alt="Selected Image Preview" />}
                       <button type="submit">Upload Image</button>
                </form>
                </div>
            </div>
        </div>
  )
}

export default PostPhotoModal;