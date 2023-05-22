// import { useState } from "react";

// export default function HomeClient() {
//   // Define query parameters as an object
//   const queryParams = {
//     videoId: "O_9JoimRj8w",
//   };

//   // Use URLSearchParams to create a query string
//   const queryString = new URLSearchParams(queryParams).toString();

//   // Append the query string to the URL
//   const url = `api/generate?${queryString}`;

//   // Declare a state variable to store fetched data
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   const handleClick = async () => {
//     try {
//       const res = await fetch(url);
//       if (!res.ok) {
//         console.error("Error fetching data:", res.statusText);
//         setError(res.statusText);
//       } else {
//         const responseData = await res.json();
//         console.log(responseData);
//         setData(responseData);
//         setError(null);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(error.message);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleClick}>Fetch Data</button>
//       {data && (
//         <div>
//           <h1>{data.id}</h1>
//         </div>
//       )}
//       {error && <div>Error fetching data: {error}</div>}
//     </div>
//   );
// }
