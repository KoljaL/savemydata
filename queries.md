# All queries of api.php



 
## login_user()
### `SELECT * FROM staff WHERE $userlogin =?`


## get_list_from()
### `SELECT $columns FROM $table`


## get_data_from()
### `SELECT * FROM $table $where`


## new_entry_in()
### `insert_into_db( $param, $table )`


## delete_entry_in()
in case of deleting file, get path
### `SELECT * FROM files WHERE id =? `
### `DELETE FROM $table WHERE id =?`


## edit_single_field()
check if colums exists
### `SELECT $param[update] from $param[table]`
if not, create
### `ALTER TABLE $param[table] ADD COLUMN '$param[update]' TEXT NOT NULL DEFAULT ''`
then update
### `UPDATE $param[table] SET $param[update]=? WHERE $param[where]=?`


## get_projects_as_table()
### `SELECT * FROM project $where`


## get_project()
### `SELECT * FROM project WHERE id = $API_param`
### `SELECT * FROM appointment WHERE project_id = $API_param`
### `get_name_by_id( 'customer', $id )`
### `get_name_by_id( 'staff', $id )`


## get_projects_from()
### `SELECT * FROM project WHERE customer_id = :id`


## get_appointment()
### `SELECT * FROM appointment WHERE id = :id`
### `get_name_by_id( 'customer', $customer_id )`
### `get_name_by_id( 'project', $project_id )`
### `get_name_by_id( 'staff', $staff_id )`
### `get_name_by_id( 'staff', $staff_id, location )`


## get_appointments_from()
### `SELECT * FROM appointment WHERE customer_id = :id`


## get_appointments_as_table()
### `SELECT * FROM appointment "WHERE start_date BETWEEN '$start' AND '$end'`
### `get_name_by_id( 'customer', $customer_id )`
### `get_name_by_id( 'project', $project_id )`
### `get_name_by_id( 'staff', $staff_id )`

## get_appointment_as_ics()
### `"SELECT * FROM appointment WHERE id =?`
### `get_name_by_id( 'customer', $customer_id )`
### `get_name_by_id( 'project', $project_id )`
### `get_name_by_id( 'staff', $staff_id )`

## upload_file()
staff avatar
### `UPDATE $usertype SET avatar=? WHERE id=?`
images
### `INSERT INTO files (origin, origin_id, path,path_thumb,type,name, date) VALUES (?,?,?,?,?,?,?)`

## get_files_from()
### `SELECT * FROM files WHERE origin = :origin AND origin_id = :origin_id`


## get_geocode()
### `UPDATE appointment SET location=?, lat=?, lng=?, map_link=? WHERE id=?`
