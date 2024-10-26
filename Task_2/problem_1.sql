-- Starting with a CTE to organize our data
WITH UniqueStatuses AS (
    SELECT 
        StepID, 
        Workflow,  
        Status,  
        -- Assign a unique row number to each entry within its workflow, ordered by StepID
        ROW_NUMBER() OVER (PARTITION BY Workflow ORDER BY StepID) AS rn
    FROM 
        Workflows  -- The table where our workflow data is stored
),

--Another CTE to calculate the unique statuses
CountUniqueStatuses AS (
    -- Select the relevant columns from the first CTE (aliased as 'a')
    SELECT 
        a.StepID, 
        a.Workflow,  
        a.Status,  
        -- Count distinct statuses from the second CTE (aliased as 'b')
        COUNT(DISTINCT b.Status) AS UniqueStatusCount
    FROM 
        UniqueStatuses a 
    -- Join the UniqueStatuses CTE with itself
    JOIN 
        UniqueStatuses b ON a.Workflow = b.Workflow AND b.rn <= a.rn
        --This join condition ensures we get all statuses for the same workflow
        --up to and including the current step 
    GROUP BY 
        a.StepID, a.Workflow, a.Status  -- Group by StepID, Workflow, and Status to aggregate the count
)

--Final selection from the second CTE
SELECT 
    StepID,  -
    Workflow,  
    Status,  
    UniqueStatusCount  
FROM 
    CountUniqueStatuses  -- Get results from the CountUniqueStatuses CTE
ORDER BY 
    StepID;  --Order the final results by StepID
