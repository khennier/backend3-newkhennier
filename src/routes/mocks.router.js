import { Router } from 'express';
import { faker } from '@faker-js/faker';
import userModel from '../dao/models/User.js';
import petModel from '../dao/models/Pet.js';

const router = Router();

let users = [];
let pets = [];
let adoptions = [];

// Generar usuarios simulados
router.get('/mockingusers', async (req, res) => {
  try {
    const users = Array.from({ length: 10 }, () => ({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      pets: [],
    }));

    // Guarda los usuarios en la base de datos
    const savedUsers = await userModel.insertMany(users);
    res.status(200).json({ status: 'success', users: savedUsers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al guardar usuarios', details: error.message });
  }
});
// Generar mascotas simuladas
router.get('/mockingpets', async (req, res) => {
  try {
    const pets = Array.from({ length: 10 }, () => ({
      name: faker.animal.dog(),
      specie: 'dog', // Puedes personalizar esto si es necesario
      birthDate: faker.date.past(5),
      adopted: false,
    }));

    // Guarda las mascotas en la base de datos
    const savedPets = await petModel.insertMany(pets);
    res.status(200).json({ status: 'success', pets: savedPets });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al guardar mascotas', details: error.message });
  }
});

// Generar adopciones simuladas
router.get('/mockingadoptions', (req, res) => {
  if (users.length === 0 || pets.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Primero debes generar usuarios y mascotas',
    });
  }

  adoptions = pets.slice(0, 5).map((pet, index) => ({
    owner: users[index % users.length]._id,
    pet: pet._id,
  }));

  if (adoptions.length > 0) {
    res.status(200).json({ status: 'success', adoptions });
  } else {
    res.status(500).json({ status: 'error', message: 'No se pudieron generar adopciones' });
  }
});

export { users, pets, adoptions };
export default router;
