import { useState } from 'react';
import './addStoriesModal.scss'
import apiPhotoService, { ApiResponse } from '../../api/api.photo.service';

interface StoriesModalProps {
    show: boolean;
    handleClose: () => void;
}

const AddStoriesModal: React.FC<StoriesModalProps> = ({ show, handleClose}) => {
    const [story, setStory] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        if (!story) {
            console.error('Please select an image');
            return;
          }

          const formData = new FormData();
          formData.append('story', story);

          apiPhotoService('api/stories/story', 'post', formData)
          .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return;
            }
            if (res.status === 'ok') {
                setStory(res.data);
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
              setStory(event.target.files[0])
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
                
                <div className='content'>
                <form onSubmit={handleSubmit}>
                <label htmlFor="story">Select Image:</label>
                      <input type="file" id='story' onChange={handleImageChange} />
                      {previewImage && <img src={previewImage} alt="Selected Image Preview" />}
                       <button type="submit">Upload Story</button>
                </form>
                </div>
            </div>
        </div>
  )
}

export default AddStoriesModal;