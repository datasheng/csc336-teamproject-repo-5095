USE restaurant_ordering;

DELIMITER //

CREATE PROCEDURE CALCULATE_ORDER_PROFIT(IN input_order_id INT)
BEGIN
    DECLARE subtotal DECIMAL(10,2) DEFAULT 0.00;
    DECLARE commission DECIMAL(10,2) DEFAULT 0.00;
    DECLARE serviceFee DECIMAL(10,2) DEFAULT 2.99;
    DECLARE totalProfit DECIMAL(10,2) DEFAULT 0.00;

    -- Get subtotal from ORDERITEMS table
    SELECT SUM(price * quantity)
    INTO subtotal
    FROM ORDERITEMS
    WHERE ORDER_ID = input_order_id;

    -- Handle NULL subtotal (in case of empty order)
    IF subtotal IS NULL THEN
        SET subtotal = 0.00;
    END IF;

    -- Calculate
    SET commission = subtotal * 0.15;
    SET totalProfit = commission + serviceFee;

    -- Update ORDERS table with results
    UPDATE ORDERS
    SET PLATFORM_COMMISSION = commission,
        SERVICE_FEE = serviceFee,
        PLATFORM_PROFIT_ORDER = totalProfit
    WHERE ORDER_ID = input_order_id;
END //

DELIMITER ;
