import { useEffect, useRef, useState } from 'react'
import './stories.scss'
import { StoriesType } from '../../types/StoriesType'
import { useAuth } from '../../context/AuthContext';
import AddStoriesModal from '../../modals/stories/AddStoriesModal';
import apiPhotoService, { ApiResponse } from '../../api/api.photo.service';
import CountdownTimer from './CountdownTimer';
import { defaultProfilePic } from '../../misc/defaultPicture';

const Stories = () => {
  const [stories, setStories] = useState<StoriesType[]>([]);
  const [storyModalOpen, setStoryModalOpen] = useState<boolean>(false);
  const [fullscreenStory, setFullscreenStory] = useState<StoriesType | null>(null);
  const [usernames, setUsernames] = useState<{ [userId: number]: string }>({});
  const [viewedStories, setViewedStories] = useState<StoriesType[]>([]);
  const { user } = useAuth();
  const storiesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    adjustScroll();
    window.addEventListener('resize', adjustScroll);
    return () => {
      window.removeEventListener('resize', adjustScroll);
    };
  }, []);


  const adjustScroll = () => {
    const containerWidth = storiesContainerRef.current?.scrollWidth;
    const contentWidth = storiesContainerRef.current?.clientWidth;
    if (containerWidth && contentWidth) {
      const shouldScroll = containerWidth > contentWidth;
      storiesContainerRef.current!.style.overflowX = shouldScroll ? 'auto' : 'hidden';
    }
  };

  useEffect(() => {
    fetchStories();
    deleteExpiredStory();   
  }, [])

  useEffect(() => {
    fetchStories();  
  }, [stories])

  useEffect(() => {
    if (Array.isArray(stories)) {
      const userIds = stories.map(story => story.userId);
      userIds.forEach(userId => {
        if (userId && !usernames[userId]) {
          fetchUsername(userId);
        }
      });
    }
  }, [stories, usernames]);

  

  const fetchStories = async () => {
    apiPhotoService('api/stories', 'get', {})
    .then((res: ApiResponse) => {
      if (res.status === 'error') {
        return;
      }
      if (res.status === 'ok') {
        setStories(res.data);
      }
    })
    .catch(error => {
      error;
    })
  }

  const handleDeleteStory = async (storiesId: number) => {
    apiPhotoService(`api/stories/deleteStory/${storiesId}`, 'delete', {})
    .then((res: ApiResponse) => {
      if(res.status === 'error') {
        return;
      }
      if (res.status === 'ok') {
        setStories(prevStories => prevStories.filter(story => story.storiesId !== storiesId))
      }
    })
    .catch(error => {
      error;
    } )
  }

  const handleCloseModal = () => {
    setStoryModalOpen(false);
  };

  const handleViewStory = (story: StoriesType) => {
    if (story.storiesId !== undefined && !isStoryViewed(story.storiesId)) {
      const viewedStoriesString = localStorage.getItem('viewedStories');
        const viewedStories: number[] = viewedStoriesString ? JSON.parse(viewedStoriesString) : [];
        viewedStories.push(story.storiesId);
        localStorage.setItem('viewedStories', JSON.stringify(viewedStories));
    }
    setFullscreenStory(story); 
    setTimeout(() => setFullscreenStory(null), 10000); 
};

const isStoryViewed = (storyId: number) => {
  const viewedStoriesString = localStorage.getItem('viewedStories');
  const viewedStories: number[] = viewedStoriesString ? JSON.parse(viewedStoriesString) : [];
  return viewedStories.includes(storyId);
};

const deleteExpiredStory = async () => {
  apiPhotoService(`api/stories/deleteExpired`, 'delete', {})
  .then((res: ApiResponse) => {
    if (res.status === 'error') {
      return;
    }
    if (res.status === 'ok') {
      setStories(res.data);
    }
  })
  .catch(error => {
    error;
  })
}

const userStories = Array.isArray(stories) ? stories.filter(story => story.userId === user?.userId) : [];
const otherStories = Array.isArray(stories) ? stories.filter(story => story.userId !== user?.userId) : [];

userStories.sort((a, b) => {
  if (a.createdAt && b.createdAt) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
  return 0;
});

otherStories.sort((a, b) => {
  if (a.createdAt && b.createdAt) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
  return 0;
});

const fetchUsername = async (userId: number) => {
  apiPhotoService(`api/user/${userId}`, 'get', {})
  .then((res: ApiResponse) => {
      if (res.status === 'error') {
        setUsernames(prevUsernames => ({
          ...prevUsernames,
          [userId]: ''
        }));
          return;
      }
      if (res.status === 'ok') {
        setUsernames(prevUsernames => ({
          ...prevUsernames,
          [userId]: res.data.username
        }));

      }
  })
  .catch(error => {
      console.error(error);
      setUsernames(prevUsernames => ({
        ...prevUsernames,
        [userId]: ''
      }));
  })
}

const trackViewedStory = async (storiesId: number) => {
  apiPhotoService(`api/stories/viewedStory/${storiesId}`, 'post', {})
  .then((res: ApiResponse) => {
    if (res.status === 'ok') {
      const updatedStories = stories.map(story => {
        if (story.storiesId === storiesId) {
          return { ...story, isViewed: true };
        }
        return story;
      });
      setStories(updatedStories);
    }
  })
  .catch(error => {
    error
  })
}

const renderViewedStoriesList = (storiesId: number) => {
  apiPhotoService(`api/stories/allViewed/${storiesId}`, 'get', {})
  .then((res: ApiResponse) => {
    if (res.status === 'error') {
      setViewedStories([])
    }
    if (res.status === 'ok') {
      setViewedStories(res.data);
    }
  })
  .catch(error => {
    error
  })

  return (
    <div className='viewed-stories-list'>
      <h3>Viewed Stories</h3>
      <ul>
        {viewedStories.map(story => (
          <li key={story.storiesId}>
            {story.userId && usernames[story.userId]}
          </li>
        ))}
      </ul>
    </div>
  );
};

return (
  <div className='stories'>
    <div className='stories-container' ref={storiesContainerRef}>
    <div className='user-info'>
      <img src={user?.profilePhoto ? user?.profilePhoto: defaultProfilePic} alt="" />
      <span>{user?.username}</span>
      <button type='button' onClick={() => setStoryModalOpen(true)}>+</button>
      {storyModalOpen && (
        <AddStoriesModal show={storyModalOpen} handleClose={handleCloseModal} />
      )}
    </div>
    
      <div className='user-stories'>
      {userStories
        .filter(story => story.userId === user?.userId) 
        .map(story => (
          <div className={`story ${story.storiesId && isStoryViewed(story.storiesId) ? 'story-viewed' : ''}`} key={story.storiesId}>
            <img src={story.photoStories} alt="" />
            <span>{ story.userId && usernames[story.userId]}</span>
            { story.createdAt && <CountdownTimer startTime={new Date(story.createdAt)} /> }
            <button type='button' onClick={() => {if (story.storiesId) {handleViewStory(story); trackViewedStory(story.storiesId); }}}>+</button>
          </div>
        ))}
    </div>
    <div className='other-stories'>
      {otherStories
        .filter(story => story.userId !== user?.userId) 
        .map(story => (
          <div className={`story ${story.storiesId && isStoryViewed(story.storiesId) ? 'story-viewed' : ''}`} key={story.storiesId}>
            <img src={story.photoStories} alt="" />
            <span>{story.userId && usernames[story.userId]}</span>
            <button type='button' onClick={() => story.storiesId && handleViewStory(story)}>+</button>
          </div>
        ))}       
    </div>
   
  </div>
       {fullscreenStory && (
        <div className='fullscreen-story' onClick={() => setFullscreenStory(null)}>
          <div className='story-images'>
          <img src={fullscreenStory.photoStories} alt="" />
          </div>
          <div className='story-data'>
            <div className='story-button-delete'>
          {user?.userId === fullscreenStory.userId && (        
            <button type='button' onClick={() => fullscreenStory.storiesId && handleDeleteStory(fullscreenStory.storiesId)}>Delete</button>
          )}
           {user?.userId === fullscreenStory.userId && (
           fullscreenStory.storiesId && renderViewedStoriesList(fullscreenStory.storiesId)
           )}
           </div>
           
          </div>         
        </div>
      )}
</div>
);
}

export default Stories;