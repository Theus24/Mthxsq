import React, { useState, useEffect } from 'react';
import { FiX, FiExternalLink } from 'react-icons/fi'; // Install react-icons jika belum: npm install react-icons

const ProjectModal = ({ isOpen, onClose, project }) => {
  // State untuk mengontrol animasi penutupan
  const [isClosing, setIsClosing] = useState(false);

  // Fungsi untuk menangani penutupan dengan animasi
  const handleClose = () => {
    setIsClosing(true);
    // Tunggu animasi selesai (300ms) sebelum memanggil onClose dari props
    setTimeout(() => {
      onClose();
      setIsClosing(false); // Reset state untuk pembukaan berikutnya
    }, 300);
  };

  // Mencegah scroll di background saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    // Overlay
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
    >
      {/* Modal Content */}
      <div
  onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam
  className={`bg-zinc-900 border border-blue-500/50 rounded-2xl shadow-2xl shadow-blue-500/20 w-full max-w-lg transform transition-transform duration-300 ${isClosing ? 'animate-out' : 'animate-in'}`}
      >
        {/* --- GAMBAR PROYEK --- */}
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-56 object-cover rounded-t-2xl"
        />

        <div className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-white">{project.title}</h2>
                <button
                    onClick={handleClose}
                    className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-700 -mt-2 -mr-2"
                >
                    <FiX size={24} />
                </button>
            </div>

            {/* --- DESKRIPSI LENGKAP --- */}
            <p className="text-zinc-300 text-base leading-relaxed">
                {project.fullDescription}
            </p>

        {project.showButton && (
          <a
            href={project.image && project.image.includes('reparo') ? undefined : project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-4 inline-flex items-center justify-center gap-2 font-semibold p-3 px-5 rounded-full w-full border border-transparent transition-colors
              ${project.image && project.image.includes('reparo') ? 'bg-gray-500 text-white cursor-not-allowed pointer-events-none' : 'bg-blue-600 hover:bg-blue-700'}`}
            style={project.image && project.image.includes('reparo') ? { opacity: 0.7 } : {}}
          >
            <FiExternalLink />
            <span>Acesse aqui</span>
          </a>
        )}
        </div>
      </div>
       {/* CSS untuk animasi */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        @keyframes scaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
        .animate-out {
          animation: scaleOut 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default ProjectModal;
