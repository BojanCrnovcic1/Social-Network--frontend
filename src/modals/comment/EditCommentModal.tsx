import React, { useState } from 'react'
import { CommentType } from '../../types/CommentType';
import apiService, { ApiResponse } from '../../api/api.service';
import './editCommentModal.scss';

interface ContentModalProps {
    show: boolean;
    comment: CommentType;
    handleClose: () => void;
}

const EditCommentModal: React.FC<ContentModalProps> = ({ show, comment, handleClose }) => {
    const [editContent, setEditContent] = useState<string>(comment.content || '');

    const handleSubmit = async () => {
        apiService(`api/comment/editComment/${comment.commentId}`, 'patch', {
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
            <div className='modal-edit-comment-content'>
                <span className='close' onClick={handleClose} title="Close Modal">X</span>
                <h2>Edit Comment</h2>
                <div className='content'>
                    <label htmlFor='editComment'>Edit:</label>
                    <textarea value={editContent} id='editComment' onChange={event => setEditContent(event.target.value)} />
                    <button type='button' onClick={handleSubmit}>Save Changes</button>
                </div>
            </div>
        </div>
  )
}

export default EditCommentModal