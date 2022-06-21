# save my data  
a simple framework to save various data based on users


```
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
CSS                              4           2417            169           9857
PHP                              8            800           1453           8040
JavaScript                      25            692            965           3899
HTML                             2             98              5            459
Markdown                         2             70              0            164
JSON                             2              0              0             64
SVG                             19              0              0             45
-------------------------------------------------------------------------------
SUM:                            62           4077           2592          22528
-------------------------------------------------------------------------------
```
`cloc $(git ls-files) --exclude-dir=vendor`


## temporary links

- [User Roles and Permissions with bitwise operators JS](https://codepen.io/monochromer/pen/OodNQm?editors=0110)
- [User Roles and Permissions with bitwise operators PHP](https://stackoverflow.com/questions/2925245/user-role-permissions-for-different-modules-using-bitwise-operators)


## dependencies

-   **Auth** [PHP-JWT](https://github.com/firebase/php-jwt)
-   **Imgage resize** [php-image-resize](https://github.com/gumlet/php-image-resize)
-   **Calendar** [pTUI Calendar](https://github.com/nhn/tui.calendar)
-   **GeoCode** [OpenCageData](https://github.com/OpenCageData/php-opencage-geocode)

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
-   https://phpdelusions.net/pdo_examples/select
-   https://code-boxx.com/php-user-role-management-system/
-   https://www.php-einfach.de/mysql-tutorial/crashkurs-pdo/

  
# Code
just some explanations to remember


## Functions

### api.php

Endpoint Variables: `$API_endpoint/$API_param/$API_value`

#### `get_data_from()`
- called by: `xxx`   
- returns all data from table `$API_param`


#### `delete_entry_in()`
- called by: `/delete_entry_in/user/[id]`   
- deletes user by id (`$API_value`) from table `$API_param`
- returns `200/400`  


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


#### `init_user_staff_fields_table()`
- called by: `/xxx`   
- creates the table `staff_fields` and insertes fields
- calls: `insert_into_db()`


#### `init_Table()`
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


