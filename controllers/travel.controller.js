const { Travel, User } = require('../models');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Helper function to check if a string is a full URL
const isURL = (str) => {
    if (typeof str !== 'string') return false;
    return str.startsWith('http://') || str.startsWith('https://');
};

const getUserIdFromToken = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch (err) {
        return null;
    }
};

// Helper to format travel data for the response
const formatTravelResponse = (travel, userId) => {
    if (!travel) return null;
    
    const isMine = userId ? travel.userId === userId : false;
    
    // **LOGIC YANG DIPERBARUI DI SINI**
    // Jika imageId sudah merupakan URL, gunakan langsung.
    // Jika tidak, buat URL lengkapnya.
    const imageUrl = travel.imageId
        ? isURL(travel.imageId)
            ? travel.imageId 
            : `${process.env.BASE_URL}/uploads/${travel.imageId}`
        : null;

    const travelObject = travel.get({ plain: true });
    
    return {
        ...travelObject,
        imageId: imageUrl, // Ganti imageId dengan URL yang sudah final
        mine: isMine
    };
};

// --- FUNGSI-FUNGSI LAINNYA TETAP SAMA SEPERTI SEBELUMNYA ---

// Get all travel entries
exports.getAllTravels = async (req, res) => {
    try {
        const loggedInUserId = getUserIdFromToken(req);
        const travels = await Travel.findAll({
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'owner', attributes: ['email'] }]
        });

        const responseData = travels.map(travel => formatTravelResponse(travel, loggedInUserId));
        res.send(responseData);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get a single travel entry by its ID
exports.getTravelById = async (req, res) => {
    try {
        const loggedInUserId = getUserIdFromToken(req);
        const travel = await Travel.findByPk(req.params.id, {
            include: [{ model: User, as: 'owner', attributes: ['email'] }]
        });

        if (!travel) {
            return res.status(404).send({ message: "Travel entry not found." });
        }
        
        const responseData = formatTravelResponse(travel, loggedInUserId);
        res.send(responseData);
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

        const newTravel = await Travel.create({
            judulPerjalanan,
            cerita,
            imageId: req.file.filename, // Disimpan sebagai nama file
            userId: req.userId
        });

        const responseData = formatTravelResponse(newTravel, req.userId);
        res.status(201).send(responseData);
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
        
        let imageId = travel.imageId;
        if (req.file) {
            // Jika imageId lama bukan URL (artinya file lokal), hapus file lama
            if (travel.imageId && !isURL(travel.imageId)) {
                fs.unlink(path.join(__dirname, '..', 'uploads', travel.imageId), (err) => {
                    if (err) console.error("Failed to delete old image:", err);
                });
            }
            imageId = req.file.filename; // Simpan nama file baru
        }
        
        const { judulPerjalanan, cerita } = req.body;
        await travel.update({
            judulPerjalanan: judulPerjalanan || travel.judulPerjalanan,
            cerita: cerita || travel.cerita,
            imageId: imageId
        });
        
        const updatedTravel = await Travel.findByPk(req.params.id);
        const responseData = formatTravelResponse(updatedTravel, req.userId);
        res.send({ message: "Travel entry updated successfully!", travel: responseData });

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

        // Hapus file gambar hanya jika bukan URL
        if (travel.imageId && !isURL(travel.imageId)) {
            fs.unlink(path.join(__dirname, '..', 'uploads', travel.imageId), (err) => {
                if (err) console.error("Failed to delete image:", err);
            });
        }
        
        await travel.destroy();
        res.send({ message: "Travel entry deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};