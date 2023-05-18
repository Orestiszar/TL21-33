SELECT
    COUNT(*) as NumberOfPasses,
    SUM(toll_data.rate) as PassesCost
FROM
    (
        SELECT
            ep.vehicleID,
            prov.provider_name AS TagProvider,
            tr.time_of_trans,
            tr.token
        FROM
            provider AS prov,
            transaction AS tr,
            e_pass AS ep
        WHERE
            tr.e_pass_tagID = ep.tagID
            AND ep.tagID = tr.e_pass_tagID
            AND ep.providerID = prov.providerID
            AND ep.providerID = 'op2_ID'
            AND tr.time_of_trans BETWEEN 'date_from'
            AND 'date_to'
    ) as epasses_from_toll
    JOIN (
        SELECT
            tp.tollID,
            prov.provider_name as StationOperator,
            prov.providerID as StationID,
            tr.e_pass_tagID,
            tr.time_of_trans,
            tr.rate,
            tr.token
        FROM
            toll_post AS tp,
            provider AS prov,
            transaction AS tr
        WHERE
            tp.providerID = prov.providerID
            AND tp.tollID = tr.toll_post_tollID
            AND tp.providerID = 'op1_ID'
            AND tr.time_of_trans BETWEEN 'date_from'
            AND 'date_to'
    ) as toll_data ON toll_data.token = epasses_from_toll.token
ORDER BY
    toll_data.tollID



