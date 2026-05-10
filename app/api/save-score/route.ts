import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
// Import instance Prisma yang sudah kita buat sebelumnya di folder lib

export async function POST(req: Request) {
  try {
    // 1. Ambil data yang dikirim dari frontend
    const body = await req.json();
    const { 
      playerName, 
      score, 
      mode, 
      correctAnswers, 
      incorrectAnswers, 
      historyDetail 
    } = body;

    // 2. Validasi dasar: Pastikan nama tidak kosong
    if (!playerName || playerName.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Nama pemain tidak boleh kosong' }, 
        { status: 400 }
      );
    }

    // 3. Simpan data ke database Neon menggunakan Prisma
    const newSession = await prisma.session.create({
      data: {
        playerName,
        score,
        mode,
        correctAnswers,
        incorrectAnswers,
        historyDetail, // Data array akan otomatis di-convert menjadi JSON oleh Prisma
      },
    });

    // 4. Kembalikan respons sukses ke frontend
    return NextResponse.json({ success: true, data: newSession }, { status: 201 });
    
  } catch (error) {
    // Jika ada error (misal koneksi putus atau format salah), tangkap di sini
    console.error("Gagal menyimpan skor ke database:", error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server' }, 
      { status: 500 }
    );
  }
}