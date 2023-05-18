SELECT opID_of_epass.VisitorOperator,
       COUNT(*)                  as NumberOfPasses,
       SUM(opID_of_station.rate) as PassesCost
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
           AND prov.providerID = 'AO'
           AND tr.time_of_trans BETWEEN '2012-01-01 16:14:56'
             AND '2020-01-01 16:18:56'
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
      AND prov.providerID <> 'AO'
      AND tr.time_of_trans BETWEEN '2012-01-01 16:14:56'
        AND '2020-01-01 16:18:56'
) AS opID_of_epass ON opID_of_epass.token = opID_of_station.token
GROUP BY (opID_of_epass.ePassProvider)
