import React from 'react';
import { Link } from 'react-router-dom';

const MediaSection = () => {
  return (
    <div id="mediaButtons" className='homepage-hero'>
      <Link to="/genres?media=movie" id="movieButton" className='btn-media'>Movies</Link>
      <Link to="/genres?media=series" id="seriesButton" className='btn-media'>Series</Link>
    </div>
  );
};

export default MediaSection;
