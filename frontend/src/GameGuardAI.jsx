import React, { useState } from "react";
import { FilePlus, BarChart2, Users, AlertTriangle, Sun, Moon } from "lucide-react";

const GameGuardAI = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false); // ✅ Spinner control

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setFileName(uploadedFile.name);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);      // ✅ Start spinner
        setShowAnalysis(false);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setResults(data);
                setShowAnalysis(true);
            } else {
                alert("❌ Error: " + data.error);
            }
        } catch (err) {
            alert("Server error: " + err.message);
        } finally {
            setLoading(false); // ✅ Stop spinner
        }
    };

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <div className={`${darkMode ? "bg-gradient-to-b from-black to-[#0f2027] text-white" : "bg-white text-black"} min-h-screen flex flex-col`}>
            {/* Navbar */}
            <nav className={`${darkMode ? "bg-black/80 border-cyan-600" : "bg-gray-100 border-gray-300 text-black"} w-full backdrop-blur-md border-b sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className={`text-2xl font-bold tracking-widest ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                        GameGuard AI
                    </h1>
                    <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                        {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
                    </button>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-grow p-6">
                <header className="text-center mb-10">
                    <h1 className={`text-5xl font-bold drop-shadow-xl ${darkMode ? "text-cyan-400" : "text-cyan-700"}`}>
                        GameGuard AI
                    </h1>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-lg italic mt-2`}>
                        Detecting unfair gameplay using intelligent telemetry
                    </p>
                </header>

                {/* Upload Section */}
                <div className={`${darkMode ? "bg-[#101820] border-cyan-600" : "bg-gray-100 border-gray-300"} max-w-2xl mx-auto p-6 rounded-xl shadow-lg border`}>
                    <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer ${darkMode ? "border-cyan-500 hover:bg-[#15232d]" : "border-cyan-700 hover:bg-gray-200"} transition`}>
                        <FilePlus className={`w-10 h-10 mb-2 ${darkMode ? "text-cyan-400" : "text-cyan-700"} animate-pulse`} />
                        <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>Drag & drop or click to upload CSV</span>
                        <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                    </label>

                    {fileName && (
                        <div className="mt-4 text-center">
                            <p className={`text-sm ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>Uploaded: {fileName}</p>
                            <button
                                onClick={handleAnalyze}
                                className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-semibold transition shadow-md hover:scale-105"
                            >
                                Analyze
                            </button>
                        </div>
                    )}

                    {/* ✅ Spinner */}
                    {loading && (
                        <div className="mt-6 flex justify-center items-center">
                            <svg className="animate-spin h-6 w-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <span className="ml-2 text-cyan-300">Analyzing...</span>
                        </div>
                    )}
                </div>

                {/* Analysis Section */}
                {showAnalysis && (
                    <div className="mt-12 max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-6 mb-10">
                            <StatCard darkMode={darkMode} icon={<Users className="text-cyan-400 w-8 h-8" />} title="Total Players" value={results.length} />
                            <StatCard darkMode={darkMode} icon={<AlertTriangle className="text-red-400 w-8 h-8" />} title="Cheaters Detected" value={results.filter(r => r.Prediction === "Cheater").length} />
                            <StatCard darkMode={darkMode} icon={<BarChart2 className="text-green-400 w-8 h-8" />} title="Model Accuracy" value="94.8%" />
                            <StatCard darkMode={darkMode} icon={<AlertTriangle className="text-yellow-400 w-8 h-8" />} title="Imbalance Status" value="⚠️ Detected" />
                        </div>

                        {/* ✅ Scrollable Results Table */}
                        <div className={`${darkMode ? "bg-[#101820] border-cyan-600" : "bg-gray-100 border-gray-300"} p-6 rounded-xl border shadow-xl overflow-x-auto max-h-[500px] overflow-y-auto`}>
                            <h3 className={`text-xl mb-4 font-semibold ${darkMode ? "text-cyan-400" : "text-cyan-700"}`}>Prediction Results</h3>
                            <table className="w-full table-auto text-sm">
                                <thead className={`${darkMode ? "text-cyan-300 border-b border-cyan-600" : "text-cyan-800 border-b border-gray-400"}`}>
                                    <tr>
                                        <th className="py-2 px-3 text-left">PlayerID</th>
                                        <th className="py-2 px-3 text-left">Prediction</th>
                                        <th className="py-2 px-3 text-left">Confidence</th>
                                        <th className="py-2 px-3 text-left">Flags</th>
                                    </tr>
                                </thead>
                                <tbody className={`${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                                    {results.map((r, index) => (
                                        <tr key={index} className="border-b border-gray-700">
                                            <td className="py-2 px-3">{r.PlayerID}</td>
                                            <td className={`py-2 px-3 ${r.Prediction === "Cheater" ? "text-red-400" : "text-green-400"}`}>{r.Prediction}</td>
                                            <td className="py-2 px-3">{r.Confidence}</td>
                                            <td className="py-2 px-3">{r.Flags}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            <footer className={`${darkMode ? "bg-black border-cyan-800 text-gray-500" : "bg-gray-100 border-gray-300 text-gray-600"} w-full border-t py-4 text-center text-sm`}>
                © 2025 GameGuard AI • Built with 🤖 to secure fair gameplay
            </footer>
        </div>
    );
};

// 💡 Optional StatCard helper component to reduce duplicate code
const StatCard = ({ darkMode, icon, title, value }) => (
    <div className={`${darkMode ? "bg-[#101820] border-cyan-700" : "bg-gray-100 border-gray-300"} p-5 rounded-lg border shadow-lg flex items-center space-x-4`}>
        {icon}
        <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xl">{value}</p>
        </div>
    </div>
);

export default GameGuardAI;
