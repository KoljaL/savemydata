# fetches per page
 
## Login
endpoint: `/`
### load
- nothing
### submit
- `api/login`



## Staff Profile
endpoint: `#staff/profile/1`
### load
- `api/get_files_from/staff/1`
- `api/get_data_from/staff_fields`
- `api/get_data_from/staff/1`
- `api/get_list_from/staff/id,username`
- `api/get_appointments_from/staff/1`
- `api/get_projects_from/staff/1`
### edit
- `api/edit_single_field`
### delete
- `api/delete_entry_in/staff/1`
### new/save
- `api/newuser`


## Staff Profile Fields
endpoint: `#formeditor/staff_fields`
### load
- `api/get_data_from/staff_fields`
### edit
- `api/edit_single_field`
### delete
- `api/delete_entry_in/staff_fields/1`
### new/save
- `api/new_entry_in/staff_fields`



## Staff Profile Table
endpoint: `#staff/table`
### load
- `api/get_data_from/staff` 



## Project:
endpoint: `#project/id/1`
### load
- `api/get_files_from/project/1` 
### edit
- `api/edit_single_field`
### delete
- `api/delete_entry_in/project/1`



## Project Table
endpoint: `#project/table`
### load
- `api/get_projects_as_table/project`
- `api/get_data_from/project`
- `api/get_list_from/customer/id,username`
### new
- `api/new_entry_in/project`



## Appointment:
endpoint: `#appointment/id/1`
### load
- `api/get_appointment/1` 
- `api/get_files_from/appointment/1` 
### edit
- `api/edit_single_field`
### delete
- `api/delete_entry_in/appointment/1`



## Appointment Table
endpoint: `#appointment/table`
### load
- `api/get_appointments_as_table/appointment`  


## Calendar
endpoint: `#calendar`
### load
- `api/get_list_from/staff/id,username,color`  
- `api/get_appointments_as_table`  


## Calendar Popup
endpoint: `#calendar`
### load
- `api/get_list_from/staff/id,username`  
- `api/get_list_from/customer/id,username`  
- `api/get_list_from/project/id,title,customer_id`
### edit/save
- `api/new_entry_in/appointment`  
