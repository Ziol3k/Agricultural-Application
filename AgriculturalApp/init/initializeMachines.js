const { Machine } = require('../models');  

const initializeMachines = async () => {
  try {
    await Machine.destroy({ where: {} });

    await Machine.create({
      name: 'Traktor Ursus C60',
      description: 'Traktor Ursus C60, jeden z klasyków w polskim rolnictwie.',
      image_url: '/images/machines/traktor1.jpg' 
    });

    await Machine.create({
      name: 'Traktor Zetor 7011',
      description: '1Zetor 7011 to jeden z traktorów produkowanych przez czeską markę Zetor.',
      image_url: '/images/machines/ciagnik1.jpg' 
    });

    await Machine.create({
        name: 'Traktor Zetor 7012',
        description: '2Zetor 7011 to jeden z traktorów produkowanych przez czeską markę Zetor.',
        image_url: '/images/machines/ciagnik1.jpg' 
      });

    await Machine.create({
        name: 'Traktor Zetor 7013',
        description: '3Zetor 7011 to jeden z traktorów produkowanych przez czeską markę Zetor.',
        image_url: '/images/machines/ciagnik1.jpg' 
      });


      await Machine.create({
        name: 'Traktor Zetor 7014',
        description: '4Zetor 7011 to jeden z traktorów produkowanych przez czeską markę Zetor.',
        image_url: '/images/machines/ciagnik1.jpg' 
      });

      await Machine.create({
        name: 'Traktor Zetor 7015',
        description: '5Zetor 7011 to jeden z traktorów produkowanych przez czeską markę Zetor.',
        image_url: '/images/machines/ciagnik1.jpg' 
      });

      await Machine.create({
        name: 'Traktor Zetor 7016',
        description: '6Zetor 7011 to jeden z traktorów produkowanych przez czeską markę Zetor.',
        image_url: '/images/machines/ciagnik1.jpg' 
      });
    console.log('Maszyny zostały pomyślnie zainicjalizowane');
  } catch (error) {
    console.error('Błąd podczas inicjalizacji maszyn:', error);
  }
};

module.exports = initializeMachines;
