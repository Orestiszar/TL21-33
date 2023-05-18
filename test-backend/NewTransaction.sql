SELECT DISTINCT e_pass_tagID as tagID, e_pass_vehicleID as vehicleID
FROM transaction ORDER BY (tagID);

SELECT DISTINCT toll_post_tollID as tollID
FROM transaction ORDER BY (tollID);

SELECT DISTINCT rate
FROM transaction ORDER BY (rate);

INSERT INTO transaction (time_of_trans, rate, e_pass_tagID, e_pass_vehicleID, toll_post_tollID)
VALUES ('2022-01-31 10:06:06', '2', 'ZIA180272', 'FL13UMN92207', 'KO08');


-- -- update ballance of epass
-- UPDATE e_pass
-- SET balance = '60'
-- WHERE e_pass.tagID = 'ZIA180272'
--   AND e_pass.vehicleID = 'FL13UMN92207';

-- UPDATE e_pass SET balance = '60' WHERE e_pass.tagID = 'ZIA180272' AND e_pass.vehicleID = 'FL13UMN92207';