// import React, { useState } from "react";

// function CourseAggregator() {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     if (!query.trim()) return;
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `http://localhost:4000/api/search?q=${encodeURIComponent(query)}`
//       );
//       const data = await response.json();
//       setResults(data.results || []);
//     } catch (error) {
//       console.error("Error fetching:", error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-6xl mx-auto mt-6">
//       {/* Search Bar */}
//       <div className="flex items-center bg-white rounded-full shadow-md p-2">
//         <input
//           type="text"
//           placeholder="Search for courses..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="flex-1 px-4 py-2 rounded-full outline-none"
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
//         >
//           Search
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && <p className="mt-4 text-gray-500">Loading...</p>}

//       {/* Results */}
//       <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {results.map((item, idx) => (
//           <div key={idx} className="relative">
//             {idx < 3 && (
//               <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded z-10">
//                 Recommended
//               </span>
//             )}
//             <a
//               href={item.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-white rounded-2xl shadow hover:shadow-lg transition block"
//             >
//               <img
//                 src={item.thumbnail}
//                 alt={item.title}
//                 className="w-full h-40 object-cover rounded-t-2xl"
//               />
//               <div className="p-3">
//                 <h3 className="text-sm font-semibold line-clamp-2">
//                   {item.title}
//                 </h3>
//                 <p className="text-xs text-gray-500 mt-1">{item.channel}</p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   👍 {item.likes.toLocaleString()} | 👁️ {item.views.toLocaleString()}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   Score: {(item.engagementScore * 1000).toFixed(2)}
//                 </p>
//               </div>
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CourseAggregator;
// import React, { useState } from "react";

// const CourseAggregator = () => {
//   const [query, setQuery] = useState("");
//   const [videos, setVideos] = useState([]);
//   const [playlists, setPlaylists] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searched, setSearched] = useState(false);
//   const [filter, setFilter] = useState("all"); // ✅ "all" | "videos" | "playlists"

//   const handleSearch = async () => {
//     if (!query.trim()) return;
//     setLoading(true);
//     setSearched(true);
//     try {
//       const res = await fetch(
//         `http://localhost:4000/api/courses?query=${query}`
//       );
//       const data = await res.json();

//       setVideos(data.videos || []);
//       setPlaylists(data.playlists || []);
//     } catch (err) {
//       console.error("Error fetching:", err);
//       setVideos([]);
//       setPlaylists([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Decide what to show based on filter
//   const filteredCourses =
//     filter === "all"
//       ? [...videos, ...playlists]
//       : filter === "videos"
//       ? videos
//       : playlists;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Search Bar */}
//       <div className="flex justify-center mb-6 space-x-2">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search for a course..."
//           className="w-2/3 md:w-1/2 p-3 rounded-l-full border border-gray-300 focus:outline-none"
//         />
//         <button
//           onClick={handleSearch}
//           className="bg-blue-500 text-white px-6 rounded-r-full hover:bg-blue-600"
//         >
//           Search
//         </button>
//       </div>

//       {/* Filter Dropdown */}
//       <div className="flex justify-center mb-6">
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="p-2 rounded border border-gray-300"
//         >
//           <option value="all">All</option>
//           <option value="videos">Videos</option>
//           <option value="playlists">Playlists</option>
//         </select>
//       </div>

//       {/* Loading State */}
//       {loading && <p className="text-center text-lg">Loading courses...</p>}

//       {/* No Courses Found */}
//       {!loading && searched && filteredCourses.length === 0 && (
//         <p className="text-center text-lg text-gray-500">No courses found</p>
//       )}

//       {/* Courses Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredCourses.map((course, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
//           >
//             <img
//               src={course.thumbnail}
//               alt={course.title}
//               className="rounded-lg w-full h-48 object-cover"
//             />
//             <h3 className="text-lg font-semibold mt-2">{course.title}</h3>
//             <p className="text-gray-600 text-sm">{course.channel}</p>
//             <a
//               href={course.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 mt-2 inline-block"
//             >
//               Watch →
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CourseAggregator;
import React, { useState } from "react";
import { motion } from "framer-motion";

const languageMap = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  kn: "Kannada",
  // add more as needed
};
const CourseAggregator = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `http://localhost:4000/api/courses?query=${query}`
      );
      const data = await res.json();
      setVideos(data.videos || []);
      setPlaylists(data.playlists || []);
    } catch (err) {
      console.error(err);
      setVideos([]);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-grey-100 p-6">
    {/* // <div className="min-h-screen bg-gradient-to-r from-black-300 via-grey to-white-300 p-6"> */}

      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
        CoDeadUs
      </h1>

      <form onSubmit={handleSubmit} className="flex justify-center mb-6 space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a course..."
          className="w-2/3 md:w-1/2 p-3 rounded-l-full border border-gray-300 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 rounded-r-full hover:bg-blue-600"
        >
          Search
        </button>
      </form>
      

      {/* Loading */}
      {loading && (
        <p className="text-center text-lg font-semibold text-gray-700">
          Loading courses...
        </p>
      )}

      {/* No Courses */}
      {!loading && searched && videos.length === 0 && playlists.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-500 text-xl font-semibold"
        >
          😢 No courses found
        </motion.div>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎥 Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((course, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="rounded-lg w-full h-48 object-cover"
                />
                <h3 className="text-lg font-semibold mt-2">{course.title}</h3>
                <p className="text-gray-600 text-sm">{course.channel}</p>

                <p className="text-sm text-gray-700">
                  Views: {course.views.toLocaleString()}
                </p>
                <p className="text-sm text-gray-700">
                  Likes: {course.likes.toLocaleString()}
                </p>
                
                {/* New Language Display */}
                <p className="text-sm text-gray-700 font-medium">
                  Language: {languageMap[course.language] || "Unknown"}
                </p>

                <p className="text-green-600 font-semibold">
                  Score: {course.score.toFixed(3)*100}
                </p>

                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 mt-2 inline-block"
                >
                  Watch →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Playlists Section */}
      {playlists.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📂 Course Playlists
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
              >
                <img
                  src={playlist.thumbnail}
                  alt={playlist.title}
                  className="rounded-lg w-full h-48 object-cover"
                />
                <h3 className="text-lg font-semibold mt-2">
                  {playlist.title}
                </h3>
                <p className="text-gray-600 text-sm">{playlist.channel}</p>
                <a
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 mt-2 inline-block"
                >
                  View Playlist →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseAggregator;


