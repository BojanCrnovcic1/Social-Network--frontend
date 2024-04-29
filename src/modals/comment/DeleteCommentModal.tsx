import React, { useState } from 'react'
import { CommentType } from '../../types/CommentType';
import apiService, { ApiResponse } from '../../api/api.service';
import './deleteCommentModal.scss';

interface DeleteCommentModalProps {
    show: boolean;
    comment: CommentType;
    handleClose: () => void;
}

const DeleteCommentModal: React.FC<DeleteCommentModalProps> = ({ show, comment, handleClose }) => {
    const [deleteComment, setDeleteComment] = useState<string>(comment.content || '');

    const handleSubmit = async () => {
        apiService(`api/comment/${comment.commentId}`, 'delete', {})
        .then((res: ApiResponse) => {
            if (!deleteComment) {
                return;
            }
            if (res.status === 'error') {
                return;
            }
            if (res.status === 'ok') {
                setDeleteComment(res.data);
                handleClose();
            }
        })
        .catch(error => {
            console.error(error);
        });

    }
  return ( 
    <div className={`modal ${show ? 'show' : 'hide'}`}>
            <div className='modal-delete-comment-content'>
                <span className='close' onClick={handleClose}>X</span>
                <h2>Delete Comment</h2>
                <p>Are you sure you want to delete this comment?</p>
                <div className='buttons'>
                    <div className='button-delete'>
                    <button type='button' onClick={handleSubmit}>Yes</button>
                    </div>
                    <button type='button' onClick={handleClose}>No</button>
                </div>
            </div>
        </div>
  )
}

export default DeleteCommentModal