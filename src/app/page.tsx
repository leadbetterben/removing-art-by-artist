'use client';

import { AuthorizationCodeWithPKCEStrategy, Scopes, SdkOptions, SearchResults, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { useEffect, useRef, useState } from 'react';

export default async function Home() {
  const sdk = useSpotify( // Call useSpotify function to create SDK
    process.env.SPOTIFY_CLIENT_ID || "",
    process.env.SPOTIFY_REDIRECT_URI || "",
    Scopes.userDetails
  );

  // If SDK exists display SpotifySearch otherwise empty
  return sdk ? (<SpotifySearch sdk={sdk} />) : (<></>);
}

export function useSpotify(clientId: string, redirectUrl: string, scopes: string[], config?: SdkOptions) {

  const [sdk, setSdk] = useState<SpotifyApi | null>(null);
  const { current: activeScopes } = useRef(scopes);

  console.log("useSpotify", [clientId, redirectUrl, config, activeScopes]); // This line is logged

  useEffect(() => {
    console.log("useEffect", [clientId, redirectUrl, config, activeScopes]); // This line is not logged
    (async () => {
      const auth = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUrl, activeScopes);
      const internalSdk = new SpotifyApi(auth, config);

      try {
        const { authenticated } = await internalSdk.authenticate();

        if (authenticated) {
          setSdk(() => internalSdk);
        }
      } catch (e: Error | unknown) {

        const error = e as Error;
        if (error && error.message && error.message.includes("No verifier found in cache")) {
          console.error("If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).", error);
        } else {
          console.error(e);
        }
      }
    })();
  }, [clientId, redirectUrl, config, activeScopes]);

  return sdk;
}

function SpotifySearch({ sdk }: { sdk: SpotifyApi}) {
  const [results, setResults] = useState<SearchResults>({} as SearchResults);

  useEffect(() => {
    (async () => {
      const results = await sdk.search("The Beatles", ["artist"]);
      setResults(() => results);      
    })();
  }, [sdk]);

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
