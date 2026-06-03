import { useState, useEffect } from 'react';
import './App.css';
import { GetJadwal, TambahJadwal, ToggleSelesai, HapusJadwal } from "../wailsjs/go/main/App";

function App() {
    // State untuk Navigasi Halaman
    const [activeTab, setActiveTab] = useState('beranda');
    
    // State untuk CRUD
    const [listServis, setListServis] = useState([]);
    const [motor, setMotor] = useState("");
    const [catatan, setCatatan] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const data = await GetJadwal();
        setListServis(data);
        setTimeout(() => setIsLoaded(true), 100);
    };

    // --- FUNGSI CRUD ---
    const handleTambah = async () => {
        if (!motor.trim() || !catatan.trim()) {
            alert("Nama motor dan catatan tidak boleh kosong!");
            return;
        }
        const dataTerbaru = await TambahJadwal(motor, catatan);
        setListServis(dataTerbaru);
        setMotor(""); 
        setCatatan("");
    };

    const handleToggle = async (id) => {
        const dataTerbaru = await ToggleSelesai(id);
        setListServis(dataTerbaru);
    };

    const handleHapus = async (id) => {
        if (window.confirm("Yakin ingin menghapus jadwal ini?")) {
            const dataTerbaru = await HapusJadwal(id);
            setListServis(dataTerbaru);
        }
    };

    // --- KOMPONEN HALAMAN ---
    const renderContent = () => {
        switch(activeTab) {
            case 'beranda':
                return (
                    <div className="page-content fadeIn">
                        <header className="page-header">
                            <h2>👋 Selamat Datang, Andy!</h2>
                            <p className="subtitle">Pantau terus kondisi motormu agar selalu prima dan siap diajak jalan.</p>
                        </header>
                        
                        <div className="glass-panel summary-card">
                            <h3>Total Antrean Servis</h3>
                            <div className="big-number">{listServis.filter(item => !item.selesai).length}</div>
                            <p>Tugas servis yang belum selesai</p>
                            <button className="btn-tambah mt-4" onClick={() => setActiveTab('servis')}>
                                Lihat Jadwal Sekarang
                            </button>
                        </div>
                    </div>
                );

            case 'servis':
                return (
                    <div className="page-content fadeIn">
                        <header className="page-header">
                            <h2>📝 Manajemen Data Servis</h2>
                            <p className="subtitle">Tambah, perbarui, atau hapus riwayat perawatan.</p>
                        </header>

                        <div className="glass-panel form-group">
                            <input 
                                type="text"
                                value={motor} 
                                onChange={(e) => setMotor(e.target.value)} 
                                placeholder="Merek Motor (Cth: Honda ADV 160)" 
                            />
                            <input 
                                type="text"
                                value={catatan} 
                                onChange={(e) => setCatatan(e.target.value)} 
                                placeholder="Catatan (Cth: Ganti oli 0.75L)" 
                            />
                            <button onClick={handleTambah} className="btn-tambah">
                                <span className="icon">+</span> Tambah
                            </button>
                        </div>

                        <div className="list-container">
                            {listServis.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📭</div>
                                    <h3>Belum ada jadwal</h3>
                                    <p>Jadwal servis motor Anda sudah beres semua!</p>
                                </div>
                            ) : (
                                listServis.map((item) => (
                                    <div key={item.id} className={`card ${item.selesai ? 'selesai' : ''}`}>
                                        <div className="info">
                                            <h3>{item.motor}</h3>
                                            <p>{item.catatan}</p>
                                        </div>
                                        <div className="aksi">
                                            <button 
                                                className={`btn-toggle ${item.selesai ? 'active' : ''}`} 
                                                onClick={() => handleToggle(item.id)}
                                            >
                                                {item.selesai ? '✔️ Selesai' : '⏳ Proses'}
                                            </button>
                                            <button 
                                                className="btn-delete" 
                                                onClick={() => handleHapus(item.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );

            case 'info':
                return (
                    <div className="page-content fadeIn">
                        <header className="page-header">
                            <h2>ℹ️ Informasi Sistem</h2>
                            <p className="subtitle">Detail tentang aplikasi Servis Tracker.</p>
                        </header>
                        <div className="glass-panel">
                            <h3>Servis Tracker v1.0.0</h3>
                            <div className="info-text">
                                <p>Aplikasi desktop ini dibangun menggunakan perpaduan teknologi performa tinggi:</p>
                                <ul>
                                    <li><strong>Golang:</strong> Menangani logika <i>backend</i> dan manajemen memori.</li>
                                    <li><strong>React & Wails:</strong> Menghasilkan antarmuka <i>frontend</i> yang modern dan responsif.</li>
                                </ul>
                                <p>Sistem ini dirancang khusus untuk memastikan manajemen perawatan kendaraan berjalan lebih rapi tanpa menghabiskan banyak sumber daya RAM di komputermu.</p>
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <div className={`app-layout ${isLoaded ? 'loaded' : ''}`}>
            {/* SIDEBAR NAVIGATION */}
            <aside className="sidebar">
                <div className="brand">
                    <span className="brand-icon">🛠️</span>
                    <h2>Tracker</h2>
                </div>
                
                <nav className="nav-menu">
                    <button 
                        className={`nav-btn ${activeTab === 'beranda' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('beranda')}
                    >
                        🏠 Beranda
                    </button>
                    <button 
                        className={`nav-btn ${activeTab === 'servis' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('servis')}
                    >
                        📝 Data Servis
                    </button>
                    <button 
                        className={`nav-btn ${activeTab === 'info' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('info')}
                    >
                        ℹ️ Informasi
                    </button>
                </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
}

export default App;