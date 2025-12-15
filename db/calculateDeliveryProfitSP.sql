USE restaurant_ordering;

DELIMITER //

CREATE PROCEDURE CALCULATE_DELIVERY_PROFIT(IN input_delivery_id INT)
BEGIN
    DECLARE deliveryTotal DECIMAL(10,2) DEFAULT 3.99;
    DECLARE platformCut DECIMAL(10,2) DEFAULT 0.60;

    -- Get the delivery fee from DELIVERIES table
    SELECT DELIVERY_FEE_TOTAL
    INTO deliveryTotal
    FROM DELIVERIES
    WHERE DELIVERY_ID = input_delivery_id;

    -- Handle NULL delivery fee
    IF deliveryTotal IS NULL THEN
        SET deliveryTotal = 0.00;
    END IF;

    -- Update platform cut
    UPDATE DELIVERIES
    SET DELIVERY_PLATFORM_CUT = platformCut
    WHERE DELIVERY_ID = input_delivery_id;
END //

DELIMITER ;
