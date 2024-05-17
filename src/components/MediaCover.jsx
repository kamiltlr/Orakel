import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const MediaCover = () => {
  const location = useLocation();
  const [coverData, setCoverData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const title = params.get('title');
    const mediaType = params.get('media');

    const fetchCoverData = async () => {
      try {
        const response = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&type=${mediaType}&apikey=${process.env.REACT_APP_OMDB_API_KEY}&plot=full`);
        setCoverData(response.data);
      } catch (error) {
        console.error('Error fetching media cover:', error);
      }
    };

    fetchCoverData();
  }, [location.search]);

  if (!coverData) {
    return <p>Loading cover...</p>;
  }

  return (
    <div id="cover">
      <img src={coverData.Poster} alt="Media Poster" className="movie-poster" />
      <h2>{coverData.Title} ({coverData.Year})</h2>
      <div className="movie-details">
        <p><strong>Director:</strong> {coverData.Director}</p>
        <p><strong>Actors:</strong> {coverData.Actors}</p>
        <p><strong>IMDb Rating:</strong> {coverData.imdbRating}</p>
      </div>
    </div>
  );
};

export default MediaCover;