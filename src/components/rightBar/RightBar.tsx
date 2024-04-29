import { useAuth } from '../../context/AuthContext';
import FollowersList from '../follower/FollowersList';
import FollowingList from '../follower/FollowingList';
import Gallery from '../gallery/Gallery';
import './rightBar.scss'

const RightBar:React.FC<{visible: boolean}> = ({visible}) => {
    const { user } =  useAuth()
  return (
    <div className={visible ? 'rightbar show' : 'rightbar hide'}>
        <div className='container'>
            <div className='follower'>
            <div className='followers'>
                {user && <FollowersList user={user} />}
            </div>
            <div className='following'>
                {user?.userId && <FollowingList user={user} />}
            </div>
            </div>
            
                {user?.userId && <Gallery user={user}/>}
            
        </div>
    </div>
  )
}

export default RightBar;