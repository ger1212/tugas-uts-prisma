const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Get All Films
app.get("/films", async (req, res) => {
  try {
    const films = await prisma.film.findMany();
    res.status(200).json({ message: "Films berhasil diambil", films });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create Film
app.post("/films", async (req, res) => {
  const { nama, genre, tanggalRilis, rating } = req.body;

  try {
    const film = await prisma.film.create({
      data: {
        nama,
        genre,
        tanggalRilis: new Date(tanggalRilis),
        rating,
      },
    });

    res.status(201).json({ message: "Film berhasil dibuat", film });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Film
app.put("/films/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { nama, genre, tanggalRilis, rating } = req.body;

  try {
    const isExists = await prisma.film.findUnique({
      where: { id },
    });

    if (!isExists) {
      return res.status(400).json({ error: "Film tidak ditemukan" });
    }

    const updatedFilm = await prisma.film.update({
      where: { id },
      data: {
        nama,
        genre,
        tanggalRilis: new Date(tanggalRilis),
        rating,
      },
    });

    res.status(200).json({ message: "Film berhasil diperbarui", updatedFilm });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Film
app.delete("/films/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const isExists = await prisma.film.findUnique({
      where: { id },
    });

    if (!isExists) {
      return res.status(400).json({ error: "Film tidak ditemukan" });
    }

    await prisma.film.delete({
      where: { id },
    });

    res.status(200).json({ message: "Film berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3306, () => {
  console.log("Server is running on http://localhost:3306");
});