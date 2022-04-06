<?php

// Create dummy appointments
function create_dummy_appointments($count, $days)
{
    // DB table
    global $wpdb;
    $table_name = $wpdb->prefix.'tc_appointments';

    // get array of all staff user
    $allstaffs = get_users(['role' => 'staff']);
    $allstaffs = json_decode(json_encode($allstaffs), true);
    foreach ($allstaffs as $staff => $value) {
        $staffArray[] = [
            'id'   => $value['data']['ID'],
            'name' => $value['data']['display_name']
        ];
    }
    // print_r($staffArray);

    // get array of all customer user
    $allcustomer = get_users(['role' => 'customer']);
    $allcustomer = json_decode(json_encode($allcustomer), true);
    foreach ($allcustomer as $customer => $value) {
        $customerArray[] = [
            'id'   => $value['data']['ID'],
            'name' => $value['data']['display_name']

        ];
    }
    // print_r($customerArray);

    // get random datetime, staff & customer and insert into db
    for ($i = 0; $i < $count; $i++) {

        // random numbers
        if (rand(0, 1)) {
            $random_date = date('Y-m-d', strtotime('+'.mt_rand(0, $days).' days'));
        } else {
            $random_date = date('Y-m-d', strtotime('-'.mt_rand(0, $days).' days'));
        }
        $random_hour     = str_pad(rand(8, 18), 2, 0, STR_PAD_LEFT);
        $random_minute   = str_pad(rand(0, 59), 2, 0, STR_PAD_LEFT);
        $durations       = [30, 60, 90, 120, 150, 180];
        $random_duration = $durations[mt_rand(0, 5)];
        // startdate
        $random_datetime_start = $random_date.' '.$random_hour.':'.$random_minute.':00';
        // enddate is startdate + duration
        $datetime = new DateTime($random_datetime_start);
        $datetime->add(new DateInterval('PT'.$random_duration.'M'));
        $random_datetime_end = $datetime->format('Y-m-d H:i:s');
        // echo $random_datetime_start;
        // echo "<br>";
        // echo $random_datetime_end;

        $allstaff_length = count($allstaffs) - 1;
        $random_staff    = $staffArray[rand(0, $allstaff_length)];
        // print_r($random_staff);

        $allcustomer_length = count($allcustomer) - 1;
        $random_customer    = $customerArray[rand(0, $allcustomer_length)];
        // print_r($random_customer);

        $allprojects = get_pages(['post_type' => 'project', 'authors' => $random_customer['id']]);

        // echo $random_customer['id']."<br>";
        // print_r($allprojects);

        $allprojects_length = count($allprojects) - 1;
        $random_project     = $allprojects[rand(0, $allprojects_length)];

        // print_r($random_project->ID);
        // exit;
        $array = [
            'create_date' => current_time('mysql'),
            'staff_id'    => $random_staff['id'],
            'customer_id' => $random_customer['id'],
            'project_id'  => $random_project->ID,
            'date_start'  => $random_datetime_start,
            'date_end'    => $random_datetime_end,
            'duration'    => $random_duration,
            'meta'        => 'just a free field for any information'
        ];

        // create post, post_type_appointment
        $my_post = [
            'post_title'   => $random_datetime_start,
            'post_content' => 'details for appointment',
            'post_type'    => 'appointment',
            'post_status'  => 'publish',
            'post_author'  => $random_staff['id']
        ];
        $post_id = wp_insert_post($my_post);

        // add data to custom table
        $array['post_id'] = $post_id;
        $insert           = $wpdb->insert($table_name, $array);

        // print_r($array);
    }
    // exit;
}
function random_city()
{
    $i          = random_int(0, 384);
    $city_names = ["Aberdeen", "Abilene", "Akron", "Albany", "Albuquerque", "Alexandria", "Allentown", "Amarillo", "Anaheim", "Anchorage", "Ann Arbor", "Antioch", "Apple Valley", "Appleton", "Arlington", "Arvada", "Asheville", "Athens", "Atlanta", "Atlantic City", "Augusta", "Aurora", "Austin", "Bakersfield", "Baltimore", "Barnstable", "Baton Rouge", "Beaumont", "Bel Air", "Bellevue", "Berkeley", "Bethlehem", "Billings", "Birmingham", "Bloomington", "Boise", "Boise City", "Bonita Springs", "Boston", "Boulder", "Bradenton", "Bremerton", "Bridgeport", "Brighton", "Brownsville", "Bryan", "Buffalo", "Burbank", "Burlington", "Cambridge", "Canton", "Cape Coral", "Carrollton", "Cary", "Cathedral City", "Cedar Rapids", "Champaign", "Chandler", "Charleston", "Charlotte", "Chattanooga", "Chesapeake", "Chicago", "Chula Vista", "Cincinnati", "Clarke County", "Clarksville", "Clearwater", "Cleveland", "College Station", "Colorado Springs", "Columbia", "Columbus", "Concord", "Coral Springs", "Corona", "Corpus Christi", "Costa Mesa", "Dallas", "Daly City", "Danbury", "Davenport", "Davidson County", "Dayton", "Daytona Beach", "Deltona", "Denton", "Denver", "Des Moines", "Detroit", "Downey", "Duluth", "Durham", "El Monte", "El Paso", "Elizabeth", "Elk Grove", "Elkhart", "Erie", "Escondido", "Eugene", "Evansville", "Fairfield", "Fargo", "Fayetteville", "Fitchburg", "Flint", "Fontana", "Fort Collins", "Fort Lauderdale", "Fort Smith", "Fort Walton Beach", "Fort Wayne", "Fort Worth", "Frederick", "Fremont", "Fresno", "Fullerton", "Gainesville", "Garden Grove", "Garland", "Gastonia", "Gilbert", "Glendale", "Grand Prairie", "Grand Rapids", "Grayslake", "Green Bay", "GreenBay", "Greensboro", "Greenville", "Gulfport-Biloxi", "Hagerstown", "Hampton", "Harlingen", "Harrisburg", "Hartford", "Havre de Grace", "Hayward", "Hemet", "Henderson", "Hesperia", "Hialeah", "Hickory", "High Point", "Hollywood", "Honolulu", "Houma", "Houston", "Howell", "Huntington", "Huntington Beach", "Huntsville", "Independence", "Indianapolis", "Inglewood", "Irvine", "Irving", "Jackson", "Jacksonville", "Jefferson", "Jersey City", "Johnson City", "Joliet", "Kailua", "Kalamazoo", "Kaneohe", "Kansas City", "Kennewick", "Kenosha", "Killeen", "Kissimmee", "Knoxville", "Lacey", "Lafayette", "Lake Charles", "Lakeland", "Lakewood", "Lancaster", "Lansing", "Laredo", "Las Cruces", "Las Vegas", "Layton", "Leominster", "Lewisville", "Lexington", "Lincoln", "Little Rock", "Long Beach", "Lorain", "Los Angeles", "Louisville", "Lowell", "Lubbock", "Macon", "Madison", "Manchester", "Marina", "Marysville", "McAllen", "McHenry", "Medford", "Melbourne", "Memphis", "Merced", "Mesa", "Mesquite", "Miami", "Milwaukee", "Minneapolis", "Miramar", "Mission Viejo", "Mobile", "Modesto", "Monroe", "Monterey", "Montgomery", "Moreno Valley", "Murfreesboro", "Murrieta", "Muskegon", "Myrtle Beach", "Naperville", "Naples", "Nashua", "Nashville", "New Bedford", "New Haven", "New London", "New Orleans", "New York", "New York City", "Newark", "Newburgh", "Newport News", "Norfolk", "Normal", "Norman", "North Charleston", "North Las Vegas", "North Port", "Norwalk", "Norwich", "Oakland", "Ocala", "Oceanside", "Odessa", "Ogden", "Oklahoma City", "Olathe", "Olympia", "Omaha", "Ontario", "Orange", "Orem", "Orlando", "Overland Park", "Oxnard", "Palm Bay", "Palm Springs", "Palmdale", "Panama City", "Pasadena", "Paterson", "Pembroke Pines", "Pensacola", "Peoria", "Philadelphia", "Phoenix", "Pittsburgh", "Plano", "Pomona", "Pompano Beach", "Port Arthur", "Port Orange", "Port Saint Lucie", "Port St. Lucie", "Portland", "Portsmouth", "Poughkeepsie", "Providence", "Provo", "Pueblo", "Punta Gorda", "Racine", "Raleigh", "Rancho Cucamonga", "Reading", "Redding", "Reno", "Richland", "Richmond", "Richmond County", "Riverside", "Roanoke", "Rochester", "Rockford", "Roseville", "Round Lake Beach", "Sacramento", "Saginaw", "Saint Louis", "Saint Paul", "Saint Petersburg", "Salem", "Salinas", "Salt Lake City", "San Antonio", "San Bernardino", "San Buenaventura", "San Diego", "San Francisco", "San Jose", "Santa Ana", "Santa Barbara", "Santa Clara", "Santa Clarita", "Santa Cruz", "Santa Maria", "Santa Rosa", "Sarasota", "Savannah", "Scottsdale", "Scranton", "Seaside", "Seattle", "Sebastian", "Shreveport", "Simi Valley", "Sioux City", "Sioux Falls", "South Bend", "South Lyon", "Spartanburg", "Spokane", "Springdale", "Springfield", "St. Louis", "St. Paul", "St. Petersburg", "Stamford", "Sterling Heights", "Stockton", "Sunnyvale", "Syracuse", "Tacoma", "Tallahassee", "Tampa", "Temecula", "Tempe", "Thornton", "Thousand Oaks", "Toledo", "Topeka", "Torrance", "Trenton", "Tucson", "Tulsa", "Tuscaloosa", "Tyler", "Utica", "Vallejo", "Vancouver", "Vero Beach", "Victorville", "Virginia Beach", "Visalia", "Waco", "Warren", "Washington", "Waterbury", "Waterloo", "West Covina", "West Valley City", "Westminster", "Wichita", "Wilmington", "Winston", "Winter Haven", "Worcester", "Yakima", "Yonkers", "York", "Youngstown"];
    return $city_names[$i];
}

function random_street()
{
    $i       = random_int(0, 199);
    $streets = ['Main Street East', '3rd Street North', 'Woodland Avenue', 'Sunset Drive', 'Shady Lane', 'Beech Street', 'Devonshire Drive', 'Myrtle Avenue', 'Jefferson Court', 'B Street', '8th Avenue', 'Bridle Court', 'Myrtle Street', 'Eagle Street', 'Willow Lane', 'West Avenue', 'Route 9', 'Winding Way', 'Division Street', '6th Street North', 'Jackson Street', 'Hill Street', 'Durham Court', 'Victoria Court', '9th Street West', 'Hudson Street', 'Route 10', 'Street Road', 'Route 44', 'Old York Road', '2nd Avenue', 'Franklin Court', 'Adams Avenue', 'Valley Road', 'Mechanic Street', 'Canterbury Road', 'Amherst Street', 'Church Road', 'Linden Street', 'Washington Avenue', 'College Avenue', '3rd Avenue', 'College Street', 'Cambridge Road', 'Oak Avenue', 'Lexington Court', 'Country Lane', 'Monroe Street', 'High Street', 'Eagle Road', 'North Street', 'Route 64', 'Ann Street', 'Route 32', 'Maple Avenue', 'Vine Street', 'Sycamore Street', 'Madison Court', 'Cedar Street', 'Orange Street', 'Heritage Drive', 'Augusta Drive', 'Fairview Avenue', 'Route 4', 'Chestnut Street', 'South Street', 'Franklin Street', 'Grant Street', 'Lawrence Street', 'State Street', 'Belmont Avenue', 'Sherman Street', '3rd Street West', 'Cemetery Road', 'Willow Avenue', 'Highland Drive', 'Valley View Drive', 'Madison Street', '6th Street West', 'Willow Drive', 'Hamilton Street', 'Lake Street', 'Smith Street', 'Main Street North', 'Lantern Lane', 'Sycamore Drive', 'Marshall Street', 'Depot Street', 'Lafayette Avenue', 'Oak Street', 'Aspen Drive', '11th Street', 'Ashley Court', 'Beechwood Drive', 'Glenwood Avenue', 'Pine Street', '4th Street North', 'Bank Street', 'Pheasant Run', 'River Street', '6th Street', 'Water Street', 'Madison Avenue', 'Elm Street', 'Wall Street', '4th Street South', 'Meadow Lane', 'Forest Street', 'Cypress Court', 'Route 1', 'Arch Street', 'Delaware Avenue', 'Market Street', '5th Street East', 'Circle Drive', 'Hanover Court', 'Clark Street', 'Cherry Street', 'Route 7', 'Dogwood Lane', 'Grove Avenue', 'Somerset Drive', 'Cleveland Street', 'Canterbury Court', '8th Street South', 'Atlantic Avenue', 'Roosevelt Avenue', 'Devon Road', 'Sunset Avenue', 'Garden Street', 'Laurel Drive', 'Monroe Drive', 'Clinton Street', '2nd Street East', 'Orchard Lane', 'George Street', 'Route 6', 'Queen Street', 'Jackson Avenue', 'Central Avenue', 'Surrey Lane', 'Walnut Avenue', 'Route 20', 'Pearl Street', 'Hartford Road', 'Columbia Street', 'Green Street', 'York Road', 'Chapel Street', 'Schoolhouse Lane', 'Olive Street', 'Pennsylvania Avenue', 'Edgewood Road', 'Forest Avenue', 'Oak Lane', '7th Street', 'Holly Drive', 'Primrose Lane', 'Main Street', 'Grove Street', 'Main Street South', 'Route 41', '1st Street', 'Carriage Drive', 'Franklin Avenue', 'Summer Street', '13th Street', 'Andover Court', 'Lincoln Avenue', 'New Street', 'Deerfield Drive', 'Heather Lane', 'Rosewood Drive', '2nd Street North', 'Route 5', 'Briarwood Drive', 'Evergreen Drive', 'Howard Street', 'Roberts Road', 'Jones Street', 'Court Street', '1st Avenue', 'Canterbury Drive', 'Adams Street', 'Hawthorne Avenue', 'Church Street North', 'Windsor Drive', 'Bayberry Drive', 'Hillside Avenue', '8th Street West', 'Manor Drive', 'Cedar Lane', 'Magnolia Avenue', 'Washington Street', 'Magnolia Drive', 'Valley View Road', 'Park Place', 'Park Drive', '5th Avenue', 'Highland Avenue'];
    return $streets[$i];
}

function random_text()
{
    $words = random_int(13, 18);
    $lorem = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'praesent', 'interdum', 'dictum', 'mi', 'non', 'egestas', 'nulla', 'in', 'lacus', 'sed', 'sapien', 'placerat', 'malesuada', 'at', 'erat', 'etiam', 'id', 'velit', 'finibus', 'viverra', 'maecenas', 'mattis', 'volutpat', 'justo', 'vitae', 'vestibulum', 'metus', 'lobortis', 'mauris', 'luctus', 'leo', 'feugiat', 'nibh', 'tincidunt', 'a', 'integer', 'facilisis', 'lacinia', 'ligula', 'ac', 'suspendisse', 'eleifend', 'nunc', 'nec', 'pulvinar', 'quisque', 'ut', 'semper', 'auctor', 'tortor', 'mollis', 'est', 'tempor', 'scelerisque', 'venenatis', 'quis', 'ultrices', 'tellus', 'nisi', 'phasellus', 'aliquam', 'molestie', 'purus', 'convallis', 'cursus', 'ex', 'massa', 'fusce', 'felis', 'fringilla', 'faucibus', 'varius', 'ante', 'primis', 'orci', 'et', 'posuere', 'cubilia', 'curae', 'proin', 'ultricies', 'hendrerit', 'ornare', 'augue', 'pharetra', 'dapibus', 'nullam', 'sollicitudin', 'euismod', 'eget', 'pretium', 'vulputate', 'urna', 'arcu', 'porttitor', 'quam', 'condimentum', 'consequat', 'tempus', 'hac', 'habitasse', 'platea', 'dictumst', 'sagittis', 'gravida', 'eu', 'commodo', 'dui', 'lectus', 'vivamus', 'libero', 'vel', 'maximus', 'pellentesque', 'efficitur', 'class', 'aptent', 'taciti', 'sociosqu', 'ad', 'litora', 'torquent', 'per', 'conubia', 'nostra', 'inceptos', 'himenaeos', 'fermentum', 'turpis', 'donec', 'magna', 'porta', 'enim', 'curabitur', 'odio', 'rhoncus', 'blandit', 'potenti', 'sodales', 'accumsan', 'congue', 'neque', 'duis', 'bibendum', 'laoreet', 'elementum', 'suscipit', 'diam', 'vehicula', 'eros', 'nam', 'imperdiet', 'sem', 'ullamcorper', 'dignissim', 'risus', 'aliquet', 'habitant', 'morbi', 'tristique', 'senectus', 'netus', 'fames', 'nisl', 'iaculis', 'cras', 'aenean'];

    $text = '';
    for ($s = 0; $s < $words; ++$s) {
        $i = random_int(0, 170);
        $text .= $lorem[$i].' ';
    }
    return $text;
}

function random_body()
{
    $i         = random_int(0, 20);
    $bodyparts = ['ear', 'chin', 'neck', 'chest', 'right arm', 'left arm', 'left hand', 'right hand', 'right leg', 'left leg', 'left foot', 'right foot', 'toes', 'left ankle', 'right ankle', 'navel', 'left shoulder', 'right shoulder', 'left elbow', 'right elbow', 'back'];
    return $bodyparts[$i];
}

function random_color()
{
    $i         = random_int(0, 20);
    $colors= ['#c19c90',' #2798e4',' #988cca',' #c9ac57',' #cb7832',' #e9553b',' #6a8759','#DFFF00', '#FFBF00', '#FF7F50', '#DE3163', '#9FE2BF', '#40E0D0', '#6495ED', '#9E5FFF', '#CCCCFF', '#90EE90', '#AFE1AF', '#A95C68', '#E5AA70', '#87CEEB'];
    return $colors[$i];
}

function random_name()
{
    $names = [
        'Allison',
        'Arthur',
        'Ana',
        'Alex',
        'Arlene',
        'Alberto',
        'Barry',
        'Bertha',
        'Bill',
        'Bonnie',
        'Bret',
        'Beryl',
        'Chantal',
        'Cristobal',
        'Claudette',
        'Charley',
        'Cindy',
        'Chris',
        'Dean',
        'Dolly',
        'Danny',
        'Danielle',
        'Dennis',
        'Debby',
        'Erin',
        'Edouard',
        'Erika',
        'Earl',
        'Emily',
        'Ernesto',
        'Felix',
        'Fay',
        'Fabian',
        'Frances',
        'Franklin',
        'Florence',
        'Gabielle',
        'Gustav',
        'Grace',
        'Gaston',
        'Gert',
        'Gordon',
        'Humberto',
        'Hanna',
        'Henri',
        'Hermine',
        'Harvey',
        'Helene',
        'Iris',
        'Isidore',
        'Isabel',
        'Ivan',
        'Irene',
        'Isaac',
        'Jerry',
        'Josephine',
        'Juan',
        'Jeanne',
        'Jose',
        'Joyce',
        'Karen',
        'Kyle',
        'Kate',
        'Karl',
        'Katrina',
        'Kirk',
        'Lorenzo',
        'Lili',
        'Larry',
        'Lisa',
        'Lee',
        'Leslie',
        'Michelle',
        'Marco',
        'Mindy',
        'Maria',
        'Michael',
        'Noel',
        'Nana',
        'Nicholas',
        'Nicole',
        'Nate',
        'Nadine',
        'Olga',
        'Omar',
        'Odette',
        'Otto',
        'Ophelia',
        'Oscar',
        'Pablo',
        'Paloma',
        'Peter',
        'Paula',
        'Philippe',
        'Patty',
        'Rebekah',
        'Rene',
        'Rose',
        'Richard',
        'Rita',
        'Rafael',
        'Sebastien',
        'Sally',
        'Sam',
        'Shary',
        'Stan',
        'Sandy',
        'Tanya',
        'Teddy',
        'Teresa',
        'Tomas',
        'Tammy',
        'Tony',
        'Van',
        'Vicky',
        'Victor',
        'Virginie',
        'Vince',
        'Valerie',
        'Wendy',
        'Wilfred',
        'Wanda',
        'Walter',
        'Wilma',
        'William',
        'Kumiko',
        'Aki',
        'Miharu',
        'Chiaki',
        'Michiyo',
        'Itoe',
        'Nanaho',
        'Reina',
        'Emi',
        'Yumi',
        'Ayumi',
        'Kaori',
        'Sayuri',
        'Rie',
        'Miyuki',
        'Hitomi',
        'Naoko',
        'Miwa',
        'Etsuko',
        'Akane',
        'Kazuko',
        'Miyako',
        'Youko',
        'Sachiko',
        'Mieko',
        'Toshie',
        'Junko'];

    $surnames = [
        'Abbott',
        'Acevedo',
        'Acosta',
        'Adams',
        'Adkins',
        'Aguilar',
        'Aguirre',
        'Albert',
        'Alexander',
        'Alford',
        'Allen',
        'Allison',
        'Alston',
        'Alvarado',
        'Alvarez',
        'Anderson',
        'Andrews',
        'Anthony',
        'Armstrong',
        'Arnold',
        'Ashley',
        'Atkins',
        'Atkinson',
        'Austin',
        'Avery',
        'Avila',
        'Ayala',
        'Ayers',
        'Bailey',
        'Baird',
        'Baker',
        'Baldwin',
        'Ball',
        'Ballard',
        'Banks',
        'Barber',
        'Barker',
        'Barlow',
        'Barnes',
        'Barnett',
        'Barr',
        'Barrera',
        'Barrett',
        'Barron',
        'Barry',
        'Bartlett',
        'Barton',
        'Bass',
        'Bates',
        'Battle',
        'Bauer',
        'Baxter',
        'Beach',
        'Bean',
        'Beard',
        'Beasley',
        'Beck',
        'Becker',
        'Bell',
        'Bender',
        'Benjamin',
        'Bennett',
        'Benson',
        'Bentley',
        'Benton',
        'Berg',
        'Berger',
        'Bernard',
        'Berry',
        'Best',
        'Bird',
        'Bishop',
        'Black',
        'Blackburn',
        'Blackwell',
        'Blair',
        'Blake',
        'Blanchard',
        'Blankenship',
        'Blevins',
        'Bolton',
        'Bond',
        'Bonner',
        'Booker',
        'Boone',
        'Booth',
        'Bowen',
        'Bowers',
        'Bowman',
        'Boyd',
        'Boyer',
        'Boyle',
        'Bradford',
        'Bradley',
        'Bradshaw',
        'Brady',
        'Branch',
        'Bray',
        'Brennan',
        'Brewer',
        'Bridges',
        'Briggs',
        'Bright',
        'Britt',
        'Brock',
        'Brooks',
        'Brown',
        'Browning',
        'Bruce',
        'Bryan',
        'Bryant',
        'Buchanan',
        'Buck',
        'Buckley',
        'Buckner',
        'Bullock',
        'Burch',
        'Burgess',
        'Burke',
        'Burks',
        'Burnett',
        'Burns',
        'Burris',
        'Burt',
        'Burton',
        'Bush',
        'Butler',
        'Byers',
        'Byrd',
        'Cabrera',
        'Cain',
        'Calderon',
        'Caldwell',
        'Calhoun',
        'Callahan',
        'Camacho',
        'Cameron',
        'Campbell',
        'Campos',
        'Cannon',
        'Cantrell',
        'Cantu',
        'Cardenas',
        'Carey',
        'Carlson',
        'Carney',
        'Carpenter',
        'Carr',
        'Carrillo',
        'Carroll',
        'Carson',
        'Carter',
        'Carver',
        'Case',
        'Casey',
        'Cash',
        'Castaneda',
        'Castillo',
        'Castro',
        'Cervantes',
        'Chambers',
        'Chan',
        'Chandler',
        'Chaney',
        'Chang',
        'Chapman',
        'Charles',
        'Chase',
        'Chavez',
        'Chen',
        'Cherry',
        'Christensen',
        'Christian',
        'Church',
        'Clark',
        'Clarke',
        'Clay',
        'Clayton',
        'Clements',
        'Clemons',
        'Cleveland',
        'Cline',
        'Cobb',
        'Cochran',
        'Coffey',
        'Cohen',
        'Cole',
        'Coleman',
        'Collier',
        'Collins',
        'Colon',
        'Combs',
        'Compton',
        'Conley',
        'Conner',
        'Conrad',
        'Contreras',
        'Conway',
        'Cook',
        'Cooke',
        'Cooley',
        'Cooper',
        'Copeland',
        'Cortez',
        'Cote',
        'Cotton',
        'Cox',
        'Craft',
        'Craig',
        'Crane',
        'Crawford',
        'Crosby',
        'Cross',
        'Cruz',
        'Cummings',
        'Cunningham',
        'Curry',
        'Curtis',
        'Dale',
        'Dalton',
        'Daniel',
        'Daniels',
        'Daugherty',
        'Davenport',
        'David',
        'Davidson',
        'Davis',
        'Dawson',
        'Day',
        'Dean',
        'Decker',
        'Dejesus',
        'Delacruz',
        'Delaney',
        'Deleon',
        'Delgado',
        'Dennis',
        'Diaz',
        'Dickerson',
        'Dickson',
        'Dillard',
        'Dillon',
        'Dixon',
        'Dodson',
        'Dominguez',
        'Donaldson',
        'Donovan',
        'Dorsey',
        'Dotson',
        'Douglas',
        'Downs',
        'Doyle',
        'Drake',
        'Dudley',
        'Duffy',
        'Duke',
        'Duncan',
        'Dunlap',
        'Dunn',
        'Duran',
        'Durham',
        'Dyer',
        'Eaton',
        'Edwards',
        'Elliott',
        'Ellis',
        'Ellison',
        'Emerson',
        'England',
        'English',
        'Erickson',
        'Espinoza',
        'Estes',
        'Estrada',
        'Evans',
        'Everett',
        'Ewing',
        'Farley',
        'Farmer',
        'Farrell',
        'Faulkner',
        'Ferguson',
        'Fernandez',
        'Ferrell',
        'Fields',
        'Figueroa',
        'Finch',
        'Finley',
        'Fischer',
        'Fisher',
        'Fitzgerald',
        'Fitzpatrick',
        'Fleming',
        'Fletcher',
        'Flores',
        'Flowers',
        'Floyd',
        'Flynn',
        'Foley',
        'Forbes',
        'Ford',
        'Foreman',
        'Foster',
        'Fowler',
        'Fox',
        'Francis',
        'Franco',
        'Frank',
        'Franklin',
        'Franks',
        'Frazier',
        'Frederick',
        'Freeman',
        'French',
        'Frost',
        'Fry',
        'Frye',
        'Fuentes',
        'Fuller',
        'Fulton',
        'Gaines',
        'Gallagher',
        'Gallegos',
        'Galloway',
        'Gamble',
        'Garcia',
        'Gardner',
        'Garner',
        'Garrett',
        'Garrison',
        'Garza',
        'Gates',
        'Gay',
        'Gentry',
        'George',
        'Gibbs',
        'Gibson',
        'Gilbert',
        'Giles',
        'Gill',
        'Gillespie',
        'Gilliam',
        'Gilmore',
        'Glass',
        'Glenn',
        'Glover',
        'Goff',
        'Golden',
        'Gomez',
        'Gonzales',
        'Gonzalez',
        'Good',
        'Goodman',
        'Goodwin',
        'Gordon',
        'Gould',
        'Graham',
        'Grant',
        'Graves',
        'Gray',
        'Green',
        'Greene',
        'Greer',
        'Gregory',
        'Griffin',
        'Griffith',
        'Grimes',
        'Gross',
        'Guerra',
        'Guerrero',
        'Guthrie',
        'Gutierrez',
        'Guy',
        'Guzman',
        'Hahn',
        'Hale',
        'Haley',
        'Hall',
        'Hamilton',
        'Hammond',
        'Hampton',
        'Hancock',
        'Haney',
        'Hansen',
        'Hanson',
        'Hardin',
        'Harding',
        'Hardy',
        'Harmon',
        'Harper',
        'Harrell',
        'Harrington',
        'Harris',
        'Harrison',
        'Hart',
        'Hartman',
        'Harvey',
        'Hatfield',
        'Hawkins',
        'Hayden',
        'Hayes',
        'Haynes',
        'Hays',
        'Head',
        'Heath',
        'Hebert',
        'Henderson',
        'Hendricks',
        'Hendrix',
        'Henry',
        'Hensley',
        'Henson',
        'Herman',
        'Hernandez',
        'Herrera',
        'Herring',
        'Hess',
        'Hester',
        'Hewitt',
        'Hickman',
        'Hicks',
        'Higgins',
        'Hill',
        'Hines',
        'Hinton',
        'Hobbs',
        'Hodge',
        'Hodges',
        'Hoffman',
        'Hogan',
        'Holcomb',
        'Holden',
        'Holder',
        'Holland',
        'Holloway',
        'Holman',
        'Holmes',
        'Holt',
        'Hood',
        'Hooper',
        'Hoover',
        'Hopkins',
        'Hopper',
        'Horn',
        'Horne',
        'Horton',
        'House',
        'Houston',
        'Howard',
        'Howe',
        'Howell',
        'Hubbard',
        'Huber',
        'Hudson',
        'Huff',
        'Huffman',
        'Hughes',
        'Hull',
        'Humphrey',
        'Hunt',
        'Hunter',
        'Hurley',
        'Hurst',
        'Hutchinson',
        'Hyde',
        'Ingram',
        'Irwin',
        'Jackson',
        'Jacobs',
        'Jacobson',
        'James',
        'Jarvis',
        'Jefferson',
        'Jenkins',
        'Jennings',
        'Jensen',
        'Jimenez',
        'Johns',
        'Johnson',
        'Johnston',
        'Jones',
        'Jordan',
        'Joseph',
        'Joyce',
        'Joyner',
        'Juarez',
        'Justice',
        'Kane',
        'Kaufman',
        'Keith',
        'Keller',
        'Kelley',
        'Kelly',
        'Kemp',
        'Kennedy',
        'Kent',
        'Kerr',
        'Key',
        'Kidd',
        'Kim',
        'King',
        'Kinney',
        'Kirby',
        'Kirk',
        'Kirkland',
        'Klein',
        'Kline',
        'Knapp',
        'Knight',
        'Knowles',
        'Knox',
        'Koch',
        'Kramer',
        'Lamb',
        'Lambert',
        'Lancaster',
        'Landry',
        'Lane',
        'Lang',
        'Langley',
        'Lara',
        'Larsen',
        'Larson',
        'Lawrence',
        'Lawson',
        'Le',
        'Leach',
        'Leblanc',
        'Lee',
        'Leon',
        'Leonard',
        'Lester',
        'Levine',
        'Levy',
        'Lewis',
        'Lindsay',
        'Lindsey',
        'Little',
        'Livingston',
        'Lloyd',
        'Logan',
        'Long',
        'Lopez',
        'Lott',
        'Love',
        'Lowe',
        'Lowery',
        'Lucas',
        'Luna',
        'Lynch',
        'Lynn',
        'Lyons',
        'Macdonald',
        'Macias',
        'Mack',
        'Madden',
        'Maddox',
        'Maldonado',
        'Malone',
        'Mann',
        'Manning',
        'Marks',
        'Marquez',
        'Marsh',
        'Marshall',
        'Martin',
        'Martinez',
        'Mason',
        'Massey',
        'Mathews',
        'Mathis',
        'Matthews',
        'Maxwell',
        'May',
        'Mayer',
        'Maynard',
        'Mayo',
        'Mays',
        'Mcbride',
        'Mccall',
        'Mccarthy',
        'Mccarty',
        'Mcclain',
        'Mcclure',
        'Mcconnell',
        'Mccormick',
        'Mccoy',
        'Mccray',
        'Mccullough',
        'Mcdaniel',
        'Mcdonald',
        'Mcdowell',
        'Mcfadden',
        'Mcfarland',
        'Mcgee',
        'Mcgowan',
        'Mcguire',
        'Mcintosh',
        'Mcintyre',
        'Mckay',
        'Mckee',
        'Mckenzie',
        'Mckinney',
        'Mcknight',
        'Mclaughlin',
        'Mclean',
        'Mcleod',
        'Mcmahon',
        'Mcmillan',
        'Mcneil',
        'Mcpherson',
        'Meadows',
        'Medina',
        'Mejia',
        'Melendez',
        'Melton',
        'Mendez',
        'Mendoza',
        'Mercado',
        'Mercer',
        'Merrill',
        'Merritt',
        'Meyer',
        'Meyers',
        'Michael',
        'Middleton',
        'Miles',
        'Miller',
        'Mills',
        'Miranda',
        'Mitchell',
        'Molina',
        'Monroe',
        'Montgomery',
        'Montoya',
        'Moody',
        'Moon',
        'Mooney',
        'Moore',
        'Morales',
        'Moran',
        'Moreno',
        'Morgan',
        'Morin',
        'Morris',
        'Morrison',
        'Morrow',
        'Morse',
        'Morton',
        'Moses',
        'Mosley',
        'Moss',
        'Mueller',
        'Mullen',
        'Mullins',
        'Munoz',
        'Murphy',
        'Murray',
        'Myers',
        'Nash',
        'Navarro',
        'Neal',
        'Nelson',
        'Newman',
        'Newton',
        'Nguyen',
        'Nichols',
        'Nicholson',
        'Nielsen',
        'Nieves',
        'Nixon',
        'Noble',
        'Noel',
        'Nolan',
        'Norman',
        'Norris',
        'Norton',
        'Nunez',
        'Obrien',
        'Ochoa',
        'Oconnor',
        'Odom',
        'Odonnell',
        'Oliver',
        'Olsen',
        'Olson',
        'Oneal',
        'Oneil',
        'Oneill',
        'Orr',
        'Ortega',
        'Ortiz',
        'Osborn',
        'Osborne',
        'Owen',
        'Owens',
        'Pace',
        'Pacheco',
        'Padilla',
        'Page',
        'Palmer',
        'Park',
        'Parker',
        'Parks',
        'Parrish',
        'Parsons',
        'Pate',
        'Patel',
        'Patrick',
        'Patterson',
        'Patton',
        'Paul',
        'Payne',
        'Pearson',
        'Peck',
        'Pena',
        'Pennington',
        'Perez',
        'Perkins',
        'Perry',
        'Peters',
        'Petersen',
        'Peterson',
        'Petty',
        'Phelps',
        'Phillips',
        'Pickett',
        'Pierce',
        'Pittman',
        'Pitts',
        'Pollard',
        'Poole',
        'Pope',
        'Porter',
        'Potter',
        'Potts',
        'Powell',
        'Powers',
        'Pratt',
        'Preston',
        'Price',
        'Prince',
        'Pruitt',
        'Puckett',
        'Pugh',
        'Quinn',
        'Ramirez',
        'Ramos',
        'Ramsey',
        'Randall',
        'Randolph',
        'Rasmussen',
        'Ratliff',
        'Ray',
        'Raymond',
        'Reed',
        'Reese',
        'Reeves',
        'Reid',
        'Reilly',
        'Reyes',
        'Reynolds',
        'Rhodes',
        'Rice',
        'Rich',
        'Richard',
        'Richards',
        'Richardson',
        'Richmond',
        'Riddle',
        'Riggs',
        'Riley',
        'Rios',
        'Rivas',
        'Rivera',
        'Rivers',
        'Roach',
        'Robbins',
        'Roberson',
        'Roberts',
        'Robertson',
        'Robinson',
        'Robles',
        'Rocha',
        'Rodgers',
        'Rodriguez',
        'Rodriquez',
        'Rogers',
        'Rojas',
        'Rollins',
        'Roman',
        'Romero',
        'Rosa',
        'Rosales',
        'Rosario',
        'Rose',
        'Ross',
        'Roth',
        'Rowe',
        'Rowland',
        'Roy',
        'Ruiz',
        'Rush',
        'Russell',
        'Russo',
        'Rutledge',
        'Ryan',
        'Salas',
        'Salazar',
        'Salinas',
        'Sampson',
        'Sanchez',
        'Sanders',
        'Sandoval',
        'Sanford',
        'Santana',
        'Santiago',
        'Santos',
        'Sargent',
        'Saunders',
        'Savage',
        'Sawyer',
        'Schmidt',
        'Schneider',
        'Schroeder',
        'Schultz',
        'Schwartz',
        'Scott',
        'Sears',
        'Sellers',
        'Serrano',
        'Sexton',
        'Shaffer',
        'Shannon',
        'Sharp',
        'Sharpe',
        'Shaw',
        'Shelton',
        'Shepard',
        'Shepherd',
        'Sheppard',
        'Sherman',
        'Shields',
        'Short',
        'Silva',
        'Simmons',
        'Simon',
        'Simpson',
        'Sims',
        'Singleton',
        'Skinner',
        'Slater',
        'Sloan',
        'Small',
        'Smith',
        'Snider',
        'Snow',
        'Snyder',
        'Solis',
        'Solomon',
        'Sosa',
        'Soto',
        'Sparks',
        'Spears',
        'Spence',
        'Spencer',
        'Stafford',
        'Stanley',
        'Stanton',
        'Stark',
        'Steele',
        'Stein',
        'Stephens',
        'Stephenson',
        'Stevens',
        'Stevenson',
        'Stewart',
        'Stokes',
        'Stone',
        'Stout',
        'Strickland',
        'Strong',
        'Stuart',
        'Suarez',
        'Sullivan',
        'Summers',
        'Sutton',
        'Swanson',
        'Sweeney',
        'Sweet',
        'Sykes',
        'Talley',
        'Tanner',
        'Tate',
        'Taylor',
        'Terrell',
        'Terry',
        'Thomas',
        'Thompson',
        'Thornton',
        'Tillman',
        'Todd',
        'Torres',
        'Townsend',
        'Tran',
        'Travis',
        'Trevino',
        'Trujillo',
        'Tucker',
        'Turner',
        'Tyler',
        'Tyson',
        'Underwood',
        'Valdez',
        'Valencia',
        'Valentine',
        'Valenzuela',
        'Vance',
        'Vang',
        'Vargas',
        'Vasquez',
        'Vaughan',
        'Vaughn',
        'Vazquez',
        'Vega',
        'Velasquez',
        'Velazquez',
        'Velez',
        'Villarreal',
        'Vincent',
        'Vinson',
        'Wade',
        'Wagner',
        'Walker',
        'Wall',
        'Wallace',
        'Waller',
        'Walls',
        'Walsh',
        'Walter',
        'Walters',
        'Walton',
        'Ward',
        'Ware',
        'Warner',
        'Warren',
        'Washington',
        'Waters',
        'Watkins',
        'Watson',
        'Watts',
        'Weaver',
        'Webb',
        'Weber',
        'Webster',
        'Weeks',
        'Weiss',
        'Welch',
        'Wells',
        'West',
        'Wheeler',
        'Whitaker',
        'White',
        'Whitehead',
        'Whitfield',
        'Whitley',
        'Whitney',
        'Wiggins',
        'Wilcox',
        'Wilder',
        'Wiley',
        'Wilkerson',
        'Wilkins',
        'Wilkinson',
        'William',
        'Williams',
        'Williamson',
        'Willis',
        'Wilson',
        'Winters',
        'Wise',
        'Witt',
        'Wolf',
        'Wolfe',
        'Wong',
        'Wood',
        'Woodard',
        'Woods',
        'Woodward',
        'Wooten',
        'Workman',
        'Wright',
        'Wyatt',
        'Wynn',
        'Yang',
        'Yates',
        'York',
        'Young',
        'Zamora',
        'Zimmerman'];

    //Generate a random forename.
    $random_name = $names[mt_rand(0, sizeof($names) - 1)];

    //Generate a random surname.
    $random_surname = $surnames[mt_rand(0, sizeof($surnames) - 1)];

    //Combine them together and print out the result.
    // echo $random_name . ' ' . $random_surname;
    return [$random_name, $random_surname];
}
