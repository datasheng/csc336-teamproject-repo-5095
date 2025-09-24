USE test_restaurant;

CREATE TABLE deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    driver_id INT NOT NULL,
    delivery_status ENUM('assigned','picked_up','in_transit','delivered','failed') DEFAULT 'assigned',
    estimated_time TIMESTAMP,
    actual_time TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);