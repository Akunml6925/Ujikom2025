 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-wvBGzlYI9NHjVZBq7wbUHtEWrN3AFI8",
  authDomain: "pasarbarokah-56d6c.firebaseapp.com",
  projectId: "pasarbarokah-56d6c",
  storageBucket: "pasarbarokah-56d6c.appspot.com",
  messagingSenderId: "316348641371",
  appId: "1:316348641371:web:5ad38a561e7d73744acf7e",
  measurementId: "G-NKKFY4X1ZC"
};
// Inisialisasi Firebase
  // Ambil data tugas dari localStorage
let tugas = JSON.parse(localStorage.getItem('tugas')) || [];

// Tampilkan tugas
function tampilkanTugas() {
    const belumSelesai = document.getElementById('belum-selesai')?.querySelector('tbody');
    const telahSelesai = document.getElementById('telah-selesai')?.querySelector('tbody');

    if (belumSelesai) belumSelesai.innerHTML = '';
    if (telahSelesai) telahSelesai.innerHTML = '';

    tugas.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nama}</td>
            <td>${item.prioritas}</td>
            <td>${item.status}</td>
            <td>${item.tanggal}</td>
            <td>
                <button onclick="tandaiSelesai(${index})" class="btn-aksi selesai">Tandai Selesai</button>
                <button onclick="editTugas(${index})" class="btn-aksi edit">Edit</button>
                <button onclick="hapusTugas(${index})" class="btn-aksi hapus">Hapus</button>
            </td>
        `;
        if (item.status === 'Belum Selesai') {
            belumSelesai.appendChild(tr);
        } else {
            telahSelesai.appendChild(tr);
        }
    });
}

// Tambah tugas baru
const formTugas = document.getElementById('form-tugas');
if (formTugas) {
    formTugas.addEventListener('submit', function(e) {
        e.preventDefault();
        const nama = this.nama.value;
        const prioritas = this.prioritas.value;
        const tanggal = this.tanggal.value;
        tugas.push({ nama, prioritas, tanggal, status: 'Belum Selesai' });
        localStorage.setItem('tugas', JSON.stringify(tugas));
        window.location.href = 'index.html';
    });
}

// Edit tugas
function editTugas(index) {
    localStorage.setItem('editIndex', index);
    window.location.href = 'ubah-todoolist.html';
}
 window.editTugas = editTugas;

// Ubah tugas
const formUbahTugas = document.getElementById('form-ubah-tugas');
if (formUbahTugas) {
    const index = localStorage.getItem('editIndex');
    if (index !== null) {
        formUbahTugas.nama.value = tugas[index].nama;
        formUbahTugas.prioritas.value = tugas[index].prioritas;
        formUbahTugas.tanggal.value = tugas[index].tanggal;
    }
    formUbahTugas.addEventListener('submit', function(e) {
        e.preventDefault();
        tugas[index].nama = this.nama.value;
        tugas[index].prioritas = this.prioritas.value;
        tugas[index].tanggal = this.tanggal.value;
        localStorage.setItem('tugas', JSON.stringify(tugas));
        localStorage.removeItem('editIndex');
        window.location.href = 'index.html';
    });
}
// Tandai selesai
function tandaiSelesai(index) {
    tugas[index].status = 'Selesai';
    localStorage.setItem('tugas', JSON.stringify(tugas));
    tampilkanTugas();
}
 window.tandaiSelesai = tandaiSelesai;

// Hapus tugas
function hapusTugas(index) {
    tugas.splice(index, 1);
    localStorage.setItem('tugas', JSON.stringify(tugas));
    tampilkanTugas();
}
window.hapusTugas = hapusTugas;

// Saat halaman dimuat
document.addEventListener('DOMContentLoaded', tampilkanTugas);