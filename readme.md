# save my data

## <sub>(draft title)</sub>

a simple framework to save various data based on users

## dependencies

-   **Auth**: [PHP-JWT](https://github.com/firebase/php-jwt)

## links

**SQLite**
- 	https://openwritings.net/pg/php/php-using-pdo-sqlite
-   https://github.com/vielhuber/dbhelper
-   https://github.com/nivunkpv/Sqlite-Wrapper
-   https://github.com/tommyknocker/pdo-database-class

**import css with js**

```JS
(async function () {

	// Polyfill for older browsers
	if (CSS["paintWorklet"] === undefined) {
		await import("https://unpkg.com/css-paint-polyfill");
	}

	// Looking for the source of the Paint Worklet?
	// ~> Go check out https://github.com/bramus/css-houdini-circles
	CSS.paintWorklet.addModule('https://unpkg.com/css-houdini-circles/dist/circles.js');
})();
```
