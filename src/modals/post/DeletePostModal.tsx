import React, { useEffect, useState } from 'react';
import { PostType } from '../../types/PostType';
import apiService, { ApiResponse } from '../../api/api.service';
import './deletePostModal.scss';

interface DeletePostModalProps {
    show: boolean;
    post: PostType;
    handleClose: () => void;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({ show, post, handleClose }) => {
    const [deletePost, setDeletePost] = useState<string>(post.content || '');

    useEffect(() => {
        deleteSubmit();
    }, []);

    const deleteSubmit = async () => {
        apiService(`api/post/${post.postId}`, 'delete', {})
            .then((res: ApiResponse) => {
                if (!deletePost) {
                    return;
                }
                if (res.status === 'error') {
                    return;
                }
                if (res.status === 'ok') {
                    setDeletePost(res.data);
                    handleClose();
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div className={`modal ${show ? 'show' : 'hide'}`}>
            <div className='modal-delete-post-content'>
                <span className='close' onClick={handleClose}>X</span>
                <h2>Delete Post</h2>
                <p>Are you sure you want to delete this post?</p>
                <div className='buttons'>
                    <div className='button-delete'>
                    <button type='button' onClick={deleteSubmit}>Yes</button>
                    </div>
                    <button type='button' onClick={handleClose}>No</button>
                </div>
            </div>
        </div>
    );
};

export default DeletePostModal;
