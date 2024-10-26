SELECT 
    CustomerID,  
    MAX(CASE WHEN Type = 'Cellular' THEN PhoneNumber END) AS Cellular,  -- Get the Cellular phone number
    MAX(CASE WHEN Type = 'Work' THEN PhoneNumber END) AS Work,  -- Get the Work phone number
    MAX(CASE WHEN Type = 'Home' THEN PhoneNumber END) AS Home  -- Get the Home phone number
FROM 
    Customers  -- Specify the name of the table containing the data
GROUP BY 
    CustomerID;  -- Group the results by CustomerID to ensure one row per customer
