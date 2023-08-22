'use client';

import { Scopes, SearchResults, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { useEffect, useState } from 'react';

function Home() {
  console.log(process.env.SPOTIFY_CLIENT_ID); // Logs correct client ID
  const spotifyApi = SpotifyApi.withUserAuthorization(
    process.env.SPOTIFY_CLIENT_ID || "",
    process.env.SPOTIFY_REDIRECT_URI || "",
    Scopes.userDetails
  );
  
  // If SDK exists display SpotifySearch otherwise empty
  return spotifyApi ? (<SpotifySearch sdk={spotifyApi} />) : (<></>);
}

function SpotifySearch({ sdk }: { sdk: SpotifyApi}) {
  const [results, setResults] = useState<SearchResults>({} as SearchResults);

  console.log("Begin search"); // Logs

  useEffect(() => {
    console.log("In useEffect"); // Does not log
    (async () => {
      console.log("In async"); // Does not log
      const results = await sdk.search("The Beatles", ["artist"]);
      setResults(() => results);      
    })();
  }, [sdk]);

  console.log("Finish search"); // Logs

  // Generate a table for the results
  const tableRows = results.artists?.items.map((artist) => {
    return (
      <tr key={artist.id}>
        <td>{artist.name}</td>
        <td>{artist.popularity}</td>
        <td>{artist.followers.total}</td>
      </tr>
    );
  });

  return (
    <>
      <h1>Spotify Search for The Beatles</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Popularity</th>
            <th>Followers</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </>
  )
}

export default Home;
