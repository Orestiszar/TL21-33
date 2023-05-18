SELECT X.provider_name as TagProvider,
       COUNT(*)        as ProviderPasses,
       SUM(X.rate)     as ProviderDebt
FROM (SELECT tr.rate, pr.provider_name
      FROM transaction as tr,
           e_pass as ep,
           provider as pr
      WHERE tr.toll_post_tollID = 'AO01'
        AND tr.e_pass_tagID = ep.tagID
        AND ep.providerID = pr.providerID
        AND tr.time_of_trans BETWEEN '2012-01-01 16:14:56'
          AND '2020-01-01 16:18:56')
         as X
GROUP BY (X.provider_name)
ORDER BY (X.provider_name)

# SELECT X.provider_name as TagProvider, COUNT(*) as ProviderPasses, SUM(X.rate) as ProviderDebt FROM (SELECT tr.rate, pr.provider_name FROM transaction as tr, e_pass as ep, provider as pr WHERE tr.toll_post_tollID = 'AO01' AND tr.e_pass_tagID = ep.tagID AND ep.providerID = pr.providerID AND tr.time_of_trans BETWEEN '2012-01-01 16:14:56' AND '2020-01-01 16:18:56') as X GROUP BY (X.provider_name) ORDER BY (X.provider_name)