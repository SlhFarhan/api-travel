'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Travels', [
      {
        judulPerjalanan: 'Mengunjungi Dunia Laskar Pelangi',
        cerita: 'Perjalanan napak tilas ke Belitung, mengunjungi replika SD Muhammadiyah Gantong yang ikonik. Merasakan semangat Ikal dan kawan-kawan di tengah keindahan Pantai Tanjung Tinggi yang dihiasi batu-batu granit raksasa, persis seperti yang digambarkan dalam novel.',
        imageId: 'https://upload.wikimedia.org/wikipedia/id/8/8e/Laskar_pelangi_sampul.jpg',
        userId: null, // Data seeder tidak dimiliki user manapun
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judulPerjalanan: 'Petualangan di Negeri 5 Menara',
        cerita: 'Terinspirasi dari novel karya A. Fuadi, perjalanan ini membawa saya untuk melihat langsung semangat "Man Jadda Wajada". Meskipun tidak ke Gontor, semangat para pencari ilmu terasa di setiap sudut pesantren yang saya kunjungi di Jawa Timur.',
        imageId: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555486948l/6475871.jpg',
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        judulPerjalanan: 'Menyusuri Jejak Bumi Manusia',
        cerita: 'Sebuah perjalanan ke Surabaya dan kota-kota sekitarnya, mencoba membayangkan kehidupan di era kolonial seperti yang diceritakan Pramoedya Ananta Toer. Mengunjungi bangunan-bangunan tua dan merasakan denyut sejarah yang masih tersisa.',
        imageId: 'https://upload.wikimedia.org/wikipedia/id/thumb/4/4f/BumiManusia.jpg/800px-BumiManusia.jpg',
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Travels', null, {});
  }
};