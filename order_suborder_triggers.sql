DELIMITER $$

-- When a new item is added
CREATE TRIGGER trg_orderitems_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
  UPDATE orders
  SET total_amount = (
    SELECT SUM(suborder_price)
    FROM order_items
    WHERE order_id = NEW.order_id
  )
  WHERE order_id = NEW.order_id;
END$$

-- When an item is updated
CREATE TRIGGER trg_orderitems_update
AFTER UPDATE ON order_items
FOR EACH ROW
BEGIN
  UPDATE orders
  SET total_amount = (
    SELECT SUM(suborder_price)
    FROM order_items
    WHERE order_id = NEW.order_id
  )
  WHERE order_id = NEW.order_id;
END$$

-- When an item is deleted
CREATE TRIGGER trg_orderitems_delete
AFTER DELETE ON order_items
FOR EACH ROW
BEGIN
  UPDATE orders
  SET total_amount = (
    SELECT SUM(suborder_price)
    FROM order_items
    WHERE order_id = OLD.order_id
  )
  WHERE order_id = OLD.order_id;
END$$

DELIMITER ;