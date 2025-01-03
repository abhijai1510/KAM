USE kam_lead_management;

-- Insert KAMs
INSERT INTO kams (name, email) VALUES
    ('Rajesh Kumar', 'rajesh.kumar@udaan.com'),
    ('Priya Sharma', 'priya.sharma@udaan.com'),
    ('Amit Patel', 'amit.patel@udaan.com'),
    ('Deepa Verma', 'deepa.verma@udaan.com');

INSERT INTO restaurants (name, address, contact_number, status, kam_id) VALUES
    ('Taj Spice Corner', '123 MG Road, Bangalore', '9876543210', 'Active', 1),
    ('Punjab Dhaba Express', '45 Anna Salai, Chennai', '8765432109', 'New', 2),
    ('Biryani House', '78 Park Street, Kolkata', '7654321098', 'Active', 3),
    ('Mumbai Tiffins', '234 FC Road, Pune', '9876543211', 'New', 1),
    ('Dosa Paradise', '567 100 Feet Road, Bangalore', '8876543212', 'Active', 2),
    ('Royal Kitchen', '89 Civil Lines, Delhi', '7776543213', 'Inactive', 3),
    ('Spice Garden', '432 Jubilee Hills, Hyderabad', '9976543214', 'New', 4),
    ('Krishna\'s Kitchen', '765 Linking Road, Mumbai', '8876543215', 'Active', 4);

INSERT INTO contacts (restaurant_id, name, role, phone_number, email) VALUES
    (1, 'Vikram Singh', 'Owner', '9988776655', 'vikram.singh@email.com'),
    (1, 'Meena Kumari', 'Manager', '9988776656', 'meena.k@email.com'),
    (2, 'Gurpreet Singh', 'Owner', '9988776657', 'gurpreet.s@email.com'),
    (3, 'Rahul Das', 'Manager', '9988776658', 'rahul.das@email.com'),
    (4, 'Sanjay Patil', 'Owner', '9988776659', 'sanjay.p@email.com'),
    (5, 'Lakshmi Rao', 'Owner', '9988776660', 'lakshmi.r@email.com'),
    (6, 'Arun Kumar', 'Manager', '9988776661', 'arun.k@email.com'),
    (7, 'Ravi Reddy', 'Owner', '9988776662', 'ravi.r@email.com'),
    (8, 'Anjali Shah', 'Owner', '9988776663', 'anjali.s@email.com');

-- Insert interactions
INSERT INTO interactions (restaurant_id, kam_id, interaction_date, interaction_type, notes, follow_up_required) VALUES
    (1, 1, CURDATE(), 'Call', 'Discussed new menu items and pricing', true),
    (1, 1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Visit', 'Kitchen inspection completed', false),
    (2, 2, CURDATE(), 'Call', 'Initial contact made, interested in partnership', true),
    (3, 3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Order', 'First order placed successfully', false),
    (4, 1, CURDATE(), 'Call', 'Follow-up on registration process', true),
    (5, 2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Visit', 'Location assessment done', false),
    (6, 3, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'Call', 'Discussed reactivation options', true),
    (7, 4, CURDATE(), 'Call', 'Introduction call completed', true),
    (8, 4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Order', 'Bulk order discussion', false);
