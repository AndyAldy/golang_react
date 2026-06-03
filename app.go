package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	// Driver MySQL
	_ "github.com/go-sql-driver/mysql"
)

type JadwalServis struct {
	ID      int    `json:"id"`
	Motor   string `json:"motor"`
	Catatan string `json:"catatan"`
	Selesai string `json:"selesai"`
}

type App struct {
	ctx context.Context
	db  *sql.DB // Menampung koneksi database
}

func NewApp() *App {
	return &App{}
}

// Dijalankan pertama kali saat aplikasi dibuka
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Koneksi ke MySQL XAMPP (user: root, password: [kosong], db: db_bengkel)
	db, err := sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/db_bengkel")
	if err != nil {
		log.Fatal("Gagal membuka koneksi database:", err)
	}

	// Ping database untuk memastikan XAMPP MySQL benar-benar menyala
	if err = db.Ping(); err != nil {
		log.Fatal("Database tidak merespons. Pastikan MySQL di XAMPP sudah Start! Error:", err)
	}

	a.db = db
	fmt.Println("✅ Berhasil terhubung ke database MySQL XAMPP!")
}

// --- FITUR CRUD DATABASE ---

// [READ]: Mengambil data dari tabel MySQL
func (a *App) GetJadwal() []JadwalServis {
	// Mengambil data dan diurutkan dari yang terbaru (ID terbesar)
	rows, err := a.db.Query("SELECT id, motor, catatan, selesai FROM jadwal_servis ORDER BY id DESC")
	if err != nil {
		log.Println("Error GetJadwal:", err)
		return []JadwalServis{} // Kembalikan array kosong jika error
	}
	defer rows.Close()

	var hasil []JadwalServis
	for rows.Next() {
		var j JadwalServis
		// Memasukkan hasil SQL ke dalam struct
		err := rows.Scan(&j.ID, &j.Motor, &j.Catatan, &j.Selesai)
		if err != nil {
			log.Println("Error Scan:", err)
			continue
		}
		hasil = append(hasil, j)
	}

	// Jika tabel kosong, pastikan kembalikan array kosong agar React tidak error
	if hasil == nil {
		return []JadwalServis{}
	}
	return hasil
}

// [CREATE]: Menambah data ke tabel MySQL
func (a *App) TambahJadwal(motor string, catatan string, selesai string) []JadwalServis {
	_, err := a.db.Exec("INSERT INTO jadwal_servis (motor, catatan, selesai) VALUES (?, ?, ?)", motor, catatan, selesai)
	if err != nil {
		log.Println("Error TambahJadwal:", err)
	}
	// Mengembalikan seluruh data terbaru untuk dirender ulang oleh React
	return a.GetJadwal()
}

// [UPDATE]: Membalikkan status selesai di MySQL (True ke False, False ke True)
func (a *App) ToggleSelesai(id int) []JadwalServis {
	_, err := a.db.Exec("UPDATE jadwal_servis SET selesai = NOT selesai WHERE id = ?", id)
	if err != nil {
		log.Println("Error ToggleSelesai:", err)
	}
	return a.GetJadwal()
}

// [DELETE]: Menghapus data dari MySQL
func (a *App) HapusJadwal(id int) []JadwalServis {
	_, err := a.db.Exec("DELETE FROM jadwal_servis WHERE id = ?", id)
	if err != nil {
		log.Println("Error HapusJadwal:", err)
	}
	return a.GetJadwal()
}
