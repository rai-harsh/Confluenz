import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function AboutUs() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    // Fetch team data from the backend
    axios
      .get("/api/get/core")
      .then((response) => setTeam(response.data))
      .catch((error) => console.error("Error fetching team data:", error));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h1 className="text-7xl mb-10 tracking-widest font-bold text-gray-800">About Us</h1>
        <p className="mt-4 text-lg text-gray-600">
        Welcome to Confluenz, a collective of passionate photographers and storytellers with a shared vision of capturing the world’s beauty, one frame at a time. Our society, made up of nearly 50 talented members, has proudly documented countless events, from vibrant festivals to intimate gatherings, showcasing moments that resonate with authenticity and artistry.
        </p>
      </motion.div>

      {/* Vision & Mission */}
      <div className="mt-12 space-y-8 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">Our Vision</h2>
          <p className="text-gray-600">
          We believe photography is more than a profession – it’s an art form that freezes fleeting moments, allowing them to live on forever. Our vision is to inspire, innovate, and connect people through powerful visuals that speak volumes. By partnering with clients who share our appreciation for the art of photography, we aim to create lasting relationships, delivering images that aren’t just pictures, but memories that captivate and move.
          </p>
        </motion.div>
      </div>

      {/* Meet the Team Section */}
      <div className="mt-12 max-w-5xl mx-auto text-center ">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Meet the Team</h2>
        <div className="grid  grid-cols-2 [@media(max-width:500px)]:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative bg-white shadow-lg rounded-xl overflow-hidden transition-transform transform hover:scale-105 duration-300"
            >
              <div className="relative">
                <img
                  src={`http://localhost:4000${member.profile_pic}`}
                  alt={member.member_name}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 opacity-60"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                  {member.member_name}
                </h3>
              </div>
              <div className="p-6 space-y-3 text-left">
                <p className="text-gray-500 font-semibold">{member.position}</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {member.description}
                </p>
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Instagram Profile
                  </a>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-12 max-w-5xl mx-auto text-center ">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">Our Story</h2>
          <p className="text-gray-600">
          Confluenz was born out of a shared love for photography, storytelling, and community. Our members bring together a diverse range of skills, from street photography to event coverage, portraiture, Graphics and creative editing. Every photographer in our society brings their unique perspective, and together, we create a cohesive team that values collaboration, creativity, and excellence.
          </p>
        </motion.div>
      </div>
      {/* Join Us */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-12 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800">Join Us</h2>
        <p className="mt-2 text-gray-600">
          Become a part of our growing community. Click below to get started!
        </p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Join Us
        </button>
      </motion.div> */}
    </div>
  );
}
