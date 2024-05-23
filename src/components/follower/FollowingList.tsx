import React, { useEffect, useState } from 'react'
import apiService, { ApiResponse } from '../../api/api.service';
import { Link } from 'react-router-dom';
import { User } from '../../types/User';
import { Relationship } from '../../types/Relationsphip';
import { defaultProfilePic } from '../../misc/defaultPicture';

interface RelationshipProps {
    user: User;
}

const FollowingList: React.FC<RelationshipProps> = ({ user }) => {
    const [following, setFollowing] = useState<Relationship[]>([]);

    useEffect(() => {
        fetchFollowing();
    },[]);

    const fetchFollowing = async () => {
        apiService(`api/relationship/following/${user.userId}`, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                return;
            }
            if (res.status === 'ok') {
                setFollowing(res.data);
            }
        })
        .catch(error => {
            console.error('Error fetching following:', error);
        })
    }
  return (
    <div className='followingList'>
        <h3>Following: {following.length}</h3>
        <ul>
            {following.map((followedUser => (
                <li key={generateUniqueKey(followedUser)}>
                    <Link to={`/profile/${followedUser.followingId}`}>
                        <div className='information'>
                        <img src={followedUser.following.profilePhoto ? followedUser.following?.profilePhoto: defaultProfilePic} alt="" />
                        <span>{followedUser.following?.username}</span>
                        </div>
                    </Link>
                </li>
            )))}
        </ul>
    </div>
  )
}

function generateUniqueKey(followedUser: Relationship) {    
    return `${followedUser.followerId}-${followedUser.followingId}`; 
  }


export default FollowingList;