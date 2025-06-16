const { Travel } = require('../models');
const fs = require('fs');
const path = require('path');

// Get all travel entries
exports.getAllTravels = async (req, res) => {
    try {
        const travels = await Travel.findAll({
            order: [['createdAt', 'DESC']],
        });
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

        // PERBAIKAN: Buat URL lengkap
        const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

        const newTravel = await Travel.create({
            judulPerjalanan,
            cerita,
            // PERBAIKAN: Simpan URL lengkap ke kolom 'imageId'
            imageId: imageUrl,
            userId: req.userId
        });

        // Kirim kembali objek yang baru dibuat secara langsung
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
        
        // Ambil URL lama dari kolom 'imageId'
        let imageUrl = travel.imageId; 

        if (req.file) {
            // Hapus file lama jika ada
            if (travel.imageId) {
                const oldFilename = travel.imageId.split('/').pop();
                fs.unlink(path.join(__dirname, '..', 'uploads', oldFilename), (err) => {
                    if (err) console.error("Failed to delete old image:", err);
                });
            }
            // Buat URL lengkap yang baru
            imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
        }
        
        const { judulPerjalanan, cerita } = req.body;
        await travel.update({
            judulPerjalanan: judulPerjalanan || travel.judulPerjalanan,
            cerita: cerita || travel.cerita,
            // PERBAIKAN: Update kolom 'imageId' dengan URL lengkap
            imageId: imageUrl
        });
        
        // Kirim kembali objek yang sudah diupdate secara langsung
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
        if (travel.imageId) {
            // PERBAIKAN: Ambil nama file dari URL di kolom 'imageId'
            const filename = travel.imageId.split('/').pop();
            fs.unlink(path.join(__dirname, '..', 'uploads', filename), (err) => {
                if (err) console.error("Failed to delete image:", err);
            });
        }
        
        await travel.destroy();
        res.status(200).send({ message: "Travel entry deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};