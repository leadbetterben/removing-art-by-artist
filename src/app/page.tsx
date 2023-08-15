import { Scopes, SpotifyApi } from '@spotify/web-api-ts-sdk';
import styles from './page.module.css'

export default async function Home() {
  console.log("Searching Spotify for The Beatles...");

  const api = SpotifyApi.withUserAuthorization(
    process.env.SPOTIFY_CLIENT_ID || "",
    process.env.REDIRECT_TARGET || "",
    Scopes.userDetails
  )

  //   const items = await api.search("The Beatles", ["artist"]);

  //   console.table(items.artists.items.map((item) => ({
  //       name: item.name,
  //       followers: item.followers.total,
  //       popularity: item.popularity,
  //   })));
  // })();

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.tsx</code>
        </p>
      </div>
    </main>
  )
}
