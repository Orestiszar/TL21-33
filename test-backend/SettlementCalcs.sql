-- posa xrostaei o op2 ston op1?????
SELECT (op2_owes_op1.PassesCost - op1_owes_op2.PassesCost)
           + (op1_payed_op2.op1_to_op2_payments - op2_payed_op1.op2_to_op1_payments) as op2_owes_to_op1
FROM
    -- op2 ofeilei ston op1
    (
        SELECT IFNULL(SUM(opID_of_station.rate), 0) as PassesCost
        FROM (
                 SELECT tp.tollID,
                        prov.provider_name as StationOperator,
                        prov.providerID    as StationID,
                        tr.rate,
                        tr.token
                 FROM transaction AS tr,
                      provider AS prov,
                      toll_post as tp
                 WHERE tr.toll_post_tollID = tp.tollID
                   AND tp.providerID = prov.providerID
                   AND prov.providerID = 'OO' # op1
                   AND tr.time_of_trans BETWEEN '2020-10-01'
                     AND '2020-10-31'
             ) as opID_of_station

                 JOIN (
            SELECT prov.provider_name AS VisitorOperator,
                   ep.providerID      AS ePassProvider,
                   tr.token
            FROM transaction AS tr,
                 e_pass AS ep,
                 provider AS prov
            WHERE tr.e_pass_tagID = ep.tagID
              AND ep.providerID = prov.providerID
              AND prov.providerID = 'AO' # op2
              AND tr.time_of_trans BETWEEN '2020-10-01'
                     AND '2020-10-31'
        ) AS opID_of_epass ON opID_of_epass.token = opID_of_station.token
    ) AS op2_owes_op1,
-- op1 ofeilei ston op2
    (
        SELECT IFNULL(SUM(opID_of_station.rate), 0) as PassesCost
        FROM (
                 SELECT tp.tollID,
                        prov.provider_name as StationOperator,
                        prov.providerID    as StationID,
                        tr.rate,
                        tr.token
                 FROM transaction AS tr,
                      provider AS prov,
                      toll_post as tp
                 WHERE tr.toll_post_tollID = tp.tollID
                   AND tp.providerID = prov.providerID
                   AND prov.providerID = 'AO' # op2
                   AND tr.time_of_trans BETWEEN '2020-10-01'
                     AND '2020-10-31'
             ) as opID_of_station

                 JOIN (
            SELECT prov.provider_name AS VisitorOperator,
                   ep.providerID      AS ePassProvider,
                   tr.token
            FROM transaction AS tr,
                 e_pass AS ep,
                 provider AS prov
            WHERE tr.e_pass_tagID = ep.tagID
              AND ep.providerID = prov.providerID
              AND prov.providerID = 'OO' # op1
              AND tr.time_of_trans BETWEEN '2020-10-01'
                     AND '2020-10-31'
        ) AS opID_of_epass ON opID_of_epass.token = opID_of_station.token
    ) AS op1_owes_op2,
-- find how much op1 payed to op2
    (
        SELECT IFNULL(SUM(de.amount), 0) AS op1_to_op2_payments
        FROM debts AS de
        WHERE de.indebted = 'OO'  # op1_ID
          AND de.benefiter = 'AO' # op2_ID
          AND de.date BETWEEN '2020-10-01'
                     AND '2020-10-31'
    ) AS op1_payed_op2,
-- find how much op2 payed to op1a
    (
        SELECT IFNULL(SUM(de.amount), 0) AS op2_to_op1_payments
        FROM debts AS de
        WHERE de.indebted = 'AO'  # op2_ID
          AND de.benefiter = 'OO' # op1_ID
          AND de.date BETWEEN '2020-10-01'
                     AND '2020-10-31'
    ) AS op2_payed_op1


# SELECT (op2_owes_op1.PassesCost - op1_owes_op2.PassesCost) + (op1_payed_op2.op1_to_op2_payments - op2_payed_op1.op2_to_op1_payments) as op2_owes_to_op1 FROM ( SELECT IFNULL(SUM(opID_of_station.rate), 0) as PassesCost FROM ( SELECT tp.tollID, prov.provider_name as StationOperator, prov.providerID as StationID, tr.rate, tr.token FROM transaction AS tr, provider AS prov, toll_post as tp WHERE tr.toll_post_tollID = tp.tollID AND tp.providerID = prov.providerID AND prov.providerID = 'AO' # op1 AND tr.time_of_trans BETWEEN '2019-01-01 16:18:56' AND '2019-01-04 16:18:56' ) as opID_of_station JOIN ( SELECT prov.provider_name AS VisitorOperator, ep.providerID AS ePassProvider, tr.token FROM transaction AS tr, e_pass AS ep, provider AS prov WHERE tr.e_pass_tagID = ep.tagID AND ep.providerID = prov.providerID AND prov.providerID = 'EG' # op2 AND tr.time_of_trans BETWEEN '2019-01-01 16:18:56' AND '2019-01-04 16:18:56' ) AS opID_of_epass ON opID_of_epass.token = opID_of_station.token ) AS op2_owes_op1, ( SELECT IFNULL(SUM(opID_of_station.rate), 0) as PassesCost FROM ( SELECT tp.tollID, prov.provider_name as StationOperator, prov.providerID as StationID, tr.rate, tr.token FROM transaction AS tr, provider AS prov, toll_post as tp WHERE tr.toll_post_tollID = tp.tollID AND tp.providerID = prov.providerID AND prov.providerID = 'EG' # op2 AND tr.time_of_trans BETWEEN '2019-01-01 16:18:56' AND '2019-01-04 16:18:56' ) as opID_of_station JOIN ( SELECT prov.provider_name AS VisitorOperator, ep.providerID AS ePassProvider, tr.token FROM transaction AS tr, e_pass AS ep, provider AS prov WHERE tr.e_pass_tagID = ep.tagID AND ep.providerID = prov.providerID AND prov.providerID = 'AO' # op1 AND tr.time_of_trans BETWEEN '2019-01-01 16:18:56' AND '2019-01-04 16:18:56' ) AS opID_of_epass ON opID_of_epass.token = opID_of_station.token ) AS op1_owes_op2, ( SELECT IFNULL(SUM(de.amount), 0) AS op1_to_op2_payments FROM debts AS de WHERE de.indebted = 'EG' # op1_ID AND de.benefiter = 'AO' # op2_ID AND de.date BETWEEN '2019-01-01 16:18:56' AND '2019-01-04 16:18:56' ) AS op1_payed_op2, ( SELECT IFNULL(SUM(de.amount), 0) AS op2_to_op1_payments FROM debts AS de WHERE de.indebted = 'AO' # op2_ID AND de.benefiter = 'EG' # op1_ID AND de.date BETWEEN '2019-01-01 16:18:56' AND '2019-01-04 16:18:56' ) AS op2_payed_op1
