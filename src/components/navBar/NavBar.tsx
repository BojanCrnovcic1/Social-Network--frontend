import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './navBar.scss';
import { faLightbulb, faMoon, faPerson } from '@fortawesome/free-solid-svg-icons';
import { useDarkMode } from '../../context/DarkModeContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ApiConfig } from '../../config/api.config';
import { useEffect, useState } from 'react';
import apiService, { ApiResponse } from '../../api/api.service';
import { User } from '../../types/User';
import SearchBar from './SearchBar';
import { defaultProfilePic } from '../../misc/defaultPicture';


const NavBar = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false); 

    useEffect(() => {
      if (!searchTerm) {
        setUsers([]);
        setShowResults(false);
      } else {
        handleSearch(searchTerm);
      }
    }, [searchTerm])

    const handleSearch = (searchTerm: string) => {
      apiService(`api/user/username?username=${searchTerm}`, 'get', {})
      .then((res: ApiResponse) => {
        if (res.status === 'error') {
          setUsers([]);
          setShowResults(false);
        }
        if (res.status === 'ok') {
          setUsers(res.data);
          setShowResults(true);
        }
      })
      .catch(error => {
        error;
        setUsers([]);
        setShowResults(false)
      })
    }

    const handleCloseResults = () => {
      setShowResults(false);
      setSearchTerm(''); 
    }
   
    return (
      <div className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className='left'>
          <span>S-Network</span>
          <FontAwesomeIcon icon={isDarkMode ? faLightbulb : faMoon} onClick={toggleDarkMode} />
          <div className='search'>                
            <SearchBar onSearch={(term) => { setSearchTerm(term); setShowResults(true); }} />
          </div>
          {showResults && (
            <div className='search-results'>
              <div className='search-header'>
                 <h3>Search results: </h3>
                 <button
                   type='button'
                   className="close-results"
                   onClick={handleCloseResults}
                   title="Close results" >x</button>
              </div>
              {users.length > 0 ? (
                <ul>
                  {users.map(user => (
                    <li key={user.userId}>
                      <img src={user.profilePhoto ? ApiConfig.PHOTO_PATH + user.profilePhoto : defaultProfilePic} alt="" />
                      <Link to={`/profile/${user.userId}`} onClick={handleCloseResults}>
                        <span>{user.username}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>User not found...</p>
              )}
            </div>
          )}
        </div>
        <div className='right'>        
          <FontAwesomeIcon icon={faPerson} />
          <div className='user'>
          <img src={user?.profilePhoto ? ApiConfig.PHOTO_PATH + user?.profilePhoto: defaultProfilePic} alt="" />
            <Link to={`/profile/${user?.userId}`}>
              <span>{user?.username}</span>
            </Link>
          </div>
        </div>
      </div>
    )
}

export default NavBar;