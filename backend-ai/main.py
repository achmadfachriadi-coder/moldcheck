from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
import io
import os
from PIL import Image, ImageFilter
from datetime import datetime
from supabase import create_client, Client
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ==========================================
# 1. KONFIGURASI CORS & FOLDER
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "foto_kiriman"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ==========================================
# 2. KONFIGURASI SUPABASE
# ==========================================
SUPABASE_URL = "https://ehjaluytbnpwrodpluuq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoamFsdXl0Ym5wd3JvZHBsdXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NzExMjYsImV4cCI6MjA5NTA0NzEyNn0.YTG1_tkOlmmS7ns0RtJ6jPKcoqEqNpwHb6PFKbLWm0Q"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ==========================================
# 3. MUAT MODEL AI 
# ==========================================
MODEL_PATH = "model_jamur.h5"
if os.path.exists(MODEL_PATH):
    print("Memuat model AI...")
    model_ai = tf.keras.models.load_model(MODEL_PATH)
    print("Model AI Deep Learning BERHASIL dimuat! 🚀")
else:
    model_ai = None

# ==========================================
# 4. FUNGSI ANALISIS (EDGE DETECTION / KEKASARAN)
# ==========================================
def analisis_jamur_cnn(image_bytes):
    # Buka gambar
    img = Image.open(io.BytesIO(image_bytes))
    img_gray = img.convert("L").resize((224, 224))
    
    # -----------------------------------------------------
    # SENSOR: FIND_EDGES (Mendeteksi Tekstur Jamur)
    # -----------------------------------------------------
    edges = img_gray.filter(ImageFilter.FIND_EDGES)
    edge_array = np.array(edges)
    
    # Batas sensitivitas piksel 20 agar jamur pudar tetap tertangkap
    piksel_kasar = np.sum(edge_array > 20)
    total_piksel = edge_array.size
    persentase_kasar = (piksel_kasar / total_piksel) * 100
    
    print(f"\n[DEBUG VISION] Tingkat Kekasaran/Jamur: {persentase_kasar:.2f}%")
    
    # -----------------------------------------------------
    # KALIBRASI SKOR (SENSITIVITAS TINGGI)
    # -----------------------------------------------------
    # 10% kekasaran area sudah cukup memicu skor 100
    skor_mentah = (persentase_kasar / 10.0) * 100
    
    # Tambahkan sedikit "boost" agar nilainya lebih agresif ke atas
    skor_final = int(max(5, min(skor_mentah + 15, 99))) 
    
    print(f"[DEBUG VISION] Skor Akhir: {skor_final}\n")

    # Logika Risiko
    if skor_final >= 70:
        status = "Tinggi"
        insight = "Bercak kasar (Black mold) terdeteksi jelas menyebar di dinding."
        rekomendasi = ["Buka ventilasi setiap pagi", "Gunakan cairan anti-jamur segera"]
    elif skor_final >= 40:
        status = "Sedang"
        insight = "Ada indikasi kotor atau awal jamur. Dinding mulai kasar."
        rekomendasi = ["Pantau sirkulasi udara", "Bersihkan area secara rutin"]
    else:
        status = "Aman / Bersih"
        insight = "Kondisi dinding mulus dan aman dari bercak jamur."
        rekomendasi = ["Pertahankan kebersihan", "Tetap buka ventilasi rutin saat pagi"]

    return {
        "skor": skor_final,
        "status_risiko": status,
        "insight_ai": insight,
        "rekomendasi": rekomendasi,
        "faktor": {
            "kelembapan": min(skor_final + 10, 100),
            "jamur": skor_final,
            "ventilasi": max(100 - skor_final, 10),
            "kebersihan": max(100 - skor_final, 10)
        }
    }

# ==========================================
# 5. ENDPOINT API UTAMA (DENGAN RBAC NOMOR KAMAR)
# ==========================================
@app.post("/analisis-foto")
async def analisis_foto(
    file: UploadFile = File(...),
    # RBAC: Jika dari Next.js tidak dikirim nomor kamar, defaultnya "Kamar Pribadi"
    nomor_kamar: str = Form("Kamar Pribadi") 
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar!")
        
    try:
        image_bytes = await file.read()
        hasil_analisis = analisis_jamur_cnn(image_bytes)
        
        waktu = datetime.now().strftime("%Y%m%d_%H%M%S")
        nama_file = f"{waktu}_{file.filename}"
        lokasi_simpan = os.path.join(UPLOAD_FOLDER, nama_file)
        
        with open(lokasi_simpan, "wb") as f:
            f.write(image_bytes)
            
        # ==========================================
        # DATA INSERT DENGAN NOMOR KAMAR
        # ==========================================
        data_insert = {
            "skor": hasil_analisis["skor"],
            "status_risiko": hasil_analisis["status_risiko"],
            "insight_ai": hasil_analisis["insight_ai"],
            "rekomendasi": hasil_analisis["rekomendasi"],
            "image_path": nama_file,
            "nomor_kamar": nomor_kamar # Mengirim nomor kamar ke Supabase
        }
        
        supabase.table("riwayat_scan").insert(data_insert).execute()
        
        return {
            "status": "Sukses",
            "pesan": "Foto dianalisis dan disimpan!",
            "hasil_ai": hasil_analisis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))