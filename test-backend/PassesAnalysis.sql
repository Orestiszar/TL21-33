SELECT epasses_from_toll.tagID         as PassID,
       toll_data.tollID                as StationID,
       epasses_from_toll.time_of_trans as Transaction_Time,
       epasses_from_toll.vehicleID,
       toll_data.rate
FROM (SELECT ep.tagID, ep.vehicleID, prov.provider_name AS TagProvider, tr.time_of_trans, tr.token
      FROM provider AS prov,
           transaction AS tr,
           e_pass AS ep
      WHERE tr.e_pass_tagID = ep.tagID
        AND ep.tagID = tr.e_pass_tagID
        AND ep.providerID = prov.providerID
        AND ep.providerID = 'EG' # op2
        AND tr.time_of_trans BETWEEN '2019-01-01' AND '2021-01-04') as epasses_from_toll
         JOIN (SELECT tp.tollID,
                      prov.provider_name as StationOperator,
                      prov.providerID    as StationID,
                      tr.e_pass_tagID,
                      tr.time_of_trans,
                      tr.rate,
                      tr.token
               FROM toll_post AS tp,
                    provider AS prov,
                    transaction AS tr
               WHERE tp.providerID = prov.providerID
                 AND tp.tollID = tr.toll_post_tollID
                 AND tp.providerID = 'AO' # op1
                 AND tr.time_of_trans BETWEEN '2019-01-01' AND '2021-01-04') as toll_data
              ON toll_data.token = epasses_from_toll.token
ORDER BY epasses_from_toll.time_of_trans, toll_data.tollID
