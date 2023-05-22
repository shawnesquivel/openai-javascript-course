export default async function getChat() {
  try {
    const res = await fetch("https://api.github.com/repos/vercel/next.js");
    const data = res.json();
    return data;
  } catch (err) {
    console.error(err);
    return res.json();
  }
}
