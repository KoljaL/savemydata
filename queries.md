# All queries of api.php



 
## login_user()
### `"SELECT * FROM staff WHERE $userlogin =?"`
## get_list_from()
### `"SELECT $columns FROM $table"`
## get_data_from()
### `"SELECT * FROM $table $where"`
## new_entry_in()
### `insert_into_db( $param, $table )`
## delete_entry_in()
in case of deleting file, get path
### `SELECT * FROM files WHERE id =? "`
### `"DELETE FROM $table WHERE id =?"`
## edit_single_field()
check if colums exists
### `SELECT $param[update] from $param[table]`
if not, create
## `"ALTER TABLE $param[table] ADD COLUMN '$param[update]' TEXT NOT NULL DEFAULT ''`
then update
### `UPDATE $param[table] SET $param[update]=? WHERE $param[where]=?`
## get_projects_as_table()
### `"SELECT * FROM project $where"`
## get_project()
### `SELECT * FROM project WHERE id = $API_param`
### `SELECT * FROM appointment WHERE project_id = $API_param`
## get_projects_from()
### `xxxx`
## get_appointment()
### `xxxx`
## get_appointments_from()
### `xxxx`
## get_appointments_as_table()
### `xxxx`
## get_appointment_as_ics()
### `xxxx`
## upload_file()
### `xxxx`
## get_files_from()
### `xxxx`
## get_geocode()
### `xxxx`
