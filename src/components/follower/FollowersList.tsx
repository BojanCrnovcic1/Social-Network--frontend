import React, { useEffect, useState } from 'react'
import apiService, { ApiResponse } from '../../api/api.service';
import { Link } from 'react-router-dom';
import { User } from '../../types/User';
import { Relationship } from '../../types/Relationsphip';
import { defaultProfilePic } from '../../misc/defaultPicture';

interface RelationshipProps {
    user: User;
}

const FollowersList: React.FC<RelationshipProps> = ({ user }) => {
    const [followers, setFollowers] = useState<Relationship[]>([]);

    useEffect(() => {  
       fetchFollowers();    
    }, []);

    const fetchFollowers = async () => {
        apiService(`api/relationship/followers/${user.userId}`, 'get', {})
        .then((res: ApiResponse) => {
            if(res.status === 'error') {
                return;
            }
            if (res.status === 'ok') {
                setFollowers(res.data);
            }
        })
        .catch(error => {
            console.error('Error fetching followers:', error);
        })
    }
  return (
    <div className='followersList'>
        <h3>Followers: {followers.length}</h3>
        <ul>
            {followers.map((followerUser) => (
                <li key={generateUniqueKey(followerUser)}>
                    <Link to={`/profile/${followerUser.followerId}`}>
                        <div className='information'>                      
                        <img src={followerUser.follower.profilePhoto ? followerUser.follower?.profilePhoto: defaultProfilePic} alt="" />
                        <span>{followerUser.follower?.username }</span>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    </div>
  )
}

function generateUniqueKey(follower: Relationship) {    
    return `${follower.followerId}-${follower.followingId}`; 
  }

export default FollowersList;