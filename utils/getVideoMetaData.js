import axios from "axios";

export default async function getVideoMetaData(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.GOOGLE_API_KEY}&part=snippet,contentDetails,statistics,status`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    const metadata = data.items[0];
    const videoTitle = metadata.snippet.title;
    const videoDescription = metadata.snippet.description;
    const shortenedDescription = videoDescription.split(".")[0];

    const videoId = metadata.id;
    const shortMetadata = {
      videoTitle,
      videoDescription: shortenedDescription,
      videoId,
    };
    return shortMetadata; // returns the first item, which should be the video if the id is valid
  } catch (error) {
    console.error(`Failed to fetch video metadata: ${error}`);
  }
}
