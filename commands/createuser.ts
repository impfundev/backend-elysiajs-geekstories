import { AppDataSource } from "../src/config/database";
import { User } from "../src/entities";

/**
 * Fungsi helper untuk menampilkan pertanyaan (query)
 * dan membaca satu baris input dari terminal.
 */
const prompt = async (query: string): Promise<string> => {
  console.write(`${query} `); // Tampilkan pertanyaan tanpa baris baru

  // Fitur Bun: 'console' dapat di-loop per baris sebagai stream
  for await (const line of console) {
    const input = line.trim();
    if (input) {
      return input; // Kembalikan input jika tidak kosong
    }
    // Jika input kosong, tanya lagi
    console.write(`Input tidak boleh kosong. ${query} `);
  }
  return ""; // Fallback (seharusnya tidak tercapai)
};

/**
 * Fungsi helper khusus untuk password.
 * Menambahkan peringatan keamanan.
 */
const promptPassword = async (query: string): Promise<string> => {
  console.log("\n---");
  console.log("⚠️  PERHATIAN: Password akan terlihat saat diketik.");
  console.log(
    "Untuk skrip produksi, pertimbangkan library 'prompts' untuk menyembunyikannya."
  );
  console.log("---");

  let password = "";
  while (password.length === 0) {
    password = await prompt(query);
  }
  return password;
};

/**
 * Fungsi utama untuk menjalankan skrip
 */
const main = async () => {
  console.log("🚀 Memulai skrip pembuatan user...");

  try {
    // 1. Inisialisasi koneksi database
    console.log("Menghubungkan ke database...");
    await AppDataSource.initialize();
    console.log("Database terhubung.");

    // 2. Kumpulkan data dari terminal
    const name = await prompt("Nama Lengkap:");
    const username = await prompt("Username:");
    const email = await prompt("Email:");
    const password = await promptPassword("Password:"); // Gunakan helper password

    // 3. Buat dan simpan user baru
    console.log("\nMembuat user di database...");
    const user = new User();
    user.name = name;
    user.username = username;
    user.email = email;
    user.password = password; // Hashing akan ditangani oleh hook @BeforeInsert

    // 'save()' akan memicu @BeforeInsert
    await user.save();

    console.log("\n✅ User berhasil dibuat!");
    console.log("--------------------------");
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log("--------------------------");
  } catch (error: any) {
    // 4. Tangani error (misal: duplikat username/email)
    console.error("\n❌ Gagal membuat user:");
    if (
      error.code === "SQLITE_CONSTRAINT" ||
      error.message.includes("UNIQUE constraint failed")
    ) {
      console.error("   Error: Username atau Email sudah terdaftar.");
    } else {
      console.error(`   Detail: ${error.message}`);
    }
  } finally {
    // 5. Selalu tutup koneksi database
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("\nKoneksi database ditutup.");
    }
  }
};

// Jalankan skrip
main();
