import  { useState } from 'react'
import apiService, { ApiResponse } from '../api/api.service';

const useFollowUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState<boolean>(false);

  const followUser = async ( followingId: number ) => {
    setLoading(true);
    setError(null);

    apiService(`api/relationship/follow/${followingId}`, 'post', {})
    .then((res: ApiResponse) => {
        if (res.status === 'error') {
            setError('Failed to follow user.');
        }
        if (res.status === 'ok') {
            setFollowing(res.data);
        }
    })
    .catch(error => {
        setError('Failed to follow user.');
        error;
    });
 }

 const unfollowUser = async ( followingId: number ) => {
    setLoading(true);
    setError(null);

apiService(`api/relationship/unfollow/${followingId}`, 'delete', {})
.then((res: ApiResponse) => {
    if (res.status === 'error') {
        setError('Failed to follow user.');
    }
    if (res.status === 'ok') {
        setFollowing(false);
    }
})
.catch(error => {
    setError('Failed to follow user.');
    error;
})
}

const checkFollowing = async ( userId: number, followingId: number) => {
    setLoading(true);
    setError(null);

    apiService(`api/relationship/${userId}/${followingId}`, 'get', {})
      .then((res: ApiResponse) => {
        if (res.status === 'ok') {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      })
      .catch(error => {
        error
        setError('Failed to check following status.');
        setLoading(false); 
      });
  }
  return (
    {loading, error, following, followUser, unfollowUser, checkFollowing}
  )
}

export default useFollowUser;