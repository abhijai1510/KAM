require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database successfully');
    
    // test to check if data exists
    db.query('SELECT COUNT(*) as count FROM restaurants', (err, results) => {
        if (err) {
            console.error('Error querying restaurants:', err);
        } else {
            console.log('Number of restaurants:', results[0].count);
        }
    });
});

// error handling for lost connections
db.on('error', function(err) {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
    } else if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.');
    }
});

// API Routes
// get all restaurants
app.get('/api/restaurants', (req, res) => {
    console.log('Fetching restaurants...');
    const query = `
        SELECT r.*, k.name as kam_name 
        FROM restaurants r 
        LEFT JOIN kams k ON r.kam_id = k.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching restaurants:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Found restaurants:', results.length);
        res.json(results);
    });
});

// Add new restaurant
app.post('/api/restaurants', (req, res) => {
    console.log('Adding new restaurant...');
    const { name, address, contact_number, status, kam_id } = req.body;
    const query = 'INSERT INTO restaurants (name, address, contact_number, status, kam_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, address, contact_number, status, kam_id], (err, result) => {
        if (err) {
            console.error('Error adding restaurant:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Added restaurant with id:', result.insertId);
        res.json({ id: result.insertId, ...req.body });
    });
});

// update restaurant
app.put('/api/restaurants/:id', (req, res) => {
    console.log('Updating restaurant...');
    const { name, address, contact_number, status, kam_id } = req.body;
    const query = 'UPDATE restaurants SET name=?, address=?, contact_number=?, status=?, kam_id=? WHERE id=?';
    db.query(query, [name, address, contact_number, status, kam_id, req.params.id], (err) => {
        if (err) {
            console.error('Error updating restaurant:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Updated restaurant with id:', req.params.id);
        res.json({ id: req.params.id, ...req.body });
    });
});

// Delete restaurant
app.delete('/api/restaurants/:id', (req, res) => {
    console.log('Deleting restaurant...');
    // First delete all contacts and interactions
    const queries = [
        'DELETE FROM contacts WHERE restaurant_id = ?',
        'DELETE FROM interactions WHERE restaurant_id = ?',
        'DELETE FROM restaurants WHERE id = ?'
    ];
    
    db.query(queries[0], [req.params.id], (err) => {
        if (err) {
            console.error('Error deleting restaurant contacts:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        db.query(queries[1], [req.params.id], (err) => {
            if (err) {
                console.error('Error deleting restaurant interactions:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            db.query(queries[2], [req.params.id], (err) => {
                if (err) {
                    console.error('Error deleting restaurant:', err);
                    res.status(500).json({ error: err.message });
                    return;
                }
                console.log('Deleted restaurant with id:', req.params.id);
                res.json({ success: true });
            });
        });
    });
});

// get restaurant contacts
app.get('/api/restaurants/:id/contacts', (req, res) => {
    console.log('Fetching restaurant contacts...');
    const query = 'SELECT * FROM contacts WHERE restaurant_id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching restaurant contacts:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Found restaurant contacts:', results.length);
        res.json(results);
    });
});

// post restaurant contact
app.post('/api/contacts', (req, res) => {
    console.log('Adding new restaurant contact...');
    const { restaurant_id, name, role, phone_number, email } = req.body;
    const query = 'INSERT INTO contacts (restaurant_id, name, role, phone_number, email) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [restaurant_id, name, role, phone_number, email], (err, result) => {
        if (err) {
            console.error('Error adding restaurant contact:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Added restaurant contact with id:', result.insertId);
        res.json({ id: result.insertId, ...req.body });
    });
});

// del contact
app.delete('/api/contacts/:id', (req, res) => {
    console.log('Deleting contact...');
    const query = 'DELETE FROM contacts WHERE id = ?';
    db.query(query, [req.params.id], (err) => {
        if (err) {
            console.error('Error deleting contact:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Deleted contact with id:', req.params.id);
        res.json({ success: true });
    });
});

// Get interactions
app.get('/api/interactions', (req, res) => {
    console.log('Fetching interactions...');
    const query = `
        SELECT i.*, r.name as restaurant_name, k.name as kam_name 
        FROM interactions i 
        JOIN restaurants r ON i.restaurant_id = r.id 
        JOIN kams k ON i.kam_id = k.id 
        ORDER BY i.interaction_date DESC`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching interactions:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Found interactions:', results.length);
        res.json(results);
    });
});

// Add interaction
app.post('/api/interactions', (req, res) => {
    console.log('Adding new interaction...');
    const { restaurant_id, kam_id, interaction_type, notes, follow_up_required } = req.body;
    const query = 'INSERT INTO interactions (restaurant_id, kam_id, interaction_date, interaction_type, notes, follow_up_required) VALUES (?, ?, CURDATE(), ?, ?, ?)';
    db.query(query, [restaurant_id, kam_id, interaction_type, notes, follow_up_required], (err, result) => {
        if (err) {
            console.error('Error adding interaction:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Added interaction with id:', result.insertId);
        res.json({ id: result.insertId, ...req.body });
    });
});

// Get kams
app.get('/api/kams', (req, res) => {
    console.log('Fetching KAMs...');
    const query = 'SELECT * FROM kams';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching KAMs:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Found KAMs:', results.length);
        res.json(results);
    });
});

// Add new KAM
app.post('/api/kams', (req, res) => {
    console.log('Adding new KAM...');
    const { name, email, phone } = req.body;
    const query = 'INSERT INTO kams (name, email, phone) VALUES (?, ?, ?)';
    db.query(query, [name, email, phone], (err, result) => {
        if (err) {
            console.error('Error adding KAM:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Added KAM with id:', result.insertId);
        res.json({ id: result.insertId, ...req.body });
    });
});

// Delete KAM
app.delete('/api/kams/:id', (req, res) => {
    console.log('Deleting KAM...');
    // checking if KAM has any assigned restaurants
    const checkQuery = 'SELECT COUNT(*) as count FROM restaurants WHERE kam_id = ?';
    db.query(checkQuery, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error checking KAM restaurants:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (results[0].count > 0) {
            res.status(400).json({ error: 'Cannot delete KAM with assigned restaurants' });
            return;
        }
            //none, then proceed
        const deleteQuery = 'DELETE FROM kams WHERE id = ?';
        db.query(deleteQuery, [req.params.id], (err) => {
            if (err) {
                console.error('Error deleting KAM:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true });
        });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
