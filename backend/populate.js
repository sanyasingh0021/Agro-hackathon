const mongoose = require('mongoose');
const Place = require('./models/place');  // Update with your actual path
const Product = require('./models/product');  // Update with your actual path
const User = require('./models/user');  // Update with your actual path

// MongoDB connection URI
const uri = 'mongodb+srv://deveshisingh7b:qrXoHWzxr5zEFfmb@agridb.c9s4f.mongodb.net/?retryWrites=true&w=majority&appName=agridb';  // Update with your actual DB name

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        // Create sample users
        const users = await User.create([
            {
                name: 'Rajesh Kumar',
                email: 'rajesh@example.com',
                password: 'password123',
                address: '123, MG Road, Bangalore',
                location: { lat: 12.9716, lng: 77.5946 },
                district: 'Bangalore Urban',
                state: 'Karnataka',
                country: 'India',
                image: 'https://example.com/image1.jpg'
            },
            {
                name: 'Aarti Sharma',
                email: 'aarti@example.com',
                password: 'password123',
                address: '456, Brigade Road, Bangalore',
                location: { lat: 12.9716, lng: 77.5946 },
                district: 'Bangalore Urban',
                state: 'Karnataka',
                country: 'India',
                image: 'https://example.com/image2.jpg'
            }
        ]);

        console.log('Users created:', users);

        // Create sample places
        const places = await Place.create([
            {
                title: 'Lalbagh Botanical Garden',
                description: 'A historic garden in Bangalore.',
                image: 'https://example.com/lalbagh.jpg',
                address: 'Lalbagh Road, Bangalore',
                location: { lat: 12.9641, lng: 77.5830 },
                creator: users[0]._id
            },
            {
                title: 'Cubbon Park',
                description: 'A large park in the heart of Bangalore.',
                image: 'https://example.com/cubbon.jpg',
                address: 'Cubbon Park, Bangalore',
                location: { lat: 12.9761, lng: 77.5914 },
                creator: users[1]._id
            }
        ]);

        console.log('Places created:', places);

        // Create sample products
        const products = await Product.create([
            {
                title: 'Organic Turmeric',
                description: '100% pure organic turmeric powder.',
                image: 'https://example.com/turmeric.jpg',
                quantity: '500g',
                unit: 'gram',
                price: 250,
                category: 'Spices',
                location: { lat: 12.9716, lng: 77.5946 },
                state: 'Karnataka',
                district: 'Bangalore Urban',
                creator: users[0]._id,
                transactions: []
            },
            {
                title: 'Fresh Mangoes',
                description: 'Seasonal fresh mangoes from Karnataka.',
                image: 'https://example.com/mangoes.jpg',
                quantity: '1kg',
                unit: 'kilogram',
                price: 150,
                category: 'Fruits',
                location: { lat: 12.9716, lng: 77.5946 },
                state: 'Karnataka',
                district: 'Bangalore Urban',
                creator: users[1]._id,
                transactions: []
            }
        ]);

        console.log('Products created:', products);

        // Close the connection
        mongoose.disconnect();
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });
