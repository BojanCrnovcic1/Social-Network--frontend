import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Posts from '../../components/posts/Posts'
import Stories from '../../components/stories/Stories'
import './home.scss'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import PostContentModal from '../../modals/post/PostContentModal'
import PostPhotoModal from '../../modals/post/PostPhotoModal'


const Home = () => {
  const [createPostModalOpen, setCreatePostModalOpen] = useState<boolean>(false);
  const [uploadPostModalOpen, setUploadPostModalOpen] = useState<boolean>(false);
  

  const handleCloseModal = () => {
    setCreatePostModalOpen(false);
  };
  const handleCloseUploadModal = () => {
    setUploadPostModalOpen(false);
  }

  return (
    <div className='home'>
     <Stories />
     <div className='buttons'>
        <div className='left-button'>
          <button type='button' onClick={() => setCreatePostModalOpen(true)}>create post</button>
        </div>
        <div className='right-button'>
          <FontAwesomeIcon icon={faImage} className='fa-icon' onClick={() => setUploadPostModalOpen(true)}/>
        </div>          
     </div>
     {createPostModalOpen && (
       <PostContentModal show={createPostModalOpen} handleClose={handleCloseModal}/> )}
       {uploadPostModalOpen && (
       <PostPhotoModal show={uploadPostModalOpen} handleClose={handleCloseUploadModal}/> )}
     <Posts/>
    </div>
  )
}

export default Home;
