import React, { useEffect, useState } from 'react'
import { PostType } from '../../types/PostType';
import apiPhotoService, { ApiResponse } from '../../api/api.photo.service';
import { ApiConfig } from '../../config/api.config';
import { User } from '../../types/User';
import './gallery.scss'

interface UserPhotoProps {
    user: User;
}

const Gallery: React.FC<UserPhotoProps> = ({ user }) => {
    const [postsWithPhotos, setPostsWithPhotos] = useState<PostType[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPostWithPhotos();
    },[])

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
      };
      

    const fetchPostWithPhotos = async () => {
        apiPhotoService(`api/post/${user.userId}`, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return;
            }
            if (res.status === 'ok') {
                const photos = res.data.filter((post: PostType) => post.photo);
                setPostsWithPhotos(photos);
            }
        })
        .catch(error => {
            error;
        })
    }


    const scroll = (direction: 'left' | 'right') => {
        const { current } = scrollRef;
    
        if (current) {
          if (direction === 'left') {
            current.scrollLeft -= 300;
          } else {
            current.scrollLeft += 300;
          }
        }
    };
  return (
    <div className='photo-gallery'>
        <h3>Gallery</h3>
        <div className='gallery-images' ref={scrollRef}>
            <div className='gallery-images-container'>
            {postsWithPhotos.map((post, index) => (
                <div className='gallery-image' key={`gallery-image-${index}`} onClick={() => handleImageClick(ApiConfig.PHOTO_PATH + post.photo)}>
                    <img src={ApiConfig.PHOTO_PATH + post.photo} alt={`Post ${index + 1}`} />
                </div>
            ))}
            </div>
        </div>
        <div className='gallery-arrows'>
            <button type='button' className='gallery-arrow' onClick={() => scroll('left')}>left</button>
            <button type='button' className='gallery-arrow' onClick={() => scroll('right')}>right</button>
        </div>
        {selectedImage && (
                <div className="fullscreen-image-overlay">
                    <div className="fullscreen-image-container">
                        <img src={selectedImage} alt="Fullscreen" />
                    </div>
                    <div className='right-fullscreen'>
                    <button type='button' className='close-button' onClick={() => setSelectedImage(null)}>X</button>
                    </div>
                </div>
            )}
    </div>
  )
}

export default Gallery;