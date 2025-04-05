const { User } = require('../models');

async function initializeUsers() {
  // Dodaj konto administratora, jeśli nie istnieje
  const admin = await User.findOne({ where: { username: 'admin' } });
  if (!admin) {
    await User.create({
      username: 'admin',
      password: 'admin123',  // Pamiętaj, aby zahashować hasło w rzeczywistej aplikacji
      role: 'admin'
    });
    console.log('🛠️ Konto admina zostało utworzone (admin/admin123)');
  }

  // Dodaj testowego użytkownika, jeśli nie istnieje
  const testUser = await User.findOne({ where: { username: 'testuser' } });
  if (!testUser) {
    await User.create({
      username: 'testuser',
      password: 'user123',  // Pamiętaj, aby zahashować hasło w rzeczywistej aplikacji
      role: 'user'
    });
    console.log('👤 Konto użytkownika zostało utworzone (testuser/user123)');
  }
}

module.exports = initializeUsers;
