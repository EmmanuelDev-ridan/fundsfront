import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CampaignCard({ id, title, description, image, goal, raised, daysLeft }) {
  const progress = Math.min(Math.round((raised / goal) * 100), 100);
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <div className="h-48 overflow-hidden">
        <motion.img 
          className="w-full h-full object-cover"
          src={image} 
          alt={title}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
        
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-100">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-orange-600">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-100">
              <motion.div 
                style={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-600"
              ></motion.div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">₦{raised.toLocaleString()}</p>
            <p className="text-xs text-gray-500">raised of ₦{goal.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{daysLeft}</p>
            <p className="text-xs text-gray-500">days left</p>
          </div>
        </div>
        
        <div className="mt-4">
          <Link
            to={`/campaign/${id}`}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
          >
            <motion.span
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              View Campaign
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
