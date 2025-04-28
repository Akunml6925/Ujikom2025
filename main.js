 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Konfigurasi Firebase
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fungsi tampilkan tugas dari Firestore
async function tampilkanTugas() {
    const belumSelesai = document.getElementById('belum-selesai')?.querySelector('tbody');
    const telahSelesai = document.getElementById('telah-selesai')?.querySelector('tbody');

    if (belumSelesai) belumSelesai.innerHTML = '';
    if (telahSelesai) telahSelesai.innerHTML = '';

    const q = query(collection(db, 'todoolist'), orderBy('tanggal'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(docSnap => {
        const item = docSnap.data();
        const id = docSnap.id;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nama}</td>
            <td>${item.prioritas}</td>
            <td>${item.status}</td>
            <td>${item.tanggal}</td>
            <td>
                <button onclick="tandaiSelesai('${id}')" class="btn-aksi selesai">Tandai Selesai</button>
                <button onclick="editTugas('${id}')" class="btn-aksi edit">Edit</button>
                <button onclick="hapusTugas('${id}')" class="btn-aksi hapus">Hapus</button>
            </td>
        `;

        if (item.status === 'Belum Selesai') {
            belumSelesai?.appendChild(tr);
        } else {
            telahSelesai?.appendChild(tr);
        }
    });
}

// Tambah tugas baru
const formTugas = document.getElementById('form-tugas');
if (formTugas) {
    formTugas.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nama = this.nama.value;
        const prioritas = this.prioritas.value;
        const tanggal = this.tanggal.value;
        await addDoc(collection(db, 'todoolist'), {
            nama,
            prioritas,
            tanggal,
            status: 'Belum Selesai'
        });
        window.location.href = 'index.html';
    });
}

// Edit tugas - Simpan ID ke localStorage untuk ubah
function editTugas(id) {
    localStorage.setItem('editId', id);
    window.location.href = 'ubah-todoolist.html';
}
window.editTugas = editTugas;

// Form ubah tugas
const formUbahTugas = document.getElementById('form-ubah-tugas');
if (formUbahTugas) {
    const id = localStorage.getItem('editId');
    if (id) {
        (async () => {
            const docRef = doc(db, 'todoolist', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                formUbahTugas.nama.value = data.nama;
                formUbahTugas.prioritas.value = data.prioritas;
                formUbahTugas.tanggal.value = data.tanggal;
            }
        })();
    }

    formUbahTugas.addEventListener('submit', async function(e) {
        e.preventDefault();
        const docRef = doc(db, 'todoolist', id);
        await updateDoc(docRef, {
            nama: this.nama.value,
            prioritas: this.prioritas.value,
            tanggal: this.tanggal.value
        });
        localStorage.removeItem('editId');
        window.location.href = 'index.html';
    });
}

// Tandai selesai
async function tandaiSelesai(id) {
    const docRef = doc(db, 'todoolist', id);
    await updateDoc(docRef, {
        status: 'Selesai'
    });
    tampilkanTugas();
}
window.tandaiSelesai = tandaiSelesai;

// Hapus tugas
async function hapusTugas(id) {
    const docRef = doc(db, 'todoolist', id);
    await deleteDoc(docRef);
    tampilkanTugas();
}
window.hapusTugas = hapusTugas;

// Saat halaman dimuat
document.addEventListener('DOMContentLoaded', tampilkanTugas);