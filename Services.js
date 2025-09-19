import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBrain, FaUsers, FaBook, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db, collection, getDocs } from "../firebase";

const iconMap = {
  FaBrain: FaBrain,
  FaUsers: FaUsers,
  FaBook: FaBook,
  FaPhone: FaPhone,
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      console.log("Attempting to fetch services from Firestore...");
      try {
        const servicesCollectionRef = collection(db, "Services");
        const querySnapshot = await getDocs(servicesCollectionRef);
        
        const servicesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setServices(servicesData);
        console.log("Services fetched successfully:", servicesData);
      } catch (error) {
        console.error("Error fetching services: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading services...</div>
      </div>
    );
  }

  if (services.length === 0) {
    console.log("No services found. Displaying message.");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4">No Services Found</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please add services to the Firestore 'services' collection.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-10 text-blue-600"
        >
          Our Services
        </motion.h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => {
            const IconComponent = iconMap[s.iconName];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.03 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-6 shadow-md bg-white dark:bg-gray-800"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl text-white mb-4 ${s.color} shadow`}
                >
                  {IconComponent && <IconComponent size={28} />}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {s.description}
                </p>
                <div className="mt-4">
                  <Link to={`/coming-soon`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    Learn more →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xl font-bold">
                Need a tailored plan for your campus?
              </div>
              <div className="text-sm opacity-90 mt-1">
                We can partner with your college/university to build student
                mental health programs.
              </div>
            </div>
            <div>
              <a
                href="/contact"
                className="px-6 py-3 rounded-md bg-white text-blue-600 font-semibold"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}