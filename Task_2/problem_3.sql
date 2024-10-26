
SELECT 
    ParentID, 
    COUNT(ChildID) AS Number_Children,  -- Count the number of children for each parent
    AVG(Age) AS Average_Age,  -- Calculate the average age of the children
    MAX(Age) - MIN(Age) AS Age_Difference,  -- Calculate the age difference between the oldest and youngest children
    MAX(Age) - MIN(Age) AS Largest_Age_Gap,  -- Calculate the largest age gap among siblings (same as age difference)
    MIN(Age) AS Youngest_Age,  -- Find the age of the youngest child
    MAX(Age) AS Oldest_Age,  --Find the age of the oldest child
    GROUP_CONCAT(Gender ORDER BY ChildID) AS Genders  -- Concatenate the genders of the children into a single field, ordered by Child ID
FROM 
    Children  -- Specify the table from which to retrieve data
GROUP BY 
    ParentID;  -- Group the results by Parent ID to aggregate data for each parent
