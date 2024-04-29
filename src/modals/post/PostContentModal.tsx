import React, { useState } from 'react'
import apiService, { ApiResponse } from '../../api/api.service';
import './postModal.scss';

interface ContentModalProps {
    show: boolean;
    handleClose: () => void;
}

const PostContentModal: React.FC<ContentModalProps> = ({ show, handleClose }) => {
    const [content, setContent] = useState<string>("");

    const handleSumbit = async () => {
        apiService('api/post/createPost', 'post', {
            content: content
        })
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return;
            }
            if (res.status === 'ok')  {
                setContent(res.data);
                handleClose();
            }
        })
        .catch(error => {
            console.error(error);
        })
    }
  return (
    <div className={`modal ${show ? 'show' : 'hide'}`}>
        <div className='modal-post-content'>
            <span className='close' onClick={handleClose}>X</span>
            <h2>Add Post</h2>
            <div className='content'>
                <textarea value={content} placeholder='post...' onChange={event => setContent(event.target.value)} />
                <button type='button' onClick={() => handleSumbit()}>Add</button>
            </div>
            
        </div>
    </div>
  )
}

export default PostContentModal;
