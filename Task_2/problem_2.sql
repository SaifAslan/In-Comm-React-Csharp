SELECT 
    r2.Customer_ID,  
    r2.Repair_ID,   
    r1.Repair_ID AS Previous_Repair_ID, 
    r2.Repair_Date, 
    r1.Repair_Date AS Previous_Repair_Date,  
    ROW_NUMBER() OVER (PARTITION BY r2.Customer_ID ORDER BY r2.Repair_Date) AS Sequence_Number,  --Generate a sequence number for repairs per customer
    DATEDIFF(r2.Repair_Date, r1.Repair_Date) AS Repair_Gap_Days  -- Calculate the gap in days between the two repairs
FROM 
    Repairs r1  --First instance of the Repairs table for previous repairs
JOIN 
    Repairs r2 ON r1.Customer_ID = r2.Customer_ID  -- Join on Customer_ID to relate current and previous repairs
WHERE 
    r2.Repair_Date > r1.Repair_Date  --Ensure we are comparing the current repair to a previous one
    AND DATEDIFF(r2.Repair_Date, r1.Repair_Date) <= 30  --Check that the previous repair is within 30 days of the current one
ORDER BY 
    r2.Customer_ID, r2.Repair_Date;  -- Order the results by Customer ID and then by Repair Date
