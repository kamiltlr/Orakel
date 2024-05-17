Project Description
The aim of this project is to create a web application that allows users to generate titles and covers for movies or TV shows based on a selected genre. It utilizes Google Generative AI services for generating titles and the OMDB API for retrieving media information and covers. The application aims to simplify the process of searching for and presenting movies or TV shows, which can be useful for cinema enthusiasts and those seeking inspiration for viewing.

Installation and Configuration Instructions:

Prerequisites:
Node.js (v14 or higher)
npm (v6 or higher)

Installation Steps:

Clone the repository:
bash
git clone https://github.com/kamiltlr/Orakel.git

Install dependencies:
bash
Skopiuj kod
npm install

Configure environment variables:

Create a .env file in the project's main directory and add the following lines, replacing YOUR_GOOGLE_GENERATIVE_AI_KEY and YOUR_OMDB_API_KEY with your respective API keys:

Make file:
.env
VITE_GENERATIVE_AI_KEY=YOUR_GOOGLE_GENERATIVE_AI_KEY
VITE_OMDB_API_KEY=YOUR_OMDB_API_KEY

Running the Project:

Run in development mode:
bash
npm run dev
The application should be accessible at http://localhost:3000.

Build the application for production:
bash
npm run build
The output files will be available in the dist folder.

Running in a production environment:

Install a static server, such as serve:
bash
npm install -g serve

Run the application:
bash
serve -s dist

User Guide:

Media Selection:
Upon launching the application, choose whether you want to generate a title for a movie or a TV show by clicking the respective button on the homepage.

Genre Selection:
After selecting one of the media types, a list of genres will appear. Click on one of the genres to start generating a title and cover.

Generating Title and Cover:
The application will begin generating a title and retrieving information and cover from the OMDB API. This process may take a moment.

Viewing Results:
After the loading is complete, you will see the generated title along with the cover and additional information (e.g., director, actors, IMDb rating).

Resetting Selection:
If you want to generate a new title, click the "Redraw" button to return to the genre selection and start the process again.

Additional Notes:
The application can only be used in countries that support the Gemini API. Full list here: https://ai.google.dev/gemini-api/docs/available-regions#available_regions

Cache: The application uses cache to speed up repeated API requests. You can clear the cache by refreshing the page.

Responsiveness: The application is optimized to work on various devices, including computers, tablets, and smartphones.