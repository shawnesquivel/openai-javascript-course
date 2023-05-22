async function YouTubeSearch(query) {
  try {
    const url = "https://www.googleapis.com/youtube/v3/search";
    const params = {
      part: "snippet",
      q: query,
      type: "video",
      key: process.env.GOOGLE_API_KEY,
    };

    // let response = await axios.get(url, { params });
    const response = await fetch(`${url}?${new URLSearchParams(params)}`);

    if (response.ok) {
      let data = await response.json();
      // rest of your code...
      let search_results = [];
      for (let item of data.items) {
        let video_id = item.id.videoId;
        let video_title = item.snippet.title;
        search_results.push({
          title: video_title,
          url: `https://www.youtube.com/watch?v=${video_id}`,
        });
      }
      return search_results;
    } else {
      console.error(`Error: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Fetch failed: ${error}`);
  }
}
export default YouTubeSearch;
