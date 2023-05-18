SELECT
    epasses_from_toll.vehicleID,
    epasses_from_toll.TagProvider,
    toll_data.tollID,
    toll_data.StationOperator,
    toll_data.e_pass_tagID,
    toll_data.time_of_trans,
    toll_data.rate
FROM
    (
        SELECT
            ep.vehicleID,
            prov.provider_name as TagProvider,
            tr.token
        FROM
            toll_post AS tp,
            provider AS prov,
            transaction AS tr,
            e_pass AS ep
        WHERE
            tr.e_pass_tagID = ep.tagID
            AND ep.tagID = tr.e_pass_tagID
            AND ep.providerID = prov.providerID
            AND tp.tollID = 'AO01'
            AND tr.time_of_trans BETWEEN '2000-03-26 00:00:01'
            AND '2020-03-26 23:59:59'
    ) as epasses_from_toll
    JOIN (
        SELECT
            tp.tollID,
            prov.provider_name as StationOperator,
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
            AND tp.tollID = 'AO01'
            AND tr.time_of_trans BETWEEN '2000-03-26 00:00:01'
            AND '2020-03-26 23:59:59'
    ) as toll_data ON toll_data.token = epasses_from_toll.token