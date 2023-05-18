INSERT INTO debts(indebted, benefiter, amount, date, details)
VALUES ('GF', 'KO', 25.32, current_timestamp, 'Success');


UPDATE debts
SET amount = '50000000000.7'
WHERE debts.indebted = 'AO'
  AND debts.benefiter = 'EG';

SELECT amount
    FROM debts
    WHERE debts.indebted = 'ΑΟ'
      AND debts.benefiter = 'KO';



UPDATE debts
SET amount = 40.7
WHERE debts.indebted = 'ΑΟ'
  AND debts.benefiter = 'KO';



SELECT amount
FROM debts
WHERE debts.indebted = 'GF'
  AND debts.benefiter = 'KO';













