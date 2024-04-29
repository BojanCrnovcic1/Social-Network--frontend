import { faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { User } from '../../types/User';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showResults, setShowResults] = useState<boolean>(false);
    

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

  
  return (
    <form onSubmit={handleSearchSubmit} className="search-bar">
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {showResults && (
        <button type='button' className="close-results" title='close results' onClick={handleCloseResults}>
          X
        </button>
      )}
    </form>
  )
}

export default SearchBar