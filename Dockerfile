# Dockerfile

# 1. Gunakan image resmi Bun
FROM oven/bun:latest

# 2. Set direktori kerja di dalam container
WORKDIR /app

# 3. Copy file dependensi (optimasi cache layer)
# Hanya copy file-file ini dulu
COPY package.json bun.lock ./

# 4. Install dependensi
RUN bun install --frozen-lockfile

# 5. Copy sisa kode aplikasi
COPY . .

# 6. Expose port yang kita set di index.ts
EXPOSE 3000

# 7. Jalankan aplikasi menggunakan skrip 'start'
CMD ["bun", "run", "start"]