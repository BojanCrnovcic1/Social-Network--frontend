import React, { useEffect, useState } from 'react'
import { PostType } from '../../types/PostType';
import apiPhotoService, { ApiResponse } from '../../api/api.photo.service';
import './galleryProfile.scss'

interface UserPhotoProps {
    authorId: number | undefined;
}

const GalleryProfile: React.FC<UserPhotoProps> = ({ authorId }) => {
    const [postsWithPhotos, setPostsWithPhotos] = useState<PostType[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);


    useEffect(() => {
        fetchPostWithPhotos();
    },[postsWithPhotos])

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
      };
      

    const fetchPostWithPhotos = async () => {
        apiPhotoService(`api/post/${authorId}`, 'get', {})
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


    const scrollProfile = (direction: 'left' | 'right') => {
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
        <div className='photo-gallery-profile'>
            <h3>Gallery</h3>
            <div className='gallery-images' ref={scrollRef}>
                <div className='gallery-images-container'>
                {postsWithPhotos.map((post, index) => (
                    <div className='gallery-image' key={`gallery-image-${index}`} onClick={() => post.photo && handleImageClick(post.photo)}>
                        <img src={post.photo} alt={`Post ${index + 1}`} />
                    </div>
                ))}
                </div>
            </div>
            <div className='gallery-arrows'>
                <button type='button' className='gallery-arrow' onClick={() => scrollProfile('left')}>left</button>
                <button type='button' className='gallery-arrow' onClick={() => scrollProfile('right')}>right</button>
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

export default GalleryProfile;