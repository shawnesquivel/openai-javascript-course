export default function handler(req, res) {
  // We want to read key: "Some Message", lastName
  console.log("im in the api route");
  const { lastName, key } = req.body;

  console.log(lastName);
  console.log(key);

  if (lastName === "Zuckerberg") {
    console.log("Meta is awesome");
  }

  res.status(200).json({ result: `Your last name ${lastName} is awesome` });
}
