import { YoutubeTranscript } from "youtube-transcript";

export default async function handler(videoId) {
  try {
    const transcriptResponse = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcriptResponse) throw new Error("Failed to get transcript");
    console.log(transcriptResponse);
    return transcriptResponse;
  } catch (err) {
    console.error(err);
    return;
  }
}
