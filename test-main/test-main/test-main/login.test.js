const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./index');  // Asegúrate de apuntar correctamente al archivo que exporta `app`
const { Users } = require('./index');

describe('POST /login', () => {
    beforeAll(async () => {
        // Conectar a la base de datos de pruebas
        await mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true });

        // Crear un usuario de prueba
        const user = new Users({
            fullname: 'Test User',
            email: 'testuser@example.com',
            password: 'hashedpassword' // Asegúrate de que la contraseña esté cifrada de la misma manera
        });
        await user.save();
    });

    afterAll(async () => {
        // Limpiar la base de datos después de las pruebas
        await Users.deleteMany({});
        await mongoose.connection.close();
    });

    it('debería iniciar sesión con credenciales correctas', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'testuser@example.com',
                password: 'hashedpassword'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Welcome');
    });

    it('debería fallar con credenciales incorrectas', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword'
            });

        expect(response.status).toBe(200); // Este código de estado depende de cómo hayas configurado tu endpoint
        expect(response.body.message).toBe('User not found');
    });
});

