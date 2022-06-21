# All queries of api.php



## functions of  endpoints

## login_user()
 `SELECT * FROM staff WHERE $userlogin =?`


## get_list_from()
 `SELECT $columns FROM $table`


## get_data_from()
 `SELECT * FROM $table $where`


## new_entry_in()
 `insert_into_db( $param, $table )`


## delete_entry_in()
in case of deleting file, get path  
 `SELECT * FROM files WHERE id =? `    

 `DELETE FROM $table WHERE id =?`


## edit_single_field()
check if colums exists  
 `SELECT $param[update] from $param[table]`  

if not, create  
 `ALTER TABLE $param[table] ADD COLUMN '$param[update]' TEXT NOT NULL DEFAULT ''`  

then update  
 `UPDATE $param[table] SET $param[update]=? WHERE $param[where]=?`  


## get_projects_as_table()
 `SELECT * FROM project $where`


## get_project()
 `SELECT * FROM project WHERE id = $API_param`  
 `SELECT * FROM appointment WHERE project_id = $API_param`  

 `get_name_by_id( 'customer', $id )`  
 `get_name_by_id( 'staff', $id )`  


## get_projects_from()
 `SELECT * FROM project WHERE customer_id = :id`


## get_appointment()
 `SELECT * FROM appointment WHERE id = :id`  

 `get_name_by_id( 'customer', $customer_id )`  
 `get_name_by_id( 'project', $project_id )`  
 `get_name_by_id( 'staff', $staff_id )`  
 `get_name_by_id( 'staff', $staff_id, location )`  


## get_appointments_from()
 `SELECT * FROM appointment WHERE customer_id = :id`


## get_appointments_as_table()
 `SELECT * FROM appointment "WHERE start_date BETWEEN '$start' AND '$end'`  

 `get_name_by_id( 'customer', $customer_id )`  
 `get_name_by_id( 'project', $project_id )`  
 `get_name_by_id( 'staff', $staff_id )`  

## get_appointment_as_ics()
 `"SELECT * FROM appointment WHERE id =?`  

 `get_name_by_id( 'customer', $customer_id )`  
 `get_name_by_id( 'project', $project_id )`  
 `get_name_by_id( 'staff', $staff_id )`  

## upload_file()
staff avatar  
 `UPDATE $usertype SET avatar=? WHERE id=?`  

images  
 `INSERT INTO files (origin, origin_id, path,path_thumb,type,name, date) VALUES (?,?,?,?,?,?,?)`  

## get_files_from()
 `SELECT * FROM files WHERE origin = :origin AND origin_id = :origin_id`


## get_geocode()
 `UPDATE appointment SET location=?, lat=?, lng=?, map_link=? WHERE id=?`


## functions

## get_name_by_id()
`SELECT id, $name FROM $table WHERE id = $id`   


## insert_into_db()
`INSERT OR REPLACE INTO $table ($columns_needed) VALUES ($placeholder)`   




## example Queries

select multiple foreign keys to one row
```SQL
SELECT s.scoreID, p.playerName, s.scoreVal,
    w0.weaponLabel as w0Label,
    w1.weaponLabel as w1Label
    -- etc
FROM Scores s
JOIN Players p ON p.id = s.playerID
JOIN Weapons w0 ON w0.weaponID = s.scoreW0
JOIN Weapons w1 ON w1.weaponID = s.scoreW1
```


Join tables in sqlite with many to many
```SQL 
create table people (
    id integer primary key autoincrement,
);

create table groups (
    id integer primary key autoincrement,
);
CREATE TABLE groups_people (
  groups_id integer,
  people_id integer,
  PRIMARY KEY(group_id, people_id)
);  
SELECT * FROM people p  
  LEFT JOIN groups_people gp ON gp.people_id = p.id  
  WHERE gp.groups_id = '7';
```


Inner Join sqlite from multiple tables
```SQL
SELECT 
    DRIVER.driv_id, DRIVER.firstName, 
    TEAMSTANDING.teamName, 
    RESULTS.points   
FROM 
    TEAMSTANDING
    INNER JOIN 
        DRIVER
ON 
        TEAMSTANDING.driv_id=DRIVER.driv_id
    INNER JOIN 
        RESULTS 
    ON 
        RESULTS.driv_id=DRIVER.drv_id
WHERE 
    TEAMSTANDING.comp_id=2
GROUP BY 
    DRIVER.driv_id;

```