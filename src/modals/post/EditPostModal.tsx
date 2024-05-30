import React, { useState } from 'react'
import './editPostModal.scss'
import apiService, { ApiResponse } from '../../api/api.service';
import { PostType } from '../../types/PostType';

interface ContentModalProps {
    show: boolean;
    post: PostType;
    handleClose: () => void;
}


const EditPostModal: React.FC<ContentModalProps> = ({ show, post, handleClose }) => {
    const [editContent, setEditContent] = useState<string>(post.content || '');

    const handleSubmit = async () => {
        apiService(`api/post/edit/${post?.postId}`, 'patch', {
            newContent: editContent
        })
        .then((res: ApiResponse) => {
            if (!editContent) {
                return;
            }
            if (res.status === 'error') {
                return;
            }
            if (res.status === 'ok') {
                setEditContent(res.data);
                handleClose();
            }
        })
        .catch(error => {
            console.error(error);
        })
    }
    

  return (
    <div className={`modal ${show ? 'show' : 'hide'}`}>
            <div className='modal-edit-post-content'>
                <span className='close' onClick={handleClose} title="Close Modal">X</span>
                <h2>Edit Post</h2>
                <div className='content'>
                    <label htmlFor='editPost'>Edit:</label>
                    <textarea value={editContent} id='editPost' onChange={event => setEditContent(event.target.value)} />
                    <button type='button' onClick={handleSubmit}>Save Changes</button>
                </div>
            </div>
        </div>
  )
}

export default EditPostModal;