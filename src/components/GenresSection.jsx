import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import MediaSection from './MediaSection';

const App = () => {
    const [state, setState] = useState({
        genreSelected: false,
        output: "",
        cover: "",
        filters: [],
        loading: false,
        cache: {},
        showGenres: true,
        mediaType: null,
        errorMessage: ""
    });

    const { genreSelected, output, cover, filters, loading, cache, showGenres, mediaType, errorMessage } = state;

    const genAI = useRef(new GoogleGenerativeAI(import.meta.env.VITE_GENERATIVE_AI_KEY));
    const navigate = useNavigate();
    const location = useLocation();
    const genresButtonsRef = useRef(null);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const media = query.get('media');
        setState(prevState => ({ ...prevState, mediaType: media }));
    }, [location.search]);

    useEffect(() => {
        const previousResponses = JSON.parse(localStorage.getItem("previousResponses")) || [];
        setState(prevState => ({ ...prevState, cache: previousResponses }));
    }, []);

    const generateMedia = async (media, genre) => {
        console.log("Media Type:", media);
        const model = genAI.current.getGenerativeModel({ model: "gemini-pro" });
        const prompt = media === "movie"
            ? `Give one title of a full-length ${genre} movie without any numbers or symbols.`
            : `Name one title of a TV ${genre} series without any numbers or symbols.`;

        if (media !== "movie" && media !== "series") {
            console.error("Unknown media type.");
            return;
        }

        setState(prevState => ({ ...prevState, loading: true, errorMessage: "" }));
        let text = null;
        let response = null;
        const maxRetries = 3;
        let retries = 0;

        try {
            do {
                const result = await model.generateContent(prompt);
                response = await result.response;
                text = await response.text();
            } while (isResponseRepeated(text) && retries < maxRetries);

            if (retries === maxRetries) {
                console.error("Max retries reached. Could not generate unique content.");
                setState(prevState => ({ ...prevState, loading: false, errorMessage: "Max retries reached. Could not generate unique content." }));
                return;
            }

            saveResponse(text);

            await generateMediaCover(text, media);
        } catch (error) {
            if (error.message.includes('429')) {
                console.error("API rate limit exceeded. Please try again later.");
                setState(prevState => ({ ...prevState, errorMessage: "API rate limit exceeded. Please try again later." }));
            } else {
                console.error("Error generating media:", error);
                setState(prevState => ({ ...prevState, errorMessage: "Error generating media. Please try again." }));
            }
        } finally {
            setState(prevState => ({ ...prevState, loading: false }));
        }
    };

    const generateMediaCover = async (mediaTitle, mediaType) => {
        const omdbApiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(mediaTitle)}&type=${mediaType}&apikey=${import.meta.env.VITE_OMDB_API_KEY}&plot=full`;

        try {
            const response = await fetch(omdbApiUrl);
            const data = await response.json();

            if (data.Response === "True") {
                let coverContent;

                if (mediaType === "movie") {
                    const { Year, Actors, Director, Poster, imdbRating } = data;

                    coverContent = (
                        <>
                            <img src={Poster} alt="Media Poster" className="movie-poster" />
                            <h2 className="movie-title">{`${mediaTitle} (${Year})`}</h2>
                            <div className="movie-details">
                                <p><strong>Director:</strong> {Director}</p>
                                <p><strong>Actors:</strong> {Actors}</p>
                                <p><strong>IMDb Rating:</strong> {imdbRating}</p>
                            </div>
                        </>
                    );
                } else if (mediaType === "series") {
                    const { Year, Actors, totalSeasons, Poster, imdbRating } = data;

                    coverContent = (
                        <>
                            <img src={Poster} alt="Series Poster" className="series-poster" />
                            <h2 className="series-title">{`${mediaTitle} (${Year})`}</h2>
                            <div className="series-details">
                                <p><strong>Number of Seasons:</strong> {totalSeasons}</p>
                                <p><strong>Actors:</strong> {Actors}</p>
                                <p><strong>IMDb Rating:</strong> {imdbRating}</p>
                            </div>
                        </>
                    );
                }

                setState(prevState => ({ ...prevState, cover: coverContent, showGenres: false, loading: false, genreSelected: true }));
            } else {
                console.error("Media not found.");
                setState(prevState => ({ ...prevState, errorMessage: "Media not found." }));
            }
        } catch (error) {
            console.error("Error fetching media information:", error);
            setState(prevState => ({ ...prevState, errorMessage: "Error fetching media information. Please try again." }));
        }
    };

    const fetchWithCache = async (url) => {
        if (cache[url]) {
            return cache[url];
        }

        const response = await fetch(url);
        const data = await response.json();
        setState(prevState => ({ ...prevState, cache: { ...prevState.cache, [url]: data } }));
        return data;
    };

    const addFilter = (filter) => {
        setState(prevState => ({ ...prevState, filters: [...prevState.filters, filter] }));
    };

    const isResponseRepeated = (text) => {
        const previousResponses = JSON.parse(localStorage.getItem("previousResponses")) || [];
        return previousResponses.includes(text);
    };

    const saveResponse = async (text) => {
        const previousResponses = JSON.parse(localStorage.getItem("previousResponses")) || [];
        previousResponses.push(text);
        await localStorage.setItem("previousResponses", JSON.stringify(previousResponses));
    };

    const handleGenreButtonClick = async (genre, media) => {
        addFilter(genre);
        setState(prevState => ({ ...prevState, showGenres: false, loading: true }));

        try {
            await generateMedia(media, genre);
            setState(prevState => ({ ...prevState, genreSelected: `${genre} ${media}` }));
            setTimeout(() => {
                setState(prevState => ({ ...prevState, output: `Displaying ${genre} ${media}`, loading: false }));
            }, 1000);
        } catch (error) {
            console.error("Error handling genre button click:", error);
            setState(prevState => ({ ...prevState, loading: false }));
        }
    };

    const redraw = () => {
        setState(prevState => ({ ...prevState, showGenres: true, output: "", cover: "", genreSelected: false, errorMessage: "" }));
        navigate('/media');
    };

    const handlePrevClick = () => {
        const genresButtons = genresButtonsRef.current;
        const scrollDistance = calculateScrollDistance();
        genresButtons.scrollLeft -= scrollDistance;
    };

    const handleNextClick = () => {
        const genresButtons = genresButtonsRef.current;
        const scrollDistance = calculateScrollDistance();
        genresButtons.scrollLeft += scrollDistance;
    };

    const calculateScrollDistance = () => {
        const screenWidth = window.innerWidth;
        let scrollDistance;

        if (screenWidth < 480) {
            scrollDistance = 295;
        } else if (screenWidth >= 480 && screenWidth < 1200) {
            scrollDistance = 655;
        } else {
            scrollDistance = 1020;
        }

        return scrollDistance;
    };

    return (
        <div className='homepage-hero'>
            {loading ? (
                <div className='loading-text'>Loading...</div>
            ) : (
                <>
                    {!mediaType && <MediaSection />}
                    {mediaType && showGenres && (
                        <div id="genresSlider" className="genres-slider-container genres-container">
                            <button id="prevBtn" className="btn-slider-nav" onClick={handlePrevClick}>‹</button>
                            <div className="genres-buttons" ref={genresButtonsRef}>
                                {['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Musical', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'].map(genre => (
                                    <button key={genre} className="genreButton btn-genre" onClick={() => handleGenreButtonClick(genre, mediaType)}>
                                        <img src={`../src/assets/img/${genre.toLowerCase()}.png`} alt={genre} />
                                        <span>{genre} {mediaType === 'movie' ? '' : 'Series'}</span>
                                    </button>
                                ))}
                            </div>
                            <button id="nextBtn" className="btn-slider-nav" onClick={handleNextClick}>›</button>
                        </div>
                    )}
                    {genreSelected && <button id="redrawButton" className='btn-redraw' onClick={redraw}>Redraw</button>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div id="cover" className='cover'>{cover}</div>
                </>
            )}
        </div>
    );
};

export default App;
