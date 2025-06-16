const { Travel, User } = require('../models');
const fs = require('fs');
const path = require('path');

// --- HELPER FUNCTIONS SUDAH TIDAK DIPERLUKAN LAGI JIKA DATA KONSISTEN ---
// const isURL = ... (bisa dihapus)
// const getUserIdFromToken = ... (bisa dihapus jika menggunakan middleware)
// const formatTravelResponse = ... (bisa dihapus)

// Get all travel entries
exports.getAllTravels = async (req, res) => {
    try {
        const travels = await Travel.findAll({
            order: [['createdAt', 'DESC']],
        });
        // Kirim data mentah. Biarkan klien yang menentukan item mana miliknya.
        res.send(travels);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get a single travel entry by its ID
exports.getTravelById = async (req, res) => {
    try {
        const travel = await Travel.findByPk(req.params.id);
        if (!travel) {
            return res.status(404).send({ message: "Travel entry not found." });
        }
        res.send(travel);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Create a new travel entry
exports.createTravel = async (req, res) => {
    try {
        const { judulPerjalanan, cerita } = req.body;
        
        if (!req.file) {
            return res.status(400).send({ message: "Image must be uploaded." });
        }
        if (!judulPerjalanan || !cerita) {
            return res.status(400).send({ message: "Title and story are required." });
        }

        // PERBAIKAN: Buat dan simpan URL lengkap dari awal
        const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

        const newTravel = await Travel.create({
            judulPerjalanan,
            cerita,
            gambar: imageUrl, // Simpan URL lengkap, bukan nama file
            userId: req.userId
        });

        res.status(201).send(newTravel);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update an existing travel entry
exports.updateTravel = async (req, res) => {
    try {
        const travel = await Travel.findByPk(req.params.id);
        if (!travel) {
            return res.status(404).send({ message: "Travel entry not found." });
        }

        if (travel.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden: You do not own this entry." });
        }
        
        let imageUrl = travel.gambar; 
        if (req.file) {
            if (travel.gambar) {
                const oldFilename = travel.gambar.split('/').pop();
                fs.unlink(path.join(__dirname, '..', 'uploads', oldFilename), (err) => {
                    if (err) console.error("Failed to delete old image:", err);
                });
            }
            // PERBAIKAN: Selalu buat dan simpan URL lengkap
            imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
        }
        
        const { judulPerjalanan, cerita } = req.body;
        await travel.update({
            judulPerjalanan: judulPerjalanan || travel.judulPerjalanan,
            cerita: cerita || travel.cerita,
            gambar: imageUrl
        });
        
        res.send(travel);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete a travel entry
exports.deleteTravel = async (req, res) => {
    try {
        const travel = await Travel.findByPk(req.params.id);
        if (!travel) {
            return res.status(404).send({ message: "Travel entry not found." });
        }
        if (travel.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden: You do not own this entry." });
        }

        // Hapus file gambar dari storage
        if (travel.gambar) {
            const filename = travel.gambar.split('/').pop();
            fs.unlink(path.join(__dirname, '..', 'uploads', filename), (err) => {
                if (err) console.error("Failed to delete image:", err);
            });
        }
        
        await travel.destroy();
        // Cukup kirim status sukses, tidak perlu body
        res.status(200).send({ message: "Travel entry deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};