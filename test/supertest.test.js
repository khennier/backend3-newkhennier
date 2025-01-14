import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Adoption Router Tests', () => {
  let userId;
  let petId;

  before(async () => {
    // Generar usuarios y mascotas para las pruebas
    const mockUsers = await request(app).get('/api/mocks/mockingusers');
    const mockPets = await request(app).get('/api/mocks/mockingpets');

    userId = mockUsers.body.users[0]._id; // Primer usuario mockeado
    petId = mockPets.body.pets[0]._id;    // Primera mascota mockeada
  });

  it('Debe obtener todas las adopciones', async () => {
    const res = await request(app).get('/api/adoptions');
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.payload).to.be.an('array');
  });

  it('Debe crear una nueva adopción', async () => {
    const res = await request(app).post(`/api/adoptions/${userId}/${petId}`);
    expect(res.status).to.equal(201);
    expect(res.body.status).to.equal('success');
    expect(res.body.message).to.equal('Pet adopted successfully'); // Actualizar el mensaje esperado
  });
  
  
  
});
