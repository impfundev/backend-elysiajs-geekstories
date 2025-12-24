import { AppDataSource } from "../src/config/database";
import { User } from "../src/entities";
import { createInterface } from "node:readline/promises";

// 2. Buat interface readline sekali saja di luar fungsi
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Fungsi helper untuk menampilkan pertanyaan (query)
 * Menggunakan readline yang jauh lebih stabil daripada console iterator
 */
const prompt = async (query: string): Promise<string> => {
  let answer = "";

  // Loop sampai user memberikan input yang tidak kosong
  while (!answer) {
    answer = await rl.question(`${query} `);
    answer = answer.trim();

    if (!answer) {
      console.log("⚠️  Input tidak boleh kosong, silakan coba lagi.");
    }
  }

  return answer;
};

/**
 * Fungsi helper khusus untuk password.
 */
const promptPassword = async (query: string): Promise<string> => {
  console.log("\n---");
  console.log("⚠️  PERHATIAN: Password akan terlihat saat diketik.");
  console.log(
    "Untuk produksi, gunakan library seperti 'prompts' atau 'inquirer'."
  );
  console.log("---");

  return await prompt(query);
};

/**
 * Fungsi utama
 */
const main = async () => {
  console.log("🚀 Memulai skrip pembuatan user...");

  try {
    // 1. Inisialisasi koneksi database
    console.log("Menghubungkan ke database...");
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    console.log("Database terhubung.");

    // 2. Kumpulkan data dari terminal
    // Sekarang ini akan berjalan mulus berurutan
    const name = await prompt("Nama Lengkap:");
    const username = await prompt("Username:");
    const email = await prompt("Email:");
    const password = await promptPassword("Password:");

    // 3. Buat dan simpan user baru
    console.log("\nMembuat user di database...");
    const user = new User();
    user.name = name;
    user.username = username;
    user.email = email;
    user.password = password;

    await user.save();

    console.log("\n✅ User berhasil dibuat!");
    console.log("--------------------------");
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log("--------------------------");
  } catch (error: any) {
    // 4. Tangani error
    console.error("\n❌ Gagal membuat user:");
    if (
      error.code === "SQLITE_CONSTRAINT" ||
      error.message?.includes("UNIQUE constraint failed")
    ) {
      console.error("   Error: Username atau Email sudah terdaftar.");
    } else {
      console.error(`   Detail: ${error.message}`);
    }
  } finally {
    // 5. Cleanup
    rl.close(); // PENTING: Tutup readline agar terminal tidak hang
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Koneksi database ditutup.");
    }
    process.exit(0); // Pastikan proses berhenti total
  }
};

// Jalankan skrip
main();
