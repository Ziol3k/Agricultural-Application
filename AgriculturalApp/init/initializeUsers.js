const { User } = require('../models');

async function initializeUsers() {

  await User.destroy({ where: {} });

  await User.create({
    username: 'admin',
    password: 'admin123', 
    role: 'admin'
  });
  console.log('🛠️ Konto admina zostało utworzone (admin/admin123)');

  await User.create({
      username: 'testuser',
      password: 'user123', 
      role: 'user'
  });
  console.log('👤 Konto użytkownika zostało utworzone (testuser/user123)');
  
}

module.exports = initializeUsers;
