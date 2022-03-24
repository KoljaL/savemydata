# save my data

## <sub>(draft title)</sub>

a simple framework to save various data based on users

## dependencies

-   **Auth** [PHP-JWT](https://github.com/firebase/php-jwt)
- 	**Table** [TUI grid](https://github.com/nhn/tui.grid)

## Progressive Responsive Layout

- Classic but progressive template for data-driven pages.   
- Three media breakpoints via JavaScript.  
- Collapsible sidebar and menu.  
- Dark and light mode.  
- No (external) dependencies.  


## dev links

**SQLite**
- 	https://openwritings.net/pg/php/php-using-pdo-sqlite
-   https://github.com/vielhuber/dbhelper
-   https://github.com/nivunkpv/Sqlite-Wrapper
-   https://github.com/tommyknocker/pdo-database-class

 
----

# Code
just some explanations to remember


## Functions

### api.php

Endpoint Variables: `$API_endpoint/$API_param/$API_value`

#### `get_profile_form()`
- called by: `/form_profile`   
- returns all data from table `$API_param`


#### `delete_user()`
- called by: `/deleteuser`   
- deletes user by `$param['id']` from table `$param['table']`
- returns `200/400`  
**rename to universal `delete_row`, from `$param[]` to `$API_`**

#### `new_user()`
- called by: `/xxx`   
- calls: `insert_into_db( $param, $table )`
- returns all data from table `$API_param`


#### `get_user_list()`
- called by: `/xxx`   
- returns all data from table `$param['table']`
- remove the password!  
**rename to universal `get_table`, from `$param[]` to `$API_`**


#### `singleedit()`
- called by: `/xxx`   
- update a single entry in table `$param['table']` by  `$param['update']`,  `$param['where']`,  `$param['equal']`


#### `is_allowed()`
- called by: every first function   
**not ready att all**


#### `get_user_profile()`
- called by: `/xxx`   
- returns all data from table `$param['table']`  
**rename to universal `get_table`, from `$param[]` to `$API_`**


#### `login_user()`
- called by: `/xxx`   
- verifies username or email with passwort in user table
- returns token and username, id, role and permissions  
**make table dynamically by `$API_param`**


#### `init_user_profile_form_table()`
- called by: `/xxx`   
- creates the table `user_profile_form` and insertes fields
- calls: `insert_into_db()`


#### `init_usertable()`
- called by: `/xxx`   
- creates the table `user` and insertes fields
- calls: `insert_into_db()`


#### `init_customertable()`
- called by: `/xxx`   
- creates the table `customer` and insertes fields
- calls: `insert_into_db()`


#### `insert_into_db()`
- called by: `/xxx`   
- saves an array of data to table called by parameter `$table`
- checks for non existing columns and creates them
- returns row `id` 


#### `return_JSON()`
- called by: `/xxx`   
- sends header for JSON
- outputs array as JSON
- for debugging, it sends the `$request` with every response


### dummy functions
- `create_dummy_staff()`
- `create_dummy_customer()`



