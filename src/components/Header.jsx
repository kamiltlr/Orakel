import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrakelHeader = () => {
  const location = useLocation();
  const isMediaSection = location.pathname === '/media';

  const [answer, setAnswer] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Selected answer:", answer);
    setFormSubmitted(true);
  };

  return (
    <div className="hero">
      <h1 id="orakelHeader" className="orakelHeader">
        <Link to="/media" className="orakelLink">
          Orakel
        </Link>
      </h1>
      {!isMediaSection && !formSubmitted && (
        <div className='formHome'>
          <form onSubmit={handleSubmit}>
            <p>Are series better than movies?</p>
            <label>
              <input
                type="radio"
                name="answer"
                value="Yes"
                checked={answer === 'Yes'}
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="answer"
                value="No"
                checked={answer === 'No'}
                onChange={handleChange}
              />
              No
            </label>
            <button type="submit" className='form-button'>Submit</button>
          </form>
        </div>
      )}
      {formSubmitted && (
        <p>Thank you for your reply!</p>
      )}
    </div>
  );
};

export default OrakelHeader;
